
import express from 'express';
import { z } from 'zod';
import { sql } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { db } from '../db';
import { 
  organizations, users, accessCodes, subscriptions, invoices, 
  auditLogs, userRoles, roles 
} from '@shared/schema';
import { eq, desc, and, or, like, count, gte, lte } from 'drizzle-orm';
import { authenticateToken, requireSuperAdmin, AuthService, type AuthenticatedRequest } from '../lib/auth';
import { createAccessCodeSchema, createOrgSchema } from '@shared/schema';

const router = express.Router();

// All admin routes require super admin access
router.use(authenticateToken);
router.use(requireSuperAdmin);

// Dashboard overview
router.get('/overview', async (req: AuthenticatedRequest, res) => {
  try {
    const [
      totalOrgs,
      totalUsers,
      activeAccessCodes,
      totalRevenue
    ] = await Promise.all([
      db.select({ count: count() }).from(organizations),
      db.select({ count: count() }).from(users),
      db.select({ count: count() }).from(accessCodes).where(eq(accessCodes.status, 'active')),
      db.select({ 
        total: sql<number>`COALESCE(SUM(CAST(amount AS DECIMAL)), 0)` 
      }).from(invoices).where(eq(invoices.status, 'paid')),
    ]);

    // Recent activity
    const recentAudits = await db.query.auditLogs.findMany({
      limit: 10,
      orderBy: desc(auditLogs.createdAt),
      with: {
        actorUser: {
          columns: { name: true, email: true },
        },
        organization: {
          columns: { name: true },
        },
      },
    });

    res.json({
      ok: true,
      data: {
        stats: {
          organizations: totalOrgs[0].count,
          users: totalUsers[0].count,
          activeAccessCodes: activeAccessCodes[0].count,
          revenue: totalRevenue[0].total || 0,
        },
        recentActivity: recentAudits,
      },
    });
  } catch (error) {
    console.error('Admin overview error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: 'Failed to load overview' 
    });
  }
});

// Organizations CRUD
router.get('/organizations', async (req: AuthenticatedRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const offset = (page - 1) * limit;

    let whereClause = undefined;
    if (search) {
      whereClause = or(
        like(organizations.name, `%${search}%`),
        like(organizations.slug, `%${search}%`)
      );
    }

    const [orgsData, totalCount] = await Promise.all([
      db.query.organizations.findMany({
        where: whereClause,
        limit,
        offset,
        orderBy: desc(organizations.createdAt),
        with: {
          users: {
            columns: { id: true },
          },
          subscriptions: {
            limit: 1,
            orderBy: desc(subscriptions.createdAt),
          },
        },
      }),
      db.select({ count: count() }).from(organizations).where(whereClause),
    ]);

    const orgs = orgsData.map(org => ({
      ...org,
      userCount: org.users.length,
      currentPlan: org.subscriptions[0]?.plan || null,
      subscriptionStatus: org.subscriptions[0]?.status || null,
    }));

    res.json({
      ok: true,
      data: {
        organizations: orgs,
        pagination: {
          page,
          limit,
          total: totalCount[0].count,
          totalPages: Math.ceil(totalCount[0].count / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get organizations error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: 'Failed to fetch organizations' 
    });
  }
});

router.post('/organizations', async (req: AuthenticatedRequest, res) => {
  try {
    const { name, slug } = createOrgSchema.parse(req.body);

    const [newOrg] = await db.insert(organizations)
      .values({ name, slug, status: 'active' })
      .returning();

    // Create default roles for the organization
    const { createOrgRoles } = await import('../scripts/seedSuperAdmin');
    await createOrgRoles(newOrg.id);

    // Log audit
    await AuthService.logAudit(
      'create_organization',
      'organization',
      newOrg.id.toString(),
      { name, slug },
      req.user!.id,
      undefined,
      req
    );

    res.json({ ok: true, data: newOrg });
  } catch (error) {
    console.error('Create organization error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        ok: false, 
        error: 'validation_error', 
        message: 'Invalid input',
        errors: error.errors 
      });
    }
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: 'Failed to create organization' 
    });
  }
});

