
import { db } from '../db';
import { auditLogs } from '../../shared/schema';
import { Request } from 'express';

interface AuditLogData {
  orgId?: number;
  actorUserId?: number;
  action: string;
  entityType: string;
  entityId?: string;
  meta?: Record<string, any>;
  ip?: string;
  userAgent?: string;
}

export async function createAuditLog(data: AuditLogData) {
  try {
    await db.insert(auditLogs).values({
      orgId: data.orgId,
      actorUserId: data.actorUserId,
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId,
      meta: data.meta,
      ip: data.ip,
      userAgent: data.userAgent,
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Don't throw - audit logging shouldn't break business logic
  }
}

export function auditMiddleware(action: string, entityType: string) {
  return (req: any, res: any, next: any) => {
    // Store audit info on request for later use
    req.auditInfo = {
      action,
      entityType,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      orgId: req.user?.orgId,
      actorUserId: req.user?.id
    };
    next();
  };
}

export async function auditAction(
  req: any,
  entityId?: string,
  meta?: Record<string, any>
) {
  if (req.auditInfo) {
    await createAuditLog({
      ...req.auditInfo,
      entityId,
      meta
    });
  }
}

// Common audit actions
export const AUDIT_ACTIONS = {
  // Authentication
  LOGIN: 'user.login',
  LOGIN_FAILED: 'user.login_failed',
  LOGOUT: 'user.logout',
  PASSWORD_RESET: 'user.password_reset',
  ENABLE_2FA: 'user.enable_2fa',
  DISABLE_2FA: 'user.disable_2fa',

  // Access codes
  ACCESS_CODE_CREATED: 'access_code.created',
  ACCESS_CODE_USED: 'access_code.used',
  ACCESS_CODE_REVOKED: 'access_code.revoked',

  // User management
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_DEACTIVATED: 'user.deactivated',
  USER_ROLE_ASSIGNED: 'user.role_assigned',
  USER_ROLE_REMOVED: 'user.role_removed',

  // Organization
  ORG_CREATED: 'organization.created',
  ORG_UPDATED: 'organization.updated',
  ORG_SUSPENDED: 'organization.suspended',

  // Integrations
  INTEGRATION_CONNECTED: 'integration.connected',
  INTEGRATION_DISCONNECTED: 'integration.disconnected',
  INTEGRATION_SYNCED: 'integration.synced',

  // Billing
  PLAN_CHANGED: 'billing.plan_changed',
  PORTAL_OPENED: 'billing.portal_opened',

  // Admin actions
  ADMIN_IMPERSONATE_START: 'admin.impersonate_start',
  ADMIN_IMPERSONATE_END: 'admin.impersonate_end',
} as const;
