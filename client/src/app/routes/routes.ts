import HomePage from "../../pages/HomePage";
import LoginPage from "../../pages/LoginPage";

interface Route {
  path: string;
  component: React.ComponentType;
}

export const publicRoutes: Route[] = [
  { path: "/", component: HomePage },
  { path: "/login", component: LoginPage },
];

export const privateRoutes: Route[] = [
  // { path: '/dashboard', component: DashboardPage },
];

export const adminRoutes: Route[] = [
  // { path: '/admin', component: AdminPage },
];
