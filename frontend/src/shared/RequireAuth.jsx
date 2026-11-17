import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router';
import { savePending, useAuth } from '../features/auth/auth';
import { matchRoute, ROUTES } from '../routes';

/**
 * Route guard (SH-05). Signed-out users are sent to /signin. The page and item they wanted are remembered outside the
 * URL, so they come straight back after signing in.
 *
 *   <Route path="/account/listings" element={<RequireAuth><MyListingsPage /></RequireAuth>} />
 */
export function RequireAuth({ children }) {
  const { signedIn } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (signedIn) return;
    const { name, params } = matchRoute(location.pathname);
    savePending({ to: location.pathname + location.search, name, label: ROUTES[name].title, itemId: params.id });
  }, [signedIn, location.pathname, location.search]);

  return signedIn ? children : <Navigate to="/signin" replace />;
}
