import { useLocation } from "react-router-dom";
import { hideAsideRoutes, hideSidebarRoutes } from "../constants/hideUrls";

export const useShowElements = () => {
  const location = useLocation();
  const showSidebar = !hideSidebarRoutes.includes(location.pathname);
  const showAside = !hideAsideRoutes.includes(location.pathname);
  return { showSidebar, showAside };
};
