
import express from 'express';
import { z } from 'zod';
import { not, sql } from 'drizzle-orm';
import crypto from 'crypto';
import { db } from '../db';
import { 
  users, userRoles, roles, rolePermissions, permissions,
  tickets, orders, kpisDaily, apiKeys, subscriptions, invoices
} from '@shared/schema';
import { eq, and, desc, count, gte, lte, like, or } from 'drizzle-orm';
import { 
  authenticateToken, requirePermissions, AuthService, 
  type AuthenticatedRequest 
} from '../lib/auth';
import { 
  inviteUserSchema, createTicketSchema, kpiFilterSchema,
  createRoleSchema 
} from '@shared/schema';

const router = express.Router();

// All org routes require authentication
router.use(authenticateToken);

// Middleware to ensure user belongs to an organization (not super admin)
const requireOrg = (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
  if (!req.user?.orgId) {
    return res.status(403).json({ 
      ok: false, 
      error: 'org_required', 
      message: 'Organization membership required' 
    });
  }
  next();
};

router.use(requireOrg);

// Dashboard overview
router.get('/overview', requirePermissions('org:view'), async (req: AuthenticatedRequest, res) => {
  try {
    const orgId = req.user!.orgId!;
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // Get today's KPIs
    const todayKpis = await db.query.kpisDaily.findFirst({
      where: and(
        eq(kpisDaily.orgId, orgId),
        gte(kpisDaily.date, startOfDay)
      ),
    });

    // Get recent metrics for trends
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentKpis = await db.query.kpisDaily.findMany({
      where: and(
        eq(kpisDaily.orgId, orgId),
        gte(kpisDaily.date, last7Days)
      ),
      orderBy: desc(kpisDaily.date),
      limit: 7,
    });

    // Get counts
    const [
      openTicketsCount,
      totalOrdersCount,
      activeUsersCount,
    ] = await Promise.all([
      db.select({ count: count() })
        .from(tickets)
        .where(and(
          eq(tickets.orgId, orgId),
          eq(tickets.status, 'open')
        )),
      db.select({ count: count() })
        .from(orders)
        .where(eq(orders.orgId, orgId)),
      db.select({ count: count() })
        .from(users)
        .where(and(
          eq(users.orgId, orgId),
          eq(users.isActive, true)
        )),
    ]);

    // Calculate trends
    const avgCalls = recentKpis.length > 0 
      ? Math.round(recentKpis.reduce((sum, kpi) => sum + kpi.calls, 0) / recentKpis.length)
      : 0;
    
    const avgResponse = recentKpis.length > 0
      ? Math.round(recentKpis.reduce((sum, kpi) => sum + kpi.avgResponseSec, 0) / recentKpis.length)
      : 0;

    const avgCsat = recentKpis.length > 0
      ? Number((recentKpis.reduce((sum, kpi) => sum + Number(kpi.csat), 0) / recentKpis.length).toFixed(2))
      : 0;

    res.json({
      ok: true,
      data: {
        metrics: {
          callsToday: todayKpis?.calls || 0,
          avgResponseTime: todayKpis?.avgResponseSec || 0,
          csat: todayKpis?.csat || 0,
          openTickets: openTicketsCount[0].count,
          totalOrders: totalOrdersCount[0].count,
          activeUsers: activeUsersCount[0].count,
        },
        trends: {
          avgCallsLast7Days: avgCalls,
          avgResponseLast7Days: avgResponse,
          avgCsatLast7Days: avgCsat,
        },
        recentKpis: recentKpis.slice(0, 5), // Last 5 days for chart
      },
    });
  } catch (error) {
    console.error('Org overview error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: 'Failed to load overview' 
    });
  }
});

// KPI Data
router.get('/kpis', requirePermissions('kpi:view'), async (req: AuthenticatedRequest, res) => {
  try {
    const orgId = req.user!.orgId!;
    const { startDate, endDate } = kpiFilterSchema.parse(req.query);

    const kpis = await db.query.kpisDaily.findMany({
      where: and(
        eq(kpisDaily.orgId, orgId),
        gte(kpisDaily.date, new Date(startDate)),
        lte(kpisDaily.date, new Date(endDate))
      ),
      orderBy: desc(kpisDaily.date),
    });

    res.json({ ok: true, data: { kpis } });
  } catch (error) {
    console.error('Get KPIs error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        ok: false, 
        error: 'validation_error', 
        message: 'Invalid date range',
        errors: error.errors 
      });
    }
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: 'Failed to fetch KPIs' 
    });
  }
});

