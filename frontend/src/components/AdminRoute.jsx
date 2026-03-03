import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ─────────────────────────────────────────────────────────────────────────────
// AdminRoute — wraps admin-only pages.
//
// Rules:
//   • Still loading auth state → show spinner (same as PrivateRoute)
//   • Not authenticated        → redirect to /login
//   • Authenticated, not admin → redirect to /dashboard (forbidden, not 404)
//   • Authenticated + admin    → render children ✅
// ─────────────────────────────────────────────────────────────────────────────
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Checking permissions…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    // Logged in but not admin — send back to their own dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
