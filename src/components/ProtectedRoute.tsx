import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  element: ReactNode;
  allowedRoles: string[];
}

export const ProtectedRoute = ({ element, allowedRoles }: ProtectedRouteProps) => {
  const { token, roles } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const hasRequiredRole = allowedRoles.some(role => roles.includes(role));

  if (!hasRequiredRole) {
    if (roles.includes('ADMIN')) {
      return <Navigate to="/process-definition" replace />;
    } else if (roles.includes('VALIDATOR')) {
      return <Navigate to="/validator" replace />;
    } else if (roles.includes('USER')) {
      return <Navigate to="/form" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <>{element}</>;
};