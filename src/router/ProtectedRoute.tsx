import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { JSX } from 'react';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { token } = useAuthStore();
    return token ? children : <Navigate to="/" />;
};

export default ProtectedRoute;