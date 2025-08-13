
import { Routes, Route } from 'react-router-dom';
import AdminPortal from '@/pages/admin-portal';
import Register from '@/pages/register';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<div className="p-6">Welcome to VictorySync</div>} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<AdminPortal />} />
      <Route path="*" element={<div className="p-6">Not found</div>} />
    </Routes>
  );
}
