
import express from 'express';
import { z } from 'zod';
import { db } from '../db';
import { apiCredentials } from '@shared/schema';
import { eq, and } from 'drizzle-orm';
import { 
  authenticateToken, requirePermissions, AuthService, 
  type AuthenticatedRequest 
} from '../lib/auth';
import { connectIntegrationSchema } from '@shared/schema';

const router = express.Router();

router.use(authenticateToken);

// Get integration status
router.get('/status', requirePermissions('integration:view'), async (req: AuthenticatedRequest, res) => {
  try {
    const orgId = req.user!.orgId;
    if (!orgId) {
      return res.status(403).json({ 
        ok: false, 
        error: 'org_required', 
        message: 'Organization membership required' 
      });
    }

    const integrations = await db.query.apiCredentials.findMany({
      where: eq(apiCredentials.orgId, orgId),
    });

    const statusMap: Record<string, any> = {};
    integrations.forEach(integration => {
      statusMap[integration.provider] = {
        connected: integration.status === 'active',
        lastSyncAt: integration.lastSyncAt,
        authType: integration.authType,
      };
    });

    // Add providers that aren't connected
    const allProviders = [
      'hubspot', 'salesforce', 'zoho', 'pipedrive',
      'five9', 'ringcentral', 'twilio', 'aircall',
      'zendesk', 'freshdesk', 'intercom', 'helpscout'
    ];

    allProviders.forEach(provider => {
      if (!statusMap[provider]) {
        statusMap[provider] = {
          connected: false,
          lastSyncAt: null,
          authType: null,
        };
      }
    });

    res.json({ ok: true, data: { integrations: statusMap } });
  } catch (error) {
    console.error('Get integrations status error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: 'Failed to fetch integration status' 
    });
  }
});

// Connect integration
router.post('/:provider/connect', requirePermissions('integration:manage'), async (req: AuthenticatedRequest, res) => {
  try {
    const orgId = req.user!.orgId;
    if (!orgId) {
      return res.status(403).json({ 
        ok: false, 
        error: 'org_required', 
        message: 'Organization membership required' 
      });
    }

    const provider = req.params.provider;
    const { authType, credentials } = req.body;

    if (!['hubspot', 'salesforce', 'zoho', 'pipedrive', 'five9', 'ringcentral', 'twilio', 'aircall', 'zendesk', 'freshdesk', 'intercom', 'helpscout'].includes(provider)) {
      return res.status(400).json({ 
        ok: false, 
        error: 'invalid_provider', 
        message: 'Invalid integration provider' 
      });
    }

    if (!['oauth', 'apikey'].includes(authType)) {
      return res.status(400).json({ 
        ok: false, 
        error: 'invalid_auth_type', 
        message: 'Invalid authentication type' 
      });
    }

    // Validate credentials based on provider and auth type
    const isValid = await validateCredentials(provider, authType, credentials);
    if (!isValid) {
      return res.status(400).json({ 
        ok: false, 
        error: 'invalid_credentials', 
        message: 'Invalid or expired credentials' 
      });
    }

    // Encrypt credentials
    const encryptedData = AuthService.encrypt(JSON.stringify(credentials));

    // Check if integration already exists
    const existingIntegration = await db.query.apiCredentials.findFirst({
      where: and(
        eq(apiCredentials.orgId, orgId),
        eq(apiCredentials.provider, provider as any)
      ),
    });

    if (existingIntegration) {
      // Update existing
      await db.update(apiCredentials)
        .set({
          authType: authType as any,
          data: encryptedData,
          status: 'active',
          updatedAt: new Date(),
        })
        .where(eq(apiCredentials.id, existingIntegration.id));
    } else {
      // Create new
      await db.insert(apiCredentials).values({
        orgId,
        provider: provider as any,
        authType: authType as any,
        data: encryptedData,
        status: 'active',
      });
    }

    // Log audit
    await AuthService.logAudit(
      'connect_integration',
      'integration',
      provider,
      { provider, authType },
      req.user!.id,
      orgId,
      req
    );

    res.json({ 
      ok: true, 
      message: `${provider} integration connected successfully` 
    });
  } catch (error) {
    console.error('Connect integration error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: 'Failed to connect integration' 
    });
  }
});

