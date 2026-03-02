import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const ProtectedRoute = ({ children, allowedRoles = null }) => {
    const { isAuthenticated, user } = useAuthStore();
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect them to the /signin page, but save the current location they were
        // trying to go to. This allows us to send them back to that page after they login.
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        // If the route is restricted and user doesn't have the right role, redirect
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