router.patch('/organizations/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, slug, status } = req.body;

    const [updatedOrg] = await db.update(organizations)
      .set({ 
        name,
        slug, 
        status,
        updatedAt: new Date() 
      })
      .where(eq(organizations.id, id))
      .returning();

    if (!updatedOrg) {
      return res.status(404).json({ 
        ok: false, 
        error: 'not_found', 
        message: 'Organization not found' 
      });
    }

    // Log audit
    await AuthService.logAudit(
      'update_organization',
      'organization',
      id.toString(),
      { name, slug, status },
      req.user!.id,
      id,
      req
    );

    res.json({ ok: true, data: updatedOrg });
  } catch (error) {
    console.error('Update organization error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: 'Failed to update organization' 
    });
  }
});

router.post('/organizations/:id/impersonate', async (req: AuthenticatedRequest, res) => {
  try {
    const orgId = parseInt(req.params.id);

    // Find org owner
    const orgOwner = await db.query.users.findFirst({
      where: and(
        eq(users.orgId, orgId),
        eq(users.isActive, true)
      ),
      with: {
        userRoles: {
          with: {
            role: true,
          },
        },
      },
    });

    if (!orgOwner) {
      return res.status(404).json({ 
        ok: false, 
        error: 'no_owner', 
        message: 'No active owner found for this organization' 
      });
    }

    // Check if user has org owner role
    const hasOwnerRole = orgOwner.userRoles.some(ur => ur.role.name === 'Org Owner');
    if (!hasOwnerRole) {
      return res.status(400).json({ 
        ok: false, 
        error: 'invalid_owner', 
        message: 'User is not an organization owner' 
      });
    }

    // Generate impersonation token
    const impersonationToken = AuthService.generateAccessToken(orgOwner);

    // Log audit for impersonation start
    await AuthService.logAudit(
      'impersonate_start',
      'user',
      orgOwner.id.toString(),
      { impersonatedBy: req.user!.id },
      req.user!.id,
      orgId,
      req
    );

    res.json({
      ok: true,
      data: {
        token: impersonationToken,
        user: {
          id: orgOwner.id,
          name: orgOwner.name,
          email: orgOwner.email,
          orgId: orgOwner.orgId,
        },
      },
    });
  } catch (error) {
    console.error('Impersonation error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: 'Failed to impersonate user' 
    });
  }
});

// Access Codes Management
router.get('/access-codes', async (req: AuthenticatedRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const offset = (page - 1) * limit;

    let whereClause = undefined;
    if (status) {
      whereClause = eq(accessCodes.status, status as any);
    }

    const [codesData, totalCount] = await Promise.all([
      db.query.accessCodes.findMany({
        where: whereClause,
        limit,
        offset,
        orderBy: desc(accessCodes.createdAt),
        with: {
          issuedByUser: {
            columns: { name: true, email: true },
          },
          consumedByUser: {
            columns: { name: true, email: true },
          },
          organization: {
            columns: { name: true, slug: true },
          },
        },
      }),
      db.select({ count: count() }).from(accessCodes).where(whereClause),
    ]);

    res.json({
      ok: true,
      data: {
        accessCodes: codesData,
        pagination: {
          page,
          limit,
          total: totalCount[0].count,
          totalPages: Math.ceil(totalCount[0].count / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get access codes error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: 'Failed to fetch access codes' 
    });
  }
});

router.post('/access-codes', async (req: AuthenticatedRequest, res) => {
  try {
    const { orgName, expiresAt, notes } = createAccessCodeSchema.parse(req.body);

    const code = crypto.randomBytes(16).toString('hex').toUpperCase();
    let orgId = null;

    // If orgName provided, find or create org
    if (orgName) {
      const slug = orgName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      
      const existingOrg = await db.query.organizations.findFirst({
        where: or(
          eq(organizations.name, orgName),
          eq(organizations.slug, slug)
        ),
      });

      if (existingOrg) {
        orgId = existingOrg.id;
      } else {
        const [newOrg] = await db.insert(organizations)
          .values({
            name: orgName,
            slug,
            status: 'active',
          })
          .returning();
        
        orgId = newOrg.id;
        
        // Create default roles for the new organization
        const { createOrgRoles } = await import('../scripts/seedSuperAdmin');
        await createOrgRoles(newOrg.id);
      }
    }

    const [newCode] = await db.insert(accessCodes)
      .values({
        code,
        orgId,
        issuedByUserId: req.user!.id,
        status: 'active',
        expiresAt: new Date(expiresAt),
        notes,
      })
      .returning();

    // Log audit
    await AuthService.logAudit(
      'create_access_code',
      'access_code',
      newCode.id.toString(),
      { code, orgName, expiresAt, notes },
      req.user!.id,
      orgId,
      req
    );

    res.json({ ok: true, data: newCode });
  } catch (error) {
    console.error('Create access code error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        ok: false, 
        error: 'validation_error', 
        message: 'Invalid input',
        errors: error.errors 
      });
    }
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: 'Failed to create access code' 
    });
  }
});

