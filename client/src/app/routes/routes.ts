import CreateOrganizationPage from "../../pages/CreateOrganizationPage";
import CreatePostPage from "../../pages/CreatePostPage";
import FeedPage from "../../pages/FeedPage";
import HomePage from "../../pages/HomePage";
import AboutPage from "../../pages/AboutPage";
import LoginPage from "../../pages/LoginPage";
import SignupPage from "../../pages/SignupPage";
import ForgotPasswordPage from "../../pages/ForgotPassword";
import ResetPasswordPage from "../../pages/ResetPassword";
import ProfilePage from "../../pages/ProfilePage";
import OrganizationPage from "../../pages/OrganizationPage";

interface Route {
  path: string;
  component: React.ComponentType;
}

export const publicRoutes: Route[] = [
  { path: "/", component: HomePage },
  { path: "/about", component: AboutPage },
  { path: "/login", component: LoginPage },
  { path: "/signup", component: SignupPage },
  { path: "/forgot-password", component: ForgotPasswordPage },
  { path: "/reset-password", component: ResetPasswordPage },
];

export const privateRoutes: Route[] = [
  { path: "/orgs", component: OrganizationPage },
  { path: "/orgs/create", component: CreateOrganizationPage },
  { path: "/feed", component: FeedPage },
  { path: "/post/create", component: CreatePostPage },
  { path: "/profile", component: ProfilePage },
];

export const adminRoutes: Route[] = [
  // { path: '/admin', component: AdminPage },
];
