import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import authService from '../services/auth.service';
import config from '../config';

const ProtectedRoute = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isValid, setIsValid] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const validateAuth = async () => {
            try {
                if (authService.isAuthenticated()) {
                    await authService.validateToken();
                    setIsValid(true);
                }
            } catch (error) {
                console.error('Auth validation error:', error);
                setIsValid(false);
            } finally {
                setIsLoading(false);
            }
        };

        validateAuth();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>; // You can replace this with a proper loading component
    }

    if (!isValid) {
        return <Navigate to={config.ROUTES.LOGIN} state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute; 