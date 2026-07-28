import { Navigate, Outlet, useLocation } from "react-router";
import { useMe } from "../hooks/useAuth";

/**
 * Guards the /admin route tree. Verifies the session via GET /api/admin/me.
 * While that request is in flight a loader is shown to avoid a redirect flash;
 * an unauthenticated (401) result redirects to login, preserving the attempted
 * location so the user is returned there after signing in.
 */
const ProtectedRoute = () => {
  const { data: admin, isLoading } = useMe();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-border border-t-gold animate-spin" />
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
