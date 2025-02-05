import { useSelector } from "react-redux";

import { selectIsSidebarOpen } from "../features/ui/uiSlice";

import Header from "../widgets/Header";
import Footer from "../widgets/Footer";
import Router from "./routes/Router";
import Sidebar from "../widgets/Sidebar";
import Aside from "../shared/ui/Aside";
import { useAuth } from "../shared/hooks/useAuth";
import { useShowElements } from "../shared/hooks/useShowElements";

function App() {
  const isSidebarOpen = useSelector(selectIsSidebarOpen);
  const toggleClass = isSidebarOpen ? "" : "switch-sidebar";

  const { isAuth, isAdmin } = useAuth();

  const { showAside, showSidebar } = useShowElements();

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
