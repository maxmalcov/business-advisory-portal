
import { Route } from "react-router-dom";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminLogs from "@/pages/AdminLogs";
import AdminServiceRequests from "@/pages/AdminServiceRequests";
import AdminServiceCatalog from "@/pages/AdminServiceCatalog";
import AdminSubscriptionRequests from "@/pages/AdminSubscriptionRequests";
import AdminSubscriptionCatalog from "@/pages/AdminSubscriptionCatalog";
import AdminUserManagement from "@/pages/AdminUserManagement";
import AdminUsefulLinks from "@/pages/AdminUsefulLinks";
import AdminSubscriptions from "@/pages/AdminSubscriptions";
import Reports from "@/pages/Reports";
import ServiceEditor from "@/pages/AdminServices/components/ServiceEditor";
import NotificationSettings from "@/pages/AdminServices/components/NotificationSettings";
import { ProtectedRoute } from "./ProtectedRoute";

export const AdminRoutes = (
  <>
    <Route path="admin" element={
      <ProtectedRoute requiredRole="admin">
        <AdminDashboard />
      </ProtectedRoute>
    } />
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
    <Route path="admin/subscription-requests" element={
      <ProtectedRoute requiredRole="admin">
        <AdminSubscriptionRequests />
      </ProtectedRoute>
    } />
    <Route path="admin/subscription-catalog" element={
      <ProtectedRoute requiredRole="admin">
        <AdminSubscriptionCatalog />
      </ProtectedRoute>
    } />
    <Route path="admin/settings/notifications" element={
      <ProtectedRoute requiredRole="admin">
        <NotificationSettings />
      </ProtectedRoute>
    } />
  </>
);
