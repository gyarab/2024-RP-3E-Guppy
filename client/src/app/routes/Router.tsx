import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { publicRoutes, privateRoutes, adminRoutes } from "./routes";

interface RouterProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
}

function Router({ isAuthenticated, isAdmin }: RouterProps) {
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [cachedAuth, setCachedAuth] = useState(false);

  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    if (storedAuth === "true") {
      setCachedAuth(true);
    }
    setIsCheckingAuth(false);
  }, []);

  useEffect(() => {
    if (!isCheckingAuth) {
      localStorage.setItem("isAuthenticated", isAuthenticated.toString());
      setCachedAuth(isAuthenticated);
    }
  }, [isAuthenticated, isCheckingAuth]);

  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  const effectiveAuth = isAuthenticated || cachedAuth;

  return (
    <div className="router">
      <Routes>
        {/* Public routes */}
        {publicRoutes.map(({ path, component: Component }, index) => (
          <Route key={index} path={path} element={<Component />} />
        ))}

        {/* Private routes */}
        {privateRoutes.map(({ path, component: Component }, index) => (
          <Route
            key={index}
            path={path}
            element={
              effectiveAuth ? (
                <Component />
              ) : (
                <Navigate to="/login" state={{ from: location }} replace />
              )
            }
          />
        ))}

        {/* Admin routes */}
        {adminRoutes.map(({ path, component: Component }, index) => (
          <Route
            key={index}
            path={path}
            element={
              effectiveAuth && isAdmin ? (
                <Component />
              ) : (
                <Navigate to="/" state={{ from: location }} replace />
              )
            }
          />
        ))}
      </Routes>
    </div>
  );
}

export default Router;
