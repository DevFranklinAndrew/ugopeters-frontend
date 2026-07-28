import { Navigate, Outlet, useLocation } from "react-router";
import { useAdminAuth } from "../context/AdminAuthContext";

/**
 * Guards the /admin route tree. Redirects unauthenticated users to the login
 * page, preserving the attempted location so they can be returned after login.
 */
const ProtectedRoute = () => {
  const { isAuthenticated } = useAdminAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
