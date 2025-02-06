import CreateOrganizationPage from "../../pages/CreateOrganizationPage";
import CreatePostPage from "../../pages/CreatePostPage";
import Dashboard from "../../pages/Dashboard";
import FeedPage from "../../pages/FeedPage";
import HomePage from "../../pages/HomePage";
import LoginPage from "../../pages/LoginPage";
import SignupPage from "../../pages/SignupPage";
import ForgotPasswordPage from "../../pages/ForgotPassword";

interface Route {
  path: string;
  component: React.ComponentType;
}

export const publicRoutes: Route[] = [
  { path: "/", component: HomePage },
  { path: "/login", component: LoginPage },
  { path: "/signup", component: SignupPage },
  { path:"/forgotPassword", component: ForgotPasswordPage },
];

export const privateRoutes: Route[] = [
  { path: "/dashboard", component: Dashboard },
  { path: "/feed", component: FeedPage },
  { path: "/post/create", component: CreatePostPage },
  { path: "/org/create", component: CreateOrganizationPage },
];

export const adminRoutes: Route[] = [
  // { path: '/admin', component: AdminPage },
];
