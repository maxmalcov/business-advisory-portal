
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ReactNode } from "react";
import Layout from "@/components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Invoices from "./pages/Invoices";
import CreateInvoice from "./pages/Invoices/Create";
import SupplierInvoices from "./pages/SupplierInvoices";
import NewEmployee from "./pages/NewEmployee";
import Contracts from "./pages/Contracts";
import Documents from "./pages/Documents";
import Reports from "./pages/Reports";
import Services from "./pages/Services";
import AdminServices from "./pages/AdminServices";
import Subscriptions from "./pages/Subscriptions";
import Profile from "./pages/Profile";
import HR from "./pages/HR";
import Termination from "./pages/HR/Termination";
import WorkHours from "./pages/HR/WorkHours";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "admin" | "client";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

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
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                
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
                    <CreateInvoice />
                  </ProtectedRoute>
                } />
                <Route path="supplier-invoices" element={
                  <ProtectedRoute requiredRole="client">
                    <SupplierInvoices />
                  </ProtectedRoute>
                } />
                <Route path="contracts" element={
                  <ProtectedRoute requiredRole="client">
                    <Contracts />
                  </ProtectedRoute>
                } />
                <Route path="documents" element={
                  <ProtectedRoute requiredRole="client">
                    <Documents />
                  </ProtectedRoute>
                } />
                <Route path="reports" element={
                  <ProtectedRoute requiredRole="client">
                    <Reports />
                  </ProtectedRoute>
                } />
                <Route path="profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="services" element={
                  <ProtectedRoute requiredRole="client">
                    <Services />
                  </ProtectedRoute>
                } />
                <Route path="subscriptions" element={
                  <ProtectedRoute requiredRole="client">
                    <Subscriptions />
                  </ProtectedRoute>
                } />
                
                <Route path="hr" element={
                  <ProtectedRoute requiredRole="client">
                    <HR />
                  </ProtectedRoute>
                } />
                <Route path="hr/new-employee" element={
                  <ProtectedRoute requiredRole="client">
                    <NewEmployee />
                  </ProtectedRoute>
                } />
                <Route path="hr/termination" element={
                  <ProtectedRoute requiredRole="client">
                    <Termination />
                  </ProtectedRoute>
                } />
                <Route path="hr/work-hours" element={
                  <ProtectedRoute requiredRole="client">
                    <WorkHours />
                  </ProtectedRoute>
                } />
                
                <Route path="admin" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="admin/reports" element={
                  <ProtectedRoute requiredRole="admin">
                    <Reports />
                  </ProtectedRoute>
                } />
                <Route path="admin/services" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminServices />
                  </ProtectedRoute>
                } />
                <Route path="admin/users" element={
                  <ProtectedRoute requiredRole="admin">
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="admin/logs" element={
                  <ProtectedRoute requiredRole="admin">
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
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
