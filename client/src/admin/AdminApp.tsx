
import { Switch, Route, Redirect } from "wouter"
import AdminLayout from "./components/AdminLayout"
import Overview from "./pages/Overview"
import Users from "./pages/Users"
import Orgs from "./pages/Orgs"
import Flags from "./pages/Flags"
import Access from "./pages/Access"
import Billing from "./pages/Billing"
import ApiKeys from "./pages/ApiKeys"
import Webhooks from "./pages/Webhooks"
import Coupons from "./pages/Coupons"
import Integrations from "./pages/Integrations"
import MFA from "./pages/MFA"
import Analytics from "./pages/Analytics"
import Health from "./pages/Health"

export default function AdminApp() {
  return (
    <AdminLayout>
      <Switch>
        <Route path="/admin" component={Overview} />
        <Route path="/admin/users" component={Users} />
        <Route path="/admin/orgs" component={Orgs} />
        <Route path="/admin/flags" component={Flags} />
        <Route path="/admin/access" component={Access} />
        <Route path="/admin/billing" component={Billing} />
        <Route path="/admin/apikeys" component={ApiKeys} />
        <Route path="/admin/webhooks" component={Webhooks} />
        <Route path="/admin/coupons" component={Coupons} />
        <Route path="/admin/integrations" component={Integrations} />
        <Route path="/admin/mfa" component={MFA} />
        <Route path="/admin/analytics" component={Analytics} />
        <Route path="/admin/health" component={Health} />
        <Route>
          {() => <Redirect to="/admin" />}
        </Route>
      </Switch>
    </AdminLayout>
  )
}
