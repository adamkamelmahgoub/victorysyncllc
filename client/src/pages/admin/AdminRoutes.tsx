
import React from 'react';
import { Route, Switch } from 'wouter';
import { AdminCustomers } from './Customers';
import { AdminUsers } from './Users';
import { AdminFeatures } from './Features';

export function AdminRoutes() {
  return (
    <Switch>
      <Route path="/admin/customers" component={AdminCustomers} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/features" component={AdminFeatures} />
      <Route>
        <div className="text-center py-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
          <p>Select a section from the navigation to get started.</p>
        </div>
      </Route>
    </Switch>
  );
}