router.patch('/access-codes/:id/revoke', async (req: AuthenticatedRequest, res) => {
  try {
    const id = parseInt(req.params.id);

    const [updatedCode] = await db.update(accessCodes)
      .set({ status: 'revoked' })
      .where(eq(accessCodes.id, id))
      .returning();

    if (!updatedCode) {
      return res.status(404).json({ 
        ok: false, 
        error: 'not_found', 
        message: 'Access code not found' 
      });
    }

    // Log audit
    await AuthService.logAudit(
      'revoke_access_code',
      'access_code',
      id.toString(),
      {},
      req.user!.id,
      updatedCode.orgId,
      req
    );

    res.json({ ok: true, data: updatedCode });
  } catch (error) {
    console.error('Revoke access code error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: 'Failed to revoke access code' 
    });
  }
});

// Users Management
router.get('/users', async (req: AuthenticatedRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const orgId = req.query.orgId as string;
    const offset = (page - 1) * limit;

    let whereClause = eq(users.isSuperAdmin, false); // Exclude other super admins
    
    if (search) {
      whereClause = and(
        whereClause,
        or(
          like(users.name, `%${search}%`),
          like(users.email, `%${search}%`)
        )
      );
    }
    
    if (orgId) {
      whereClause = and(whereClause, eq(users.orgId, parseInt(orgId)));
    }

    const [usersData, totalCount] = await Promise.all([
      db.query.users.findMany({
        where: whereClause,
        limit,
        offset,
        orderBy: desc(users.createdAt),
        with: {
          organization: {
            columns: { name: true, slug: true },
          },
          userRoles: {
            with: {
              role: {
                columns: { name: true },
              },
            },
          },
        },
      }),
      db.select({ count: count() }).from(users).where(whereClause),
    ]);

    const usersWithRoles = usersData.map(user => ({
      ...user,
      passwordHash: undefined, // Never send password hashes
      twoFactorSecret: undefined,
      roles: user.userRoles.map(ur => ur.role.name),
    }));

    res.json({
      ok: true,
      data: {
        users: usersWithRoles,
        pagination: {
          page,
          limit,
          total: totalCount[0].count,
          totalPages: Math.ceil(totalCount[0].count / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: 'Failed to fetch users' 
    });
  }
});

router.patch('/users/:id/status', async (req: AuthenticatedRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const { isActive } = req.body;

    const [updatedUser] = await db.update(users)
      .set({ isActive })
      .where(and(
        eq(users.id, id),
        eq(users.isSuperAdmin, false) // Can't modify other super admins
      ))
      .returning();

    if (!updatedUser) {
      return res.status(404).json({ 
        ok: false, 
        error: 'not_found', 
        message: 'User not found or cannot be modified' 
      });
    }

    // Log audit
    await AuthService.logAudit(
      isActive ? 'activate_user' : 'deactivate_user',
      'user',
      id.toString(),
      { isActive },
      req.user!.id,
      updatedUser.orgId,
      req
    );

    res.json({ ok: true, data: updatedUser });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: 'Failed to update user status' 
    });
  }
});

router.post('/users/:id/reset-2fa', async (req: AuthenticatedRequest, res) => {
  try {
    const id = parseInt(req.params.id);

    const [updatedUser] = await db.update(users)
      .set({
        twoFactorEnabled: false,
        twoFactorSecret: null,
      })
      .where(and(
        eq(users.id, id),
        eq(users.isSuperAdmin, false)
      ))
      .returning();

    if (!updatedUser) {
      return res.status(404).json({ 
        ok: false, 
        error: 'not_found', 
        message: 'User not found or cannot be modified' 
      });
    }

    // Log audit
    await AuthService.logAudit(
      'reset_2fa',
      'user',
      id.toString(),
      {},
      req.user!.id,
      updatedUser.orgId,
      req
    );

    res.json({ ok: true, message: '2FA reset successfully' });
  } catch (error) {
    console.error('Reset 2FA error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: 'Failed to reset 2FA' 
    });
  }
});

