import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { AppDispatch } from "./store";
import { selectIsSidebarOpen } from "../features/ui/uiSlice";
import { selectIsAuth, setIsAuth } from "../features/auth/authSlice";
import { useVerifyQuery } from "../features/auth/authApi";

import Header from "../widgets/Header";
import Footer from "../widgets/Footer";
import Router from "./routes/Router";
import Loader from "../shared/ui/Loader";
import Sidebar from "../widgets/Sidebar";
import Aside from "../shared/ui/Aside";
import {
  shouldShowAside,
  shouldShowSidebar,
} from "../shared/constants/hideUrls";

function App() {
  console.log("Rendering App...");

  const isSidebarOpen = useSelector(selectIsSidebarOpen);
  const toggleClass = isSidebarOpen ? "" : "switch-sidebar";

  // const isAuth = useSelector(selectIsAuth);
  // console.log("isAuth", isAuth);

  // const { data, isLoading } = useVerifyQuery();
  // console.log("data", data);

  const dispatch: AppDispatch = useDispatch();
  // const location = useLocation();

  // useEffect(() => {
  //   if (data) {
  //     console.log("Setting isAuth", data);

  //     dispatch(setIsAuth(data));
  //   }
  // }, [data, dispatch]);

  // if (isLoading) {
  //   console.log("Loading...");

  //   return <Loader />;
  // }
  const accessToken = sessionStorage.getItem("accessToken");

  const isAuth = !!accessToken;
  const isAdmin = false; // TODO: data?.user.isAdmin ?? false

  // const hideSidebarRoutes = ["/login", "/signup", "/forgot-password"];
  // const hideAsideRoutes = ["/login", "/signup", "/forgot-password"];

  // const shouldShowSidebar = !hideSidebarRoutes.includes(location.pathname);
  // const shouldShowAside = !hideAsideRoutes.includes(location.pathname);

  const showSidebar = shouldShowSidebar();
  const showAside = shouldShowAside();

  const layoutClass = [
    showSidebar ? "show-sidebar" : "hide-sidebar",
    showAside ? "show-aside" : "hide-aside",
  ].join(" ");

  return (
    <div className={`page-container ${layoutClass} ${toggleClass}`}>
      <Header />
      {showSidebar && <Sidebar />}
      <Router isAuthenticated={isAuth} isAdmin={isAdmin} />
      {showAside && <Aside />}
      <Footer />
    </div>
  );
}

export default App;
