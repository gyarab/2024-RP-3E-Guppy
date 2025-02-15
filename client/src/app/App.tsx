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
import { setAuthCredentials } from "../features/auth/authSlice";
import { useEffect } from "react";

function App() {
  const isSidebarOpen = useSelector(selectIsSidebarOpen);
  const toggleClass = isSidebarOpen ? "" : "switch-sidebar";

  const { isAuth, isAdmin } = useAuth();
  const { showAside, showSidebar } = useShowElements();

  const dispatch = useDispatch();
  const { data: user, isLoading } = useVerifyQuery();

  useEffect(() => {
    if (user && !isLoading) {
      dispatch(setAuthCredentials(user));
    }
  }, [user, isLoading, dispatch]);

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
