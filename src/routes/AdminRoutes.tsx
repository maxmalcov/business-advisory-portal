
import { Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import AdminDashboard from "@/pages/AdminDashboard";
import Reports from "@/pages/Reports";
import AdminServices from "@/pages/AdminServices";
import ServiceEditor from "@/pages/AdminServices/components/ServiceEditor";
import AdminUserManagement from "@/pages/AdminUserManagement";
import AdminLogs from "@/pages/AdminLogs";
import AdminSubscriptions from "@/pages/AdminSubscriptions";
import AdminUsefulLinks from "@/pages/AdminUsefulLinks";

const AdminRoutes = () => {
  return (
    <>
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
    </>
  );
};

export default AdminRoutes;
