import { Navigate, Outlet, useLocation } from "react-router";
import { useMe } from "../hooks/useAuth";

/** Guards /admin. The loader avoids a redirect flash while the session request
 *  is in flight; `from` returns the user to where they were headed. */
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
