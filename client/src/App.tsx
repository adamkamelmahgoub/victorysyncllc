
import { Route } from 'wouter';
import Home from '@/pages/home.tsx';
import Pricing from '@/pages/pricing.tsx';
import Register from '@/pages/register.tsx';
import Login from '@/pages/login.tsx';
import AdminPortal from '@/pages/admin-portal.tsx';

export default function App() {
  return (
    <>
      <Route path="/" component={Home} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/admin" component={AdminPortal} />
      <Route path="*">
        <div className="p-6">Page not found</div>
      </Route>
    </>
  );
}
