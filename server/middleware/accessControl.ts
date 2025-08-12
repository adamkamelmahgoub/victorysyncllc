
import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';
import { createHash } from 'crypto';
import jwt from 'jsonwebtoken';

interface AuthenticatedUser {
  id: number;
  email: string;
  name: string;
  role: string;
  orgId?: string;
  permissions: string[];
  featureFlags: string[];
  isSuperAdmin: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;
    const user = await storage.getPublicUserById(decoded.userId);

    if (!user || user.status !== 'active') {
      return res.status(403).json({ error: 'User not found or inactive' });
    }

    // Get user permissions and feature flags
    const permissions = await storage.getUserPermissions(user.id);
    const featureFlags = await storage.getUserFeatureFlags(user.id);

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role || 'customer',
      orgId: user.orgId,
      permissions,
      featureFlags,
      isSuperAdmin: user.role === 'superAdmin'
    };

    // Update last login
    await storage.updateLastLogin(user.id);

    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const authorize = (requiredPermissions: string[] = [], requiredRoles: string[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Super admin bypasses all checks
    if (req.user.isSuperAdmin) {
      return next();
    }

    // Check role requirement
    if (requiredRoles.length > 0 && !requiredRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient role privileges' });
    }

    // Check permission requirement
    if (requiredPermissions.length > 0) {
      const hasPermission = requiredPermissions.every(permission => 
        req.user!.permissions.includes(permission)
      );
      if (!hasPermission) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
    }

    next();
  };
};

export const enforceFeatureFlag = (flagKey: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (req.user.isSuperAdmin || req.user.featureFlags.includes(flagKey)) {
      return next();
    }

    return res.status(403).json({ error: 'Feature not enabled for user' });
  };
};

export const enforcePaymentMethodAllowed = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const { paymentMethod } = req.body;
  if (!paymentMethod) {
    return next(); // No payment method specified, continue
  }

  try {
    const allowedMethods = await storage.getAllowedPaymentMethods(req.user.id, req.user.orgId);
    
    if (!allowedMethods.includes(paymentMethod)) {
      return res.status(403).json({ 
        error: 'Payment method not allowed',
        allowedMethods 
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: 'Failed to validate payment method' });
  }
};

export const enforceIntegrationPolicy = (provider: string, scope: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (req.user.isSuperAdmin) {
      return next();
    }

    try {
      const allowedScopes = await storage.getAllowedIntegrationScopes(
        req.user.id, 
        req.user.orgId, 
        provider
      );

      if (!allowedScopes.includes(scope)) {
        return res.status(403).json({ 
          error: 'Integration scope not allowed',
          provider,
          scope,
          allowedScopes
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ error: 'Failed to validate integration policy' });
    }
  };
};

export const auditLog = (action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    
    res.send = function(body) {
      // Log successful operations (2xx status codes)
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        storage.createAuditLog({
          actorUserId: req.user.id,
          targetUserId: req.params.userId ? parseInt(req.params.userId) : null,
          targetOrgId: req.params.orgId || null,
          action,
          before: req.body._before || null,
          after: req.body._after || JSON.parse(body),
          ip: req.ip,
          userAgent: req.get('User-Agent') || null
        }).catch(console.error);
      }
      
      return originalSend.call(this, body);
    };

    next();
  };
};

export const rateLimitByApiKey = async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;
  
  if (!apiKey) {
    return next();
  }

  try {
    const keyHash = createHash('sha256').update(apiKey).digest('hex');
    const apiKeyRecord = await storage.getApiKeyByHash(keyHash);

    if (!apiKeyRecord || apiKeyRecord.revokedAt) {
      return res.status(401).json({ error: 'Invalid or revoked API key' });
    }

    // Check IP allowlist if configured
    if (apiKeyRecord.ipAllowlist && apiKeyRecord.ipAllowlist.length > 0) {
      const clientIp = req.ip;
      if (!apiKeyRecord.ipAllowlist.includes(clientIp)) {
        return res.status(403).json({ error: 'IP not allowed for this API key' });
      }
    }

    // Check rate limit if configured
    if (apiKeyRecord.rateLimitPerMin) {
      const usage = await storage.getApiKeyUsage(apiKeyRecord.id, 60); // last minute
      if (usage >= apiKeyRecord.rateLimitPerMin) {
        return res.status(429).json({ error: 'Rate limit exceeded' });
      }
    }

    // Update last used
    await storage.updateApiKeyLastUsed(apiKeyRecord.id);

    // Set scopes for authorization
    req.user = {
      ...req.user,
      permissions: apiKeyRecord.scopes
    } as AuthenticatedUser;

    next();
  } catch (error) {
    return res.status(500).json({ error: 'Failed to validate API key' });
  }
};

export const encryptSecret = (text: string): string => {
  const crypto = require('crypto');
  const algorithm = 'aes-256-gcm';
  const key = Buffer.from(process.env.ENC_KEY || '00000000000000000000000000000000', 'hex');
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipher(algorithm, key);
  cipher.setAAD(Buffer.from('secret'));
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
};

export const decryptSecret = (encryptedText: string): string => {
  const crypto = require('crypto');
  const algorithm = 'aes-256-gcm';
  const key = Buffer.from(process.env.ENC_KEY || '00000000000000000000000000000000', 'hex');
  
  const parts = encryptedText.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encrypted = parts[2];
  
  const decipher = crypto.createDecipher(algorithm, key);
  decipher.setAuthTag(authTag);
  decipher.setAAD(Buffer.from('secret'));
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};
