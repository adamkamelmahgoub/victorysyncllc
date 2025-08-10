// Admin routes
app.use('/api/admin', adminRoutes);

// Admin API endpoints for dashboard data
app.get('/api/admin/users', requireAdmin, async (req, res) => {
  try {
    const users = await storage.getAllPublicUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/admin/orders', requireAdmin, async (req, res) => {
  try {
    // Mock orders data since we don't have orders table yet
    const orders = [];
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.get('/api/admin/integrations', requireAdmin, async (req, res) => {
  try {
    const integrations = await storage.getAllCrmIntegrations();
    res.json(integrations);
  } catch (error) {
    console.error('Error fetching integrations:', error);
    res.status(500).json({ error: 'Failed to fetch integrations' });
  }
});