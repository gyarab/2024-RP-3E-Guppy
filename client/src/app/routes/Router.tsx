import { Routes, Route, Navigate } from "react-router-dom";

import { publicRoutes, privateRoutes, adminRoutes } from "./routes";
import { useSelector } from "react-redux";
import { selectIsAuth } from "../../features/auth/authSlice";

// Mock authentication and authorization functions
const isAdmin = true; // Replace with real admin check

interface RouterProps {
  isAuthenticated: boolean;
}

function Router({ isAuthenticated }: RouterProps) {
  return (
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
          element={isAuthenticated ? <Component /> : <Navigate to="/login" />}
        />
      ))}

      {/* Admin routes */}
      {adminRoutes.map(({ path, component: Component }, index) => (
        <Route
          key={index}
          path={path}
          element={
            isAuthenticated && isAdmin ? <Component /> : <Navigate to="/" />
          }
        />
      ))}
    </Routes>
  );
}

export default Router;
