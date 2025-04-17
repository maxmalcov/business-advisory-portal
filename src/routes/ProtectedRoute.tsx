
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children?: ReactNode;
  allowedRoles?: string[];
  requiredRole?: "admin" | "client";
}

export const ProtectedRoute = ({ children, allowedRoles, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Check role using either allowedRoles (array) or requiredRole (string)
  if (allowedRoles && user?.userType && !allowedRoles.includes(user.userType)) {
    return <Navigate to={user?.userType === 'admin' ? '/admin' : '/dashboard'} />;
  }
  
  if (requiredRole && user?.userType !== requiredRole) {
    return <Navigate to={user?.userType === 'admin' ? '/admin' : '/dashboard'} />;
  }

  return <>{children}</>;
};
