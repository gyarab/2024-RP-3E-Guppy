import { useLocation } from "react-router-dom";

const hideSidebarRoutes = ["/login", "/signup", "/forgot-password"];
const hideAsideRoutes = ["/login", "/signup", "/forgot-password"];

export const shouldShowSidebar = () => {
  const location = useLocation();
  return !hideSidebarRoutes.includes(location.pathname);
};

export const shouldShowAside = () => {
  const location = useLocation();
  return !hideAsideRoutes.includes(location.pathname);
};
