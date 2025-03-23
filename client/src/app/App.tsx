import { useDispatch, useSelector } from "react-redux";

import { selectIsSidebarOpen } from "../features/ui/uiSlice";
import { useAuth } from "../shared/hooks/useAuth";
import { useShowElements } from "../shared/hooks/useShowElements";

import Header from "../widgets/Header";
import Footer from "../widgets/Footer";
import Router from "./routes/Router";
import Sidebar from "../widgets/Sidebar";
import Aside from "../shared/ui/Aside";
import { useVerifyQuery } from "../features/auth/authApi";
import { setAuthCredentials, setIsAuth } from "../features/auth/authSlice";
import { useEffect, useState } from "react";

function App() {
  const isSidebarOpen = useSelector(selectIsSidebarOpen);
  const toggleClass = isSidebarOpen ? "" : "switch-sidebar";

  const { isAuth, isAdmin } = useAuth();
  const { showAside, showSidebar } = useShowElements();
  const [isInitialized, setIsInitialized] = useState(false);

  const dispatch = useDispatch();
  const { data: user, isLoading, isError } = useVerifyQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: true,

    skip: !isInitialized && localStorage.getItem("isAuthenticated") !== "true",
  });

  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated") === "true";
    if (storedAuth) {
      dispatch(setIsAuth({ isAuth: true, user: null }));
    }
    setIsInitialized(true);
  }, [dispatch]);

  useEffect(() => {
    if (user && !isLoading) {
      dispatch(setAuthCredentials(user));
    } else if (isError && isInitialized) {
      localStorage.removeItem("isAuthenticated");
      dispatch(setIsAuth({ isAuth: false, user: null }));
    }
  }, [user, isLoading, isError, isInitialized, dispatch]);

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