// Team Management
router.get('/users', requirePermissions('user:invite'), async (req: AuthenticatedRequest, res) => {
  try {
    const orgId = req.user!.orgId!;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const offset = (page - 1) * limit;

    let whereClause = eq(users.orgId, orgId);
    
    if (search) {
      whereClause = and(
        whereClause,
        or(
          like(users.name, `%${search}%`),
          like(users.email, `%${search}%`)
        )
      );
    }

    const [usersData, totalCount] = await Promise.all([
      db.query.users.findMany({
        where: whereClause,
        limit,
        offset,
        orderBy: desc(users.createdAt),
        with: {
          userRoles: {
            with: {
              role: {
                columns: { name: true, description: true },
              },
            },
          },
        },
      }),
      db.select({ count: count() }).from(users).where(whereClause),
    ]);

    const usersWithRoles = usersData.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      twoFactorEnabled: user.twoFactorEnabled,
      emailVerified: user.emailVerified,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      roles: user.userRoles.map(ur => ({
        name: ur.role.name,
        description: ur.role.description,
      })),
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
    console.error('Get org users error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: 'Failed to fetch users' 
    });
  }
});

router.post('/users/invite', requirePermissions('user:invite'), async (req: AuthenticatedRequest, res) => {
  try {
    const orgId = req.user!.orgId!;
    const { email, name, roleIds } = inviteUserSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });

    if (existingUser) {
      return res.status(400).json({ 
        ok: false, 
        error: 'user_exists', 
        message: 'User already exists with this email' 
      });
    }

    // Validate roles belong to this org
    const orgRoles = await db.query.roles.findMany({
      where: eq(roles.orgId, orgId),
    });

    const validRoleIds = orgRoles.map(r => r.id);
    const invalidRoles = roleIds.filter(id => !validRoleIds.includes(id));

    if (invalidRoles.length > 0) {
      return res.status(400).json({ 
        ok: false, 
        error: 'invalid_roles', 
        message: 'Invalid role IDs provided' 
      });
    }

    await db.transaction(async (tx) => {
      // Create user without password (they'll set it via invitation link)
      const emailVerificationToken = crypto.randomBytes(32).toString('hex');
      
      const [newUser] = await tx.insert(users).values({
        orgId,
        name,
        email: email.toLowerCase(),
        emailVerificationToken,
        isActive: false, // Will be activated when they set password
      }).returning();

      // Assign roles
      for (const roleId of roleIds) {
        await tx.insert(userRoles).values({
          userId: newUser.id,
          roleId,
        });
      }

      // TODO: Send invitation email with link to set password
      // await sendInvitationEmail(email, name, emailVerificationToken);

      // Log audit
      await AuthService.logAudit(
        'invite_user',
        'user',
        newUser.id.toString(),
        { email, name, roleIds },
        req.user!.id,
        orgId,
        req
      );

      res.json({
        ok: true,
        data: newUser,
        message: 'User invited successfully',
      });
    });
  } catch (error) {
    console.error('Invite user error:', error);
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
      message: 'Failed to invite user' 
    });
  }
});

// Roles Management
router.get('/roles', requirePermissions('role:manage'), async (req: AuthenticatedRequest, res) => {
  try {
    const orgId = req.user!.orgId!;

    const orgRoles = await db.query.roles.findMany({
      where: eq(roles.orgId, orgId),
      with: {
        rolePermissions: {
          with: {
            permission: true,
          },
        },
      },
    });

    const rolesWithPermissions = orgRoles.map(role => ({
      ...role,
      permissions: role.rolePermissions.map(rp => rp.permission),
    }));

    res.json({ ok: true, data: { roles: rolesWithPermissions } });
  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: 'Failed to fetch roles' 
    });
  }
});

router.get('/permissions', requirePermissions('role:manage'), async (req: AuthenticatedRequest, res) => {
  try {
    // Get all non-super-admin permissions
    const allPermissions = await db.query.permissions.findMany({
      where: not(like(permissions.key, 'super:%')),
    });

    res.json({ ok: true, data: { permissions: allPermissions } });
  } catch (error) {
    console.error('Get permissions error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: 'Failed to fetch permissions' 
    });
  }
});

