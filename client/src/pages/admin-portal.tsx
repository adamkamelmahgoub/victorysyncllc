import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

function AdminPortal() {
  // Move hook declarations to the top
  const [activeTab, setActiveTab] = useState('dashboard');
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Authentication check (example - replace with your actual auth logic)
  const isAuthenticated = localStorage.getItem('adminToken') !== null;

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }



  useEffect(() => {
    // Example data fetching (replace with your actual API calls)
    const fetchData = async () => {
      setLoading(true);
      // Simulate API calls
      setTimeout(() => {
        setCustomers([{ id: 1, name: 'Customer 1' }, { id: 2, name: 'Customer 2' }]);
        setOrders([{ id: 101, customerId: 1 }, { id: 102, customerId: 2 }]);
        setIntegrations([{ id: 201, name: 'Integration 1' }]);
        setLoading(false);
      }, 500);
    };

    fetchData();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <p>Loading...</p>;
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <h2>Dashboard</h2>
            <p>Welcome to the admin dashboard!</p>
          </div>
        );
      case 'customers':
        return (
          <div>
            <h2>Customers</h2>
            <ul>
              {customers.map(customer => (
                <li key={customer.id}>{customer.name}</li>
              ))}
            </ul>
          </div>
        );
      case 'orders':
        return (
          <div>
            <h2>Orders</h2>
            <ul>
              {orders.map(order => (
                <li key={order.id}>Order ID: {order.id}, Customer ID: {order.customerId}</li>
              ))}
            </ul>
          </div>
      );
      case 'integrations':
          return (
              <div>
                  <h2>Integrations</h2>
                  <ul>
                      {integrations.map(integration => (
                          <li key={integration.id}>{integration.name}</li>
                      ))}
                  </ul>
              </div>
          );
      default:
        return <p>Select a tab.</p>;
    }
  };

  return (
    <div>
      <h1>Admin Portal</h1>
      <button onClick={handleLogout}>Logout</button>
      <nav>
        <button onClick={() => setActiveTab('dashboard')}>Dashboard</button>
        <button onClick={() => setActiveTab('customers')}>Customers</button>
        <button onClick={() => setActiveTab('orders')}>Orders</button>
        <button onClick={() => setActiveTab('integrations')}>Integrations</button>
      </nav>
      <div>{renderContent()}</div>
    </div>
  );
}

export default AdminPortal;