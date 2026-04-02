import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * SellerRoute — allows approved sellers AND admins.
 * Pending sellers are only allowed on /seller/dashboard (shows pending UI there).
 */
export default function SellerRoute({ children }) {
  const { user, loading, hasRole } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  // Safe fallback for React Fast-Refresh (HMR) transient states
  const safeHasRole = hasRole || ((...roles) => {
    if (!user) return false;
    return roles.some(r => r === user.role || (user.roles || []).includes(r));
  });

  const isAdmin  = safeHasRole('admin');
  const isSeller = safeHasRole('seller');
  const isPending = user?.sellerStatus === 'pending';

  // Admin can access all seller routes
  if (isAdmin) return children;

  // Pending seller: only the dashboard
  if (isPending) {
    if (location.pathname !== '/seller/dashboard') {
      return <Navigate to="/seller/dashboard" replace />;
    }
    return children;
  }

  // Must be an approved seller
  if (!isSeller) return <Navigate to="/" replace />;

  return children;
}