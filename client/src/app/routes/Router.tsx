import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import { publicRoutes, privateRoutes, adminRoutes } from "./routes";

interface RouterProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
}

function Router({ isAuthenticated, isAdmin }: RouterProps) {
  const location = useLocation();

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
              isAuthenticated ? (
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
              isAuthenticated && isAdmin ? (
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
