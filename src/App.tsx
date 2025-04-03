
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/context/language";
import { AuthProvider } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Invoices from "./pages/Invoices";
import NewEmployee from "./pages/NewEmployee";

// Auth guard for protected routes
import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "admin" | "client";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // While checking auth state, show nothing
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If role is required and user doesn't have it
  if (requiredRole && user?.userType !== requiredRole) {
    return <Navigate to={user?.userType === 'admin' ? '/admin' : '/dashboard'} />;
  }

  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                
                {/* Client routes */}
                <Route path="dashboard" element={
                  <ProtectedRoute requiredRole="client">
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="invoices" element={
                  <ProtectedRoute requiredRole="client">
                    <Invoices />
                  </ProtectedRoute>
                } />
                <Route path="invoices/create" element={
                  <ProtectedRoute requiredRole="client">
                    <Invoices />
                  </ProtectedRoute>
                } />
                <Route path="supplier-invoices" element={
                  <ProtectedRoute requiredRole="client">
                    <Invoices />
                  </ProtectedRoute>
                } />
                <Route path="hr/new-employee" element={
                  <ProtectedRoute requiredRole="client">
                    <NewEmployee />
                  </ProtectedRoute>
                } />
                
                {/* Admin routes */}
                <Route path="admin" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                
                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
