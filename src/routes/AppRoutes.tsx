import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";
import Profile from "@/pages/Profile";
import Dashboard from "@/pages/Dashboard";
import UserActivityLog from "@/pages/UserActivityLog";
import ServiceRequests from "@/pages/ServiceRequests";
import Invoices from "@/pages/Invoices";
import SupplierInvoices from "@/pages/SupplierInvoices";
import Contracts from "@/pages/Contracts";
import Documents from "@/pages/Documents";
import Reports from "@/pages/Reports";
import Services from "@/pages/Services";
import Subscriptions from "@/pages/Subscriptions";
import UsefulLinks from "@/pages/UsefulLinks";
import HR from "@/pages/HR";
import NewEmployee from "@/pages/HR/NewEmployee";
import Termination from "@/pages/HR/Termination";
import WorkHours from "@/pages/HR/WorkHours";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminUsefulLinks from "@/pages/AdminUsefulLinks";
import ServiceEditor from "@/pages/AdminServices/components/ServiceEditor";
import AdminUserManagement from "@/pages/AdminUserManagement";
import AdminLogs from "@/pages/AdminLogs";
import AdminSubscriptions from "@/pages/AdminSubscriptions";
import { ProtectedRoute } from "./ProtectedRoute";
import InvoiceHistory from "@/pages/InvoiceHistory";
import NotificationSettings from "@/pages/AdminServices/components/NotificationSettings";
import AdminServiceRequests from "@/pages/AdminServiceRequests";
import AdminServiceCatalog from "@/pages/AdminServiceCatalog";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
        
        {/* Client Routes */}
        <Route path="dashboard" element={
          <ProtectedRoute requiredRole="client">
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="user/activity-log" element={
          <ProtectedRoute requiredRole="client">
            <UserActivityLog />
          </ProtectedRoute>
        } />
        <Route path="user/service-requests" element={
          <ProtectedRoute requiredRole="client">
            <ServiceRequests />
          </ProtectedRoute>
        } />
        <Route path="invoices" element={
          <ProtectedRoute requiredRole="client">
            <Invoices />
          </ProtectedRoute>
        } />
        <Route path="invoice-history" element={
          <ProtectedRoute requiredRole="client">
            <InvoiceHistory />
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
        <Route path="useful-links" element={
          <ProtectedRoute requiredRole="client">
            <UsefulLinks />
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

        {/* Admin Routes - replacing the old /admin/services route */}
        <Route path="admin/service-requests" element={
          <ProtectedRoute requiredRole="admin">
            <AdminServiceRequests />
          </ProtectedRoute>
        } />
        <Route path="admin/service-catalog" element={
          <ProtectedRoute requiredRole="admin">
            <AdminServiceCatalog />
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
        <Route path="admin/useful-links" element={
          <ProtectedRoute requiredRole="admin">
            <AdminUsefulLinks />
          </ProtectedRoute>
        } />
        <Route path="admin/services/create" element={
          <ProtectedRoute requiredRole="admin">
            <ServiceEditor />
          </ProtectedRoute>
        } />
        <Route path="admin/services/edit/:serviceId" element={
          <ProtectedRoute requiredRole="admin">
            <ServiceEditor />
          </ProtectedRoute>
        } />
        <Route path="admin/users" element={
          <ProtectedRoute requiredRole="admin">
            <AdminUserManagement />
          </ProtectedRoute>
        } />
        <Route path="admin/logs" element={
          <ProtectedRoute requiredRole="admin">
            <AdminLogs />
          </ProtectedRoute>
        } />
        <Route path="admin/subscriptions" element={
          <ProtectedRoute requiredRole="admin">
            <AdminSubscriptions />
          </ProtectedRoute>
        } />
        <Route path="admin/settings/notifications" element={
          <ProtectedRoute requiredRole="admin">
            <NotificationSettings />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
