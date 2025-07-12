<SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">User</th>
                          <th className="text-left p-2">Status</th>
                          <th className="text-left p-2">Tier</th>
                          <th className="text-left p-2">Orders</th>
                          <th className="text-left p-2">Spent</th>
                          <th className="text-left p-2">Last Login</th>
                          <th className="text-left p-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user: any) => (
                          <tr key={user.id} className="border-b hover:bg-gray-50 cursor-pointer">
                            <td className="p-2" onClick={() => handleUserClick(user)}>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                              </div>
                            </td>
                            <td className="p-2" onClick={() => handleUserClick(user)}>
                              <Badge className={user.isActive !== false ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                {user.isActive !== false ? "Active" : "Inactive"}
                              </Badge>
                            </td>
                            <td className="p-2" onClick={() => handleUserClick(user)}>
                              <Badge className={getTierColor(user.privileges?.subscriptionTier || 'basic')}>
                                {user.privileges?.subscriptionTier || 'basic'}
                              </Badge>
                            </td>
                            <td className="p-2" onClick={() => handleUserClick(user)}>
                              {ordersData.filter((order: any) => order.userId === user.id.toString()).length}
                            </td>
                            <td className="p-2" onClick={() => handleUserClick(user)}>
                              ${ordersData.filter((order: any) => order.userId === user.id.toString())
                                .reduce((sum: number, order: any) => sum + parseFloat(order.total || 0), 0)
                                .toLocaleString()}
                            </td>
                            <td className="p-2" onClick={() => handleUserClick(user)}>
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => handleUserClick(user)}>
                                    <Shield className="w-4 h-4 mr-2" />
                                    Manage Privileges
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => impersonateUser(user.id)}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Impersonate
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => toggleUserStatus(user.id, user.isActive !== false)}
                                    className={user.isActive !== false ? "text-yellow-600" : "text-green-600"}
                                  >
                                    {user.isActive !== false ? <Lock className="w-4 h-4 mr-2" /> : <Unlock className="w-4 h-4 mr-2" />}
                                    {user.isActive !== false ? "Suspend" : "Activate"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => deleteUserOld(user.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ordersData.map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold">Order #{order.id}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={
                          order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {order.status}
                        </Badge>
                        <span className="font-semibold">${parseFloat(order.total || 0).toLocaleString()}</span>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="packages" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Package Management</CardTitle>
                  <Button className="bg-victory-purple hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Package
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {packages.map((pkg: any) => (
                    <div key={pkg.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold">{pkg.name}</p>
                        <p className="text-sm text-gray-600">{pkg.description}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-semibold">${parseFloat(pkg.price).toLocaleString()}</span>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Revenue chart would go here
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    User growth chart would go here
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="site-title">Site Title</Label>
                    <Input id="site-title" defaultValue="VictorySync" />
                  </div>
                  <div>
                    <Label htmlFor="contact-email">Contact Email</Label>
                    <Input id="contact-email" defaultValue="info@victorysync.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="+ (718)-813-2106" />
                  </div>
                  <Button className="bg-victory-purple hover:bg-purple-700">
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Enhanced User Details Modal */}
        <Dialog open={isUserDetailOpen} onOpenChange={setIsUserDetailOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Complete User Management: {selectedUser?.name}</span>
              </DialogTitle>
            </DialogHeader>
            
            {selectedUser && (
              <div className="space-y-6">
                {/* User Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <Users className="w-8 h-8 text-gray-500" />
                        </div>
                        <p className="font-semibold">{selectedUser.name}</p>
                        <p className="text-sm text-gray-600">{selectedUser.email}</p>
                        <Badge className={getStatusColor(userPrivileges.accountStatus)} className="mt-2">
                          {userPrivileges.accountStatus}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Orders</span>
                          <span className="font-semibold">{userStats.totalOrders}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Spent</span>
                          <span className="font-semibold">${userStats.totalSpent.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Avg Order</span>
                          <span className="font-semibold">${userStats.avgOrderValue}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Login Count</span>
                          <span className="font-semibold">{userStats.loginCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Last Login</span>
                          <span className="font-semibold text-xs">{new Date(userStats.lastLogin).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Integrations</span>
                          <span className="font-semibold">{userStats.integrations}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Support Tickets</span>
                          <span className="font-semibold">{userStats.supportTickets}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">API Calls</span>
                          <span className="font-semibold">{userStats.apiCalls.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Priority</span>
                          <Badge className={
                            userPrivileges.priority === 'critical' ? 'bg-red-100 text-red-800' :
                            userPrivileges.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            userPrivileges.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {userPrivileges.priority}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Tabs defaultValue="privileges" className="w-full">
                  <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="privileges">Privileges</TabsTrigger>
                    <TabsTrigger value="subscription">Subscription</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                    <TabsTrigger value="billing">Billing</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="privileges" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Core Permissions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>Can Create Orders</Label>
                            <Switch 
                              checked={userPrivileges.canCreateOrders} 
                              onCheckedChange={(checked) => setUserPrivileges({...userPrivileges, canCreateOrders: checked})}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label>Can View Reports</Label>
                            <Switch 
                              checked={userPrivileges.canViewReports} 
                              onCheckedChange={(checked) => setUserPrivileges({...userPrivileges, canViewReports: checked})}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label>Can Access Premium Features</Label>
                            <Switch 
                              checked={userPrivileges.canAccessPremiumFeatures} 
                              onCheckedChange={(checked) => setUserPrivileges({...userPrivileges, canAccessPremiumFeatures: checked})}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label>Can Modify Profile</Label>
                            <Switch 
                              checked={userPrivileges.canModifyProfile} 
                              onCheckedChange={(checked) => setUserPrivileges({...userPrivileges, canModifyProfile: checked})}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label>Can Delete Account</Label>
                            <Switch 
                              checked={userPrivileges.canDeleteAccount} 
                              onCheckedChange={(checked) => setUserPrivileges({...userPrivileges, canDeleteAccount: checked})}
                            />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Advanced Permissions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>Can View Billing</Label>
                            <Switch 
                              checked={userPrivileges.canViewBilling} 
                              onCheckedChange={(checked) => setUserPrivileges({...userPrivileges, canViewBilling: checked})}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label>Can Manage Integrations</Label>
                            <Switch 
                              checked={userPrivileges.canManageIntegrations} 
                              onCheckedChange={(checked) => setUserPrivileges({...userPrivileges, canManageIntegrations: checked})}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label>Can Export Data</Label>
                            <Switch 
                              checked={userPrivileges.canExportData} 
                              onCheckedChange={(checked) => setUserPrivileges({...userPrivileges, canExportData: checked})}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label>Can Access API</Label>
                            <Switch 
                              checked={userPrivileges.canAccessAPI} 
                              onCheckedChange={(checked) => setUserPrivileges({...userPrivileges, canAccessAPI: checked})}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label>Can View Analytics</Label>
                            <Switch 
                              checked={userPrivileges.canViewAnalytics} 
                              onCheckedChange={(checked) => setUserPrivileges({...userPrivileges, canViewAnalytics: checked})}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label>Max Order Value ($)</Label>
                        <Input 
                          type="number" 
                          value={userPrivileges.maxOrderValue}
                          onChange={(e) => setUserPrivileges({...userPrivileges, maxOrderValue: parseInt(e.target.value)})}
                        />
                      </div>
                      
                      <div>
                        <Label>Max Orders Per Month</Label>
                        <Input 
                          type="number" 
                          value={userPrivileges.maxOrdersPerMonth}
                          onChange={(e) => setUserPrivileges({...userPrivileges, maxOrdersPerMonth: parseInt(e.target.value)})}
                        />
                      </div>
                      
                      <div>
                        <Label>API Rate Limit (per hour)</Label>
                        <Input 
                          type="number" 
                          value={userPrivileges.apiRateLimit}
                          onChange={(e) => setUserPrivileges({...userPrivileges, apiRateLimit: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Account Status</Label>
                        <Select value={userPrivileges.accountStatus} onValueChange={(value: any) => setUserPrivileges({...userPrivileges, accountStatus: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="banned">Banned</SelectItem>
                            <SelectItem value="trial">Trial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Priority Level</Label>
                        <Select value={userPrivileges.priority} onValueChange={(value: any) => setUserPrivileges({...userPrivileges, priority: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="subscription" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Subscription Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label>Subscription Tier</Label>
                            <Select value={userPrivileges.subscriptionTier} onValueChange={(value: any) => setUserPrivileges({...userPrivileges, subscriptionTier: value})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="basic">Basic</SelectItem>
                                <SelectItem value="premium">Premium</SelectItem>
                                <SelectItem value="enterprise">Enterprise</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label>Billing Cycle</Label>
                            <Select value={userPrivileges.billingCycle} onValueChange={(value: any) => setUserPrivileges({...userPrivileges, billingCycle: value})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="quarterly">Quarterly</SelectItem>
                                <SelectItem value="yearly">Yearly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label>Credit Limit ($)</Label>
                            <Input 
                              type="number" 
                              value={userPrivileges.creditLimit}
                              onChange={(e) => setUserPrivileges({...userPrivileges, creditLimit: parseInt(e.target.value)})}
                            />
                          </div>
                          
                          <div>
                            <Label>Data Retention (days)</Label>
                            <Input 
                              type="number" 
                              value={userPrivileges.dataRetentionDays}
                              onChange={(e) => setUserPrivileges({...userPrivileges, dataRetentionDays: parseInt(e.target.value)})}
                            />
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Usage Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Storage Used</span>
                              <span className="font-semibold">2.3 GB / 10 GB</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '23%' }} />
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm">API Calls This Month</span>
                              <span className="font-semibold">1,247 / 10,000</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: '12%' }} />
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Bandwidth Used</span>
                              <span className="font-semibold">45 GB / 100 GB</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-orange-500 h-2 rounded-full" style={{ width: '45%' }} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="orders" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">User Orders</h4>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {ordersData.filter((order: any) => order.userId === selectedUser.id.toString()).map((order: any) => (
                        <div key={order.id} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <p className="font-medium">Order #{order.id}</p>
                            <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={
                              order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                              order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                              'bg-yellow-100 text-yellow-800'
                            }>
                              {order.status}
                            </Badge>
                            <span className="font-semibold">${parseFloat(order.total || 0).toLocaleString()}</span>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h5 className="font-semibold mb-3">Create New Order</h5>
                      <div className="flex space-x-2">
                        <Select value={selectedPackage} onValueChange={setSelectedPackage}>
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select Package" />
                          </SelectTrigger>
                          <SelectContent>
                            {packages.map((pkg: any) => (
                              <SelectItem key={pkg.id} value={pkg.id.toString()}>
                                {pkg.name} - ${pkg.price}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input 
                          type="number" 
                          placeholder="Qty" 
                          value={orderQuantity}
                          onChange={(e) => setOrderQuantity(parseInt(e.target.value))}
                          className="w-20"
                        />
                        <Button onClick={createOrder} className="bg-victory-purple hover:bg-purple-700">
                          Create Order
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="activity" className="space-y-4">
                    <h4 className="font-semibold">Recent Activity</h4>
                    <div className="space-y-3">
                      {userActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${
                              activity.status === 'success' ? 'bg-green-500' :
                              activity.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                            }`} />
                            <div>
                              <p className="text-sm font-medium">{activity.action}</p>
                              <p className="text-xs text-gray-500">IP: {activity.ip} • {activity.userAgent}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                            <Badge className={
                              activity.status === 'success' ? 'bg-green-100 text-green-800' :
                              activity.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }>
                              {activity.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="billing" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Billing Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Current Balance</span>
                            <span className="font-semibold">$247.50</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Credit Limit</span>
                            <span className="font-semibold">${userPrivileges.creditLimit.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Next Billing Date</span>
                            <span className="font-semibold">Dec 15, 2024</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Payment Method</span>
                            <span className="font-semibold">•••• 4242</span>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Payment History</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium">Nov 2024 Payment</p>
                                <p className="text-xs text-gray-500">Nov 15, 2024</p>
                              </div>
                              <span className="font-semibold">$299.00</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium">Oct 2024 Payment</p>
                                <p className="text-xs text-gray-500">Oct 15, 2024</p>
                              </div>
                              <span className="font-semibold">$299.00</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium">Sep 2024 Payment</p>
                                <p className="text-xs text-gray-500">Sep 15, 2024</p>
                              </div>
                              <span className="font-semibold">$299.00</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="notes" className="space-y-4">
                    <div>
                      <Label>Admin Notes</Label>
                      <Textarea 
                        value={userPrivileges.customNotes}
                        onChange={(e) => setUserPrivileges({...userPrivileges, customNotes: e.target.value})}
                        placeholder="Add custom notes about this user..."
                        rows={8}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label>Internal Tags</Label>
                      <Input 
                        placeholder="VIP, High-Volume, Support-Priority, etc."
                        className="mt-2"
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <DialogFooter>
                  <div className="flex justify-between items-center w-full">
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => impersonateUser(selectedUser.id)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Impersonate User
                      </Button>
                      <Button variant="outline">
                        <Mail className="w-4 h-4 mr-2" />
                        Send Email
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => setIsUserDetailOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveUserPrivileges} className="bg-victory-purple hover:bg-purple-700">
                        Save All Changes
                      </Button>
                    </div>
                  </div>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}