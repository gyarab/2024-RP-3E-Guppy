import HomePage from "../../pages/HomePage";
import LoginPage from "../../pages/LoginPage";
import SignupPage from "../../pages/SignupPage";

interface Route {
  path: string;
  component: React.ComponentType;
}

export const publicRoutes: Route[] = [
  { path: "/", component: HomePage },
  { path: "/login", component: LoginPage },
  { path: "/signup", component: SignupPage },
];

export const privateRoutes: Route[] = [
  // { path: '/dashboard', component: DashboardPage },
];

export const adminRoutes: Route[] = [
  // { path: '/admin', component: AdminPage },
];
