
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProtectedRoute from './ProtectedRoute';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Invoices from '@/pages/Invoices';
import SupplierInvoices from '@/pages/SupplierInvoices';
import InvoiceHistory from '@/pages/InvoiceHistory';
import NotFound from '@/pages/NotFound';
import Profile from '@/pages/Profile';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminUserManagement from '@/pages/AdminUserManagement';
import AdminLogs from '@/pages/AdminLogs';
import AdminServices from '@/pages/AdminServices';
import AdminSubscriptions from '@/pages/AdminSubscriptions';
import AdminUsefulLinks from '@/pages/AdminUsefulLinks';
import Services from '@/pages/Services';
import ServiceRequests from '@/pages/ServiceRequests';
import Subscriptions from '@/pages/Subscriptions';
import UsefulLinks from '@/pages/UsefulLinks';
import UserActivityLog from '@/pages/UserActivityLog';
import HR from '@/pages/HR';
import NewEmployee from '@/pages/HR/NewEmployee';
import Termination from '@/pages/HR/Termination';
import WorkHours from '@/pages/HR/WorkHours';
import Reports from '@/pages/Reports';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Protected Client Routes */}
        <Route element={<ProtectedRoute allowedRoles={['client']} />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="supplier-invoices" element={<SupplierInvoices />} />
          <Route path="invoice-history" element={<InvoiceHistory />} />
          <Route path="activity-log" element={<UserActivityLog />} />
          <Route path="profile" element={<Profile />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="services" element={<Services />} />
          <Route path="service-requests" element={<ServiceRequests />} />
          <Route path="useful-links" element={<UsefulLinks />} />
          
          {/* HR Routes */}
          <Route path="hr" element={<HR />} />
          <Route path="hr/new-employee" element={<NewEmployee />} />
          <Route path="hr/termination" element={<Termination />} />
          <Route path="hr/work-hours" element={<WorkHours />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/users" element={<AdminUserManagement />} />
          <Route path="admin/logs" element={<AdminLogs />} />
          <Route path="admin/services" element={<AdminServices />} />
          <Route path="admin/subscriptions" element={<AdminSubscriptions />} />
          <Route path="admin/useful-links" element={<AdminUsefulLinks />} />
          <Route path="admin/reports" element={<Reports />} />
        </Route>

        {/* Catch All */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