// Audit Logs
router.get('/audit-logs', async (req: AuthenticatedRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const action = req.query.action as string;
    const actorUserId = req.query.actorUserId as string;
    const orgId = req.query.orgId as string;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    const offset = (page - 1) * limit;

    let whereClause = undefined;
    const conditions = [];

    if (action) {
      conditions.push(eq(auditLogs.action, action));
    }
    if (actorUserId) {
      conditions.push(eq(auditLogs.actorUserId, parseInt(actorUserId)));
    }
    if (orgId) {
      conditions.push(eq(auditLogs.orgId, parseInt(orgId)));
    }
    if (startDate) {
      conditions.push(gte(auditLogs.createdAt, new Date(startDate)));
    }
    if (endDate) {
      conditions.push(lte(auditLogs.createdAt, new Date(endDate)));
    }

    if (conditions.length > 0) {
      whereClause = and(...conditions);
    }

    const [logsData, totalCount] = await Promise.all([
      db.query.auditLogs.findMany({
        where: whereClause,
        limit,
        offset,
        orderBy: desc(auditLogs.createdAt),
        with: {
          actorUser: {
            columns: { name: true, email: true },
          },
          organization: {
            columns: { name: true, slug: true },
          },
        },
      }),
      db.select({ count: count() }).from(auditLogs).where(whereClause),
    ]);

    res.json({
      ok: true,
      data: {
        auditLogs: logsData,
        pagination: {
          page,
          limit,
          total: totalCount[0].count,
          totalPages: Math.ceil(totalCount[0].count / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: 'Failed to fetch audit logs' 
    });
  }
});

// Export data
router.get('/export/:type', async (req: AuthenticatedRequest, res) => {
  try {
    const { type } = req.params;
    let data: any[] = [];
    let filename = '';

    switch (type) {
      case 'users':
        data = await db.query.users.findMany({
          where: eq(users.isSuperAdmin, false),
          with: {
            organization: {
              columns: { name: true, slug: true },
            },
          },
        });
        filename = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
        break;
        
      case 'organizations':
        data = await db.query.organizations.findMany({
          with: {
            users: {
              columns: { id: true },
            },
            subscriptions: {
              limit: 1,
              orderBy: desc(subscriptions.createdAt),
            },
          },
        });
        filename = `organizations-export-${new Date().toISOString().split('T')[0]}.csv`;
        break;
        
      case 'access-codes':
        data = await db.query.accessCodes.findMany({
          with: {
            issuedByUser: {
              columns: { name: true, email: true },
            },
            consumedByUser: {
              columns: { name: true, email: true },
            },
            organization: {
              columns: { name: true },
            },
          },
        });
        filename = `access-codes-export-${new Date().toISOString().split('T')[0]}.csv`;
        break;
        
      default:
        return res.status(400).json({ 
          ok: false, 
          error: 'invalid_type', 
          message: 'Invalid export type' 
        });
    }

    if (data.length === 0) {
      return res.status(404).json({ 
        ok: false, 
        error: 'no_data', 
        message: 'No data found to export' 
      });
    }

    // Flatten nested objects for CSV
    const flatData = data.map(item => {
      const flat: any = {};
      Object.keys(item).forEach(key => {
        if (typeof item[key] === 'object' && item[key] !== null) {
          if (Array.isArray(item[key])) {
            flat[key] = item[key].length;
          } else {
            Object.keys(item[key]).forEach(subKey => {
              flat[`${key}_${subKey}`] = item[key][subKey];
            });
          }
        } else {
          flat[key] = item[key];
        }
      });
      // Remove sensitive fields
      delete flat.passwordHash;
      delete flat.twoFactorSecret;
      return flat;
    });

    // Generate CSV
    const headers = Object.keys(flatData[0] || {});
    const csvContent = [
      headers.join(','),
      ...flatData.map(row => 
        headers.map(header => {
          const value = row[header];
          if (value === null || value === undefined) return '';
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    // Log audit
    await AuthService.logAudit(
      'export_data',
      type,
      undefined,
      { type, recordCount: data.length },
      req.user!.id,
      undefined,
      req
    );

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvContent);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: 'Export failed' 
    });
  }
});

export default router;
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Admin routes coming soon' });
});

export default router;