// Disconnect integration
router.delete('/:provider', requirePermissions('integration:manage'), async (req: AuthenticatedRequest, res) => {
  try {
    const orgId = req.user!.orgId;
    if (!orgId) {
      return res.status(403).json({ 
        ok: false, 
        error: 'org_required', 
        message: 'Organization membership required' 
      });
    }

    const provider = req.params.provider;

    await db.update(apiCredentials)
      .set({ status: 'inactive' })
      .where(and(
        eq(apiCredentials.orgId, orgId),
        eq(apiCredentials.provider, provider as any)
      ));

    // Log audit
    await AuthService.logAudit(
      'disconnect_integration',
      'integration',
      provider,
      { provider },
      req.user!.id,
      orgId,
      req
    );

    res.json({ 
      ok: true, 
      message: `${provider} integration disconnected` 
    });
  } catch (error) {
    console.error('Disconnect integration error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: 'Failed to disconnect integration' 
    });
  }
});

// Test connection
router.post('/:provider/test', requirePermissions('integration:manage'), async (req: AuthenticatedRequest, res) => {
  try {
    const orgId = req.user!.orgId;
    if (!orgId) {
      return res.status(403).json({ 
        ok: false, 
        error: 'org_required', 
        message: 'Organization membership required' 
      });
    }

    const provider = req.params.provider;

    const integration = await db.query.apiCredentials.findFirst({
      where: and(
        eq(apiCredentials.orgId, orgId),
        eq(apiCredentials.provider, provider as any)
      ),
    });

    if (!integration) {
      return res.status(404).json({ 
        ok: false, 
        error: 'not_connected', 
        message: 'Integration not connected' 
      });
    }

    // Decrypt credentials and test connection
    const credentials = JSON.parse(AuthService.decrypt(integration.data));
    const isWorking = await testConnection(provider, integration.authType, credentials);

    if (isWorking) {
      // Update last sync time
      await db.update(apiCredentials)
        .set({ lastSyncAt: new Date() })
        .where(eq(apiCredentials.id, integration.id));
    }

    res.json({ 
      ok: true, 
      data: { 
        connected: isWorking,
        lastTested: new Date(),
      } 
    });
  } catch (error) {
    console.error('Test integration error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: 'Failed to test integration' 
    });
  }
});

// Trigger sync
router.post('/:provider/sync', requirePermissions('integration:manage'), async (req: AuthenticatedRequest, res) => {
  try {
    const orgId = req.user!.orgId;
    if (!orgId) {
      return res.status(403).json({ 
        ok: false, 
        error: 'org_required', 
        message: 'Organization membership required' 
      });
    }

    const provider = req.params.provider;

    const integration = await db.query.apiCredentials.findFirst({
      where: and(
        eq(apiCredentials.orgId, orgId),
        eq(apiCredentials.provider, provider as any)
      ),
    });

    if (!integration || integration.status !== 'active') {
      return res.status(404).json({ 
        ok: false, 
        error: 'not_connected', 
        message: 'Integration not connected or inactive' 
      });
    }

    // TODO: Queue sync job
    // await queueSyncJob(orgId, provider, integration.id);

    // For now, just update the lastSyncAt timestamp
    await db.update(apiCredentials)
      .set({ lastSyncAt: new Date() })
      .where(eq(apiCredentials.id, integration.id));

    // Log audit
    await AuthService.logAudit(
      'sync_integration',
      'integration',
      provider,
      { provider },
      req.user!.id,
      orgId,
      req
    );

    res.json({ 
      ok: true, 
      message: 'Sync triggered successfully' 
    });
  } catch (error) {
    console.error('Sync integration error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: 'Failed to trigger sync' 
    });
  }
});

// Helper functions
async function validateCredentials(provider: string, authType: string, credentials: any): Promise<boolean> {
  // Basic validation - in production, this should make actual API calls to validate
  if (authType === 'apikey') {
    return credentials.apiKey && credentials.apiKey.length > 0;
  } else if (authType === 'oauth') {
    return credentials.accessToken && credentials.refreshToken;
  }
  return false;
}

async function testConnection(provider: string, authType: string, credentials: any): Promise<boolean> {
  try {
    // In production, this should make actual API calls to test the connection
    // For now, just simulate a successful test
    return true;
  } catch {
    return false;
  }
}

export default router;
