import CreateOrganizationPage from "../../pages/CreateOrganizationPage";
import CreatePostPage from "../../pages/CreatePostPage";
import FeedPage from "../../pages/FeedPage";
import HomePage from "../../pages/HomePage";
import About from "../../pages/About";
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
  { path: "/about", component: About },
  { path: "/login", component: LoginPage },
  { path: "/signup", component: SignupPage },
  { path: "/forgot-password", component: ForgotPasswordPage },
  { path: "/reset-password", component: ResetPasswordPage },
  { path: "/post/create", component: CreatePostPage },
];

export const privateRoutes: Route[] = [
  { path: "/feed", component: FeedPage },
  { path: "/org/create", component: CreateOrganizationPage },
  { path: "/profile", component: ProfilePage },
];

export const adminRoutes: Route[] = [
  // { path: '/admin', component: AdminPage },
];
