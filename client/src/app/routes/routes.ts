import AboutPage from "../../pages/AboutPage";
import HomePage from "../../pages/HomePage";
import LoginPage from "../../pages/LoginPage";
import ServicesPage from "../../pages/ServicesPage";

interface Route {
  path: string;
  component: React.ComponentType;
}

export const publicRoutes: Route[] = [
  { path: "/", component: HomePage },
  { path: "/login", component: LoginPage },
  { path: "/about", component: AboutPage },
  { path: "/services", component: ServicesPage },
];

export const privateRoutes: Route[] = [
  // { path: '/dashboard', component: DashboardPage },
];

export const adminRoutes: Route[] = [
  // { path: '/admin', component: AdminPage },
];
