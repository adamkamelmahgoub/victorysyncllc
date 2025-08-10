
import { db } from '../db.js';
import { auditLogs } from '../db/schema.js';

export interface AuditLogData {
  orgId?: number | null;
  actorUserId?: number | null;
  action: string;
  entityType: string;
  entityId?: string;
  meta?: any;
  ip?: string;
  userAgent?: string;
}

export async function auditLog(data: AuditLogData) {
  try {
    await db.insert(auditLogs).values({
      orgId: data.orgId || null,
      actorUserId: data.actorUserId || null,
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId || null,
      meta: data.meta || null,
      ip: data.ip || null,
      userAgent: data.userAgent || null,
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}
