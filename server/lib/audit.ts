import { db } from '../db';
import { auditLogs } from '../../shared/schema';
import { Request } from 'express';

export const AUDIT_ACTIONS = {
  // Authentication
  LOGIN: 'login',
  LOGIN_FAILED: 'login_failed',
  LOGOUT: 'logout',
  PASSWORD_RESET: 'password_reset',
  ENABLE_2FA: 'enable_2fa',
  DISABLE_2FA: 'disable_2fa',

  // Access codes
  ACCESS_CODE_CREATED: 'access_code_created',
  ACCESS_CODE_USED: 'access_code_used',
  ACCESS_CODE_REVOKED: 'access_code_revoked',

  // User management
  USER_CREATED: 'user_created',
  USER_UPDATED: 'user_updated',
  USER_DEACTIVATED: 'user_deactivated',
  USER_ROLE_ASSIGNED: 'user_role_assigned',
  USER_ROLE_REMOVED: 'user_role_removed',

  // Organization
  ORG_CREATED: 'organization_created',
  ORG_UPDATED: 'organization_updated',
  ORG_SUSPENDED: 'organization_suspended',

  // Integrations
  INTEGRATION_CONNECTED: 'integration_connected',
  INTEGRATION_DISCONNECTED: 'integration_disconnected',
  INTEGRATION_SYNCED: 'integration_synced',

  // Billing
  PLAN_CHANGED: 'plan_changed',
  PORTAL_OPENED: 'portal_opened',

  // Admin actions
  ADMIN_IMPERSONATE_START: 'admin_impersonate_start',
  ADMIN_IMPERSONATE_END: 'admin_impersonate_end',
} as const;

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
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId,
      meta: data.meta,
      ip: data.ip,
      userAgent: data.userAgent,
      orgId: data.orgId || undefined,
      actorUserId: data.actorUserId,
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Don't throw - audit logging shouldn't break business logic
  }
}

export function auditMiddleware(action: string, entityType: string) {
  return (req: any, res: any, next: any) => {
    (req as any).auditInfo = {
      action,
      entityType,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      orgId: req.user?.orgId || undefined,
      actorUserId: req.user?.id
    };
    next();
  };
}

export async function auditAction(
  req: Request,
  entityId?: string,
  meta?: Record<string, any>
) {
  if ((req as any).auditInfo) {
    await createAuditLog({
      ...(req as any).auditInfo,
      entityId,
      meta
    });
  }
}