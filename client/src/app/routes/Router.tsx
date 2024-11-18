import { Routes, Route, Navigate } from "react-router-dom";
import { publicRoutes, privateRoutes, adminRoutes } from "./routes";

// Mock authentication and authorization functions
const isAuthenticated = true; // Replace with real authentication logic
const isAdmin = true; // Replace with real admin check

function Router() {
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