// Tickets Management
router.get('/tickets', requirePermissions('ticket:view'), async (req: AuthenticatedRequest, res) => {
  try {
    const orgId = req.user!.orgId!;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const priority = req.query.priority as string;
    const offset = (page - 1) * limit;

    let whereClause = eq(tickets.orgId, orgId);
    
    if (status) {
      whereClause = and(whereClause, eq(tickets.status, status as any));
    }
    if (priority) {
      whereClause = and(whereClause, eq(tickets.priority, priority as any));
    }

    const [ticketsData, totalCount] = await Promise.all([
      db.query.tickets.findMany({
        where: whereClause,
        limit,
        offset,
        orderBy: desc(tickets.createdAt),
        with: {
          createdByUser: {
            columns: { name: true, email: true },
          },
          assignedToUser: {
            columns: { name: true, email: true },
          },
        },
      }),
      db.select({ count: count() }).from(tickets).where(whereClause),
    ]);

    res.json({
      ok: true,
      data: {
        tickets: ticketsData,
        pagination: {
          page,
          limit,
          total: totalCount[0].count,
          totalPages: Math.ceil(totalCount[0].count / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: 'Failed to fetch tickets' 
    });
  }
});

router.post('/tickets', requirePermissions('ticket:manage'), async (req: AuthenticatedRequest, res) => {
  try {
    const orgId = req.user!.orgId!;
    const { subject, description, priority } = createTicketSchema.parse(req.body);

    const [newTicket] = await db.insert(tickets).values({
      orgId,
      createdByUserId: req.user!.id,
      subject,
      description,
      priority,
      status: 'open',
    }).returning();

    // Log audit
    await AuthService.logAudit(
      'create_ticket',
      'ticket',
      newTicket.id.toString(),
      { subject, priority },
      req.user!.id,
      orgId,
      req
    );

    res.json({ ok: true, data: newTicket });
  } catch (error) {
    console.error('Create ticket error:', error);
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
      message: 'Failed to create ticket' 
    });
  }
});

// Orders
router.get('/orders', requirePermissions('order:view'), async (req: AuthenticatedRequest, res) => {
  try {
    const orgId = req.user!.orgId!;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const offset = (page - 1) * limit;

    let whereClause = eq(orders.orgId, orgId);
    
    if (status) {
      whereClause = and(whereClause, eq(orders.status, status as any));
    }

    const [ordersData, totalCount] = await Promise.all([
      db.query.orders.findMany({
        where: whereClause,
        limit,
        offset,
        orderBy: desc(orders.createdAt),
      }),
      db.select({ count: count() }).from(orders).where(whereClause),
    ]);

    res.json({
      ok: true,
      data: {
        orders: ordersData,
        pagination: {
          page,
          limit,
          total: totalCount[0].count,
          totalPages: Math.ceil(totalCount[0].count / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: 'Failed to fetch orders' 
    });
  }
});

// Billing
router.get('/billing', requirePermissions('billing:view'), async (req: AuthenticatedRequest, res) => {
  try {
    const orgId = req.user!.orgId!;

    const [subscription, recentInvoices] = await Promise.all([
      db.query.subscriptions.findFirst({
        where: eq(subscriptions.orgId, orgId),
        orderBy: desc(subscriptions.createdAt),
      }),
      db.query.invoices.findMany({
        where: eq(invoices.orgId, orgId),
        orderBy: desc(invoices.createdAt),
        limit: 10,
      }),
    ]);

    res.json({
      ok: true,
      data: {
        subscription,
        recentInvoices,
      },
    });
  } catch (error) {
    console.error('Get billing error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: 'Failed to fetch billing information' 
    });
  }
});

// API Keys Management
router.get('/api-keys', requirePermissions('api:keys:manage'), async (req: AuthenticatedRequest, res) => {
  try {
    const orgId = req.user!.orgId!;

    const keys = await db.query.apiKeys.findMany({
      where: eq(apiKeys.orgId, orgId),
      orderBy: desc(apiKeys.createdAt),
      with: {
        user: {
          columns: { name: true, email: true },
        },
      },
    });

    // Never return actual key hashes
    const safeKeys = keys.map(key => ({
      ...key,
      keyHash: undefined,
    }));

    res.json({ ok: true, data: { apiKeys: safeKeys } });
  } catch (error) {
    console.error('Get API keys error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: 'Failed to fetch API keys' 
    });
  }
});

router.post('/api-keys', requirePermissions('api:keys:manage'), async (req: AuthenticatedRequest, res) => {
  try {
    const orgId = req.user!.orgId!;
    const { name, expiresAt } = req.body;

    // Generate API key
    const apiKey = crypto.randomBytes(32).toString('hex');
    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
    const lastFour = apiKey.slice(-4);

    const [newKey] = await db.insert(apiKeys).values({
      userId: req.user!.id,
      orgId,
      name,
      keyHash,
      lastFour,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    }).returning();

    // Log audit
    await AuthService.logAudit(
      'create_api_key',
      'api_key',
      newKey.id.toString(),
      { name },
      req.user!.id,
      orgId,
      req
    );

    res.json({
      ok: true,
      data: {
        ...newKey,
        keyHash: undefined,
        apiKey, // Only show the actual key once
      },
    });
  } catch (error) {
    console.error('Create API key error:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'server_error', 
      message: 'Failed to create API key' 
    });
  }
});

export default router;
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Org routes coming soon' });
});

export default router;
