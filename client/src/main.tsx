
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PrivateRoute from './routes/PrivateRoute';
import Login from './pages/login';

const qc = new QueryClient();

function CustomerDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Customer Dashboard</h1>
      <p className="text-gray-600 mt-2">You are signed in. This route is protected.</p>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {/* Protected area */}
      <Route element={<PrivateRoute />}>
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
      </Route>
      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/customer-dashboard" replace />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
