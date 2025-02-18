import CreateOrganizationPage from "../../pages/CreateOrganizationPage";
import CreatePostPage from "../../pages/CreatePostPage";
import Dashboard from "../../pages/Dashboard";
import FeedPage from "../../pages/FeedPage";
import HomePage from "../../pages/HomePage";
import About from "../../pages/About";
import OurServices from "../../pages/OurServices";
import LoginPage from "../../pages/LoginPage";
import SignupPage from "../../pages/SignupPage";
import ForgotPasswordPage from "../../pages/ForgotPassword";
import ResetPasswordPage from "../../pages/ResetPassword";
import ProfilePage from "../../pages/ProfilePage";

interface Route {
  path: string;
  component: React.ComponentType;
}

export const publicRoutes: Route[] = [
  { path: "/", component: HomePage },
  { path: "/about", component: About},
  { path: "/services", component: OurServices},
  { path: "/login", component: LoginPage },
  { path: "/signup", component: SignupPage },
  { path:"/forgot-password", component: ForgotPasswordPage },
  { path:"/reset-password", component: ResetPasswordPage },
];

export const privateRoutes: Route[] = [
  { path: "/dashboard", component: Dashboard },
  { path: "/feed", component: FeedPage },
  { path: "/post/create", component: CreatePostPage },
  { path: "/org/create", component: CreateOrganizationPage },
  { path: "/profile", component: ProfilePage },
];

export const adminRoutes: Route[] = [
  // { path: '/admin', component: AdminPage },
];
