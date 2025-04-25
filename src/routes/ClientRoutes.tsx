
import { Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import UserActivityLog from "@/pages/UserActivityLog";
import ServiceRequests from "@/pages/ServiceRequests";
import Invoices from "@/pages/Invoices";
import InvoiceHistory from "@/pages/InvoiceHistory";
import SupplierInvoices from "@/pages/SupplierInvoices";
import Contracts from "@/pages/Contracts";
import Documents from "@/pages/Documents";
import Reports from "@/pages/Reports";
import Services from "@/pages/Services";
import Subscriptions from "@/pages/Subscriptions";
import UsefulLinks from "@/pages/UsefulLinks";
import { ProtectedRoute } from "./ProtectedRoute";

export const ClientRoutes = (
  <>
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
  </>
);
