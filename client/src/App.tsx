
import { Route } from 'wouter';
import Home from '@/pages/home';
import Pricing from '@/pages/pricing';
import Register from '@/pages/register';
import Login from '@/pages/login';
import AdminPortal from '@/pages/admin-portal';

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
