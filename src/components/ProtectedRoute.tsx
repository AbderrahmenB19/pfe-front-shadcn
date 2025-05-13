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
    // Short timeout to ensure roles are loaded
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Check if user has any of the allowed roles
  const hasRequiredRole = allowedRoles.some(role => roles.includes(role));

  // If user doesn't have required role, redirect to home
  if (!hasRequiredRole) {
    return <Navigate to="/" replace />;
  }

  // If user has required role, render the component
  return <>{element}</>;
};