
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n';
import Layout from './components/Layout';
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import CreateInvoice from './pages/Invoices/Create';
import SupplierInvoices from './pages/SupplierInvoices';
import CreateSupplierInvoice from './pages/SupplierInvoices/Create';
import HR from './pages/HR';
import NewEmployee from './pages/HR/NewEmployee';
import Termination from './pages/HR/Termination';
import WorkHours from './pages/HR/WorkHours';
import Contracts from './pages/Contracts';
import Documents from './pages/Documents';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Services from './pages/Services';
import Subscriptions from './pages/Subscriptions';
import AdminDashboard from './pages/AdminDashboard';
import AdminServicesPage from './pages/AdminServices';
import ServiceEditor from './pages/AdminServices/components/ServiceEditor';
import AdminSubscriptions from './pages/AdminSubscriptions';
import AdminUserManagement from './pages/AdminUserManagement';
import LogsContent from './pages/AdminLogs/components/LogsContent';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
// Import SaleInvoice pages
import SaleInvoices from "./pages/SaleInvoices";
import CreateSaleInvoice from "./pages/SaleInvoices/Create";

function App() {
  const { i18n } = useTranslation();

  React.useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage);
    }
  }, [i18n]);

  return (
    <Router>
      <div className="app">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Public routes */}
              <Route index element={<Index />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              
              {/* Protected client routes */}
              <Route element={<ProtectedRoute allowedRoles={['client', 'admin']} />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="invoices" element={<Invoices />} />
                <Route path="invoices/create" element={<CreateInvoice />} />
                <Route path="sale-invoices" element={<SaleInvoices />} />
                <Route path="sale-invoices/create" element={<CreateSaleInvoice />} />
                <Route path="supplier-invoices" element={<SupplierInvoices />} />
                <Route path="supplier-invoices/create" element={<CreateSupplierInvoice />} />
                <Route path="hr" element={<HR />} />
                <Route path="hr/new-employee" element={<NewEmployee />} />
                <Route path="hr/termination" element={<Termination />} />
                <Route path="hr/work-hours" element={<WorkHours />} />
                <Route path="contracts" element={<Contracts />} />
                <Route path="documents" element={<Documents />} />
                <Route path="reports" element={<Reports />} />
                <Route path="profile" element={<Profile />} />
                <Route path="services" element={<Services />} />
                <Route path="subscriptions" element={<Subscriptions />} />
              </Route>
              
              {/* Admin routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="admin/reports" element={<Reports />} />
                <Route path="admin/services" element={<AdminServicesPage />} />
                <Route path="admin/services/create" element={<ServiceEditor />} />
                <Route path="admin/subscriptions" element={<AdminSubscriptions />} />
                <Route path="admin/users" element={<AdminUserManagement />} />
                <Route path="admin/logs" element={<LogsContent logs={[]} chartData={[]} weeklyData={[]} />} />
              </Route>
              
              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
