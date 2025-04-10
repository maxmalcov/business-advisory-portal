
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend 
} from 'recharts';
import { 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  Package,
  BarChart3,
  Calendar,
  FileUp,
  UserCheck,
  UserMinus,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ActivityEvent, getRecentActivity, getMockRecentActivity } from '@/utils/activity';
import { supabase } from '@/integrations/supabase/client';

const ReportsPage: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [activityData, setActivityData] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [invoiceStats, setInvoiceStats] = useState({
    total: 0,
    sales: 0,
    supplier: 0,
    thisMonth: 0,
    lastMonth: 0,
  });
  const [employeeStats, setEmployeeStats] = useState({
    total: 0,
    active: 0,
    terminated: 0,
    recentlyAdded: 0,
  });
  const [servicesStats, setServicesStats] = useState({
    completed: 0,
    pending: 0,
    requested: 0,
  });

  // Colors for charts
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];
  
  // Monthly invoice data for bar chart
  const [monthlyData, setMonthlyData] = useState([
    { name: 'Jan', sales: 0, supplier: 0 },
    { name: 'Feb', sales: 0, supplier: 0 },
    { name: 'Mar', sales: 0, supplier: 0 },
    { name: 'Apr', sales: 0, supplier: 0 },
    { name: 'May', sales: 0, supplier: 0 },
    { name: 'Jun', sales: 0, supplier: 0 },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get recent activity
        const activityEvents = await getRecentActivity();
        setActivityData(activityEvents);
        
        // Get invoice statistics
        const { data: invoices, error: invoiceError } = await supabase
          .from('invoice_uploads')
          .select('*');
        
        if (invoiceError) throw invoiceError;
        
        if (invoices) {
          const currentDate = new Date();
          const thisMonth = currentDate.getMonth();
          const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
          const currentYear = currentDate.getFullYear();
          
          const salesInvoices = invoices.filter(inv => inv.invoice_type === 'sale');
          const supplierInvoices = invoices.filter(inv => inv.invoice_type === 'supplier');
          
          const thisMonthInvoices = invoices.filter(inv => {
            const invDate = new Date(inv.created_at);
            return invDate.getMonth() === thisMonth && invDate.getFullYear() === currentYear;
          });
          
          const lastMonthInvoices = invoices.filter(inv => {
            const invDate = new Date(inv.created_at);
            return invDate.getMonth() === lastMonth && 
              (lastMonth === 11 ? invDate.getFullYear() === currentYear - 1 : invDate.getFullYear() === currentYear);
          });
          
          setInvoiceStats({
            total: invoices.length,
            sales: salesInvoices.length,
            supplier: supplierInvoices.length,
            thisMonth: thisMonthInvoices.length,
            lastMonth: lastMonthInvoices.length,
          });
          
          // Prepare monthly data for chart
          const newMonthlyData = [...monthlyData];
          
          // Group by month and count
          for (const invoice of invoices) {
            const invDate = new Date(invoice.created_at);
            const monthIndex = invDate.getMonth();
            
            // Only process last 6 months
            if (monthIndex >= currentDate.getMonth() - 5 && 
                invDate.getFullYear() === currentYear) {
              const monthName = new Date(currentYear, monthIndex).toLocaleString('default', { month: 'short' });
              const existingMonthIndex = newMonthlyData.findIndex(m => m.name === monthName);
              
              if (existingMonthIndex !== -1) {
                if (invoice.invoice_type === 'sale') {
                  newMonthlyData[existingMonthIndex].sales += 1;
                } else if (invoice.invoice_type === 'supplier') {
                  newMonthlyData[existingMonthIndex].supplier += 1;
                }
              }
            }
          }
          
          setMonthlyData(newMonthlyData);
        }
        
        // Get employee statistics
        const { data: employees, error: employeeError } = await supabase
          .from('employees')
          .select('*');
        
        if (employeeError) throw employeeError;
        
        if (employees) {
          const active = employees.filter(emp => emp.status === 'active');
          const terminated = employees.filter(emp => emp.status === 'terminated');
          
          // Employees added in the last 30 days
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          const recentlyAdded = employees.filter(emp => {
            const empDate = new Date(emp.created_at);
            return empDate >= thirtyDaysAgo;
          });
          
          setEmployeeStats({
            total: employees.length,
            active: active.length,
            terminated: terminated.length,
            recentlyAdded: recentlyAdded.length,
          });
        }
        
        // Get service statistics
        const { data: services, error: servicesError } = await supabase
          .from('service_requests')
          .select('*');
        
        if (servicesError) throw servicesError;
        
        if (services) {
          const completed = services.filter(svc => svc.status === 'completed');
          const pending = services.filter(svc => svc.status === 'pending');
          
          setServicesStats({
            completed: completed.length,
            pending: pending.length,
            requested: services.length,
          });
        }
      } catch (error) {
        console.error('Error fetching report data:', error);
        toast({
          variant: "destructive",
          title: "Error loading report data",
          description: "There was a problem loading your report data. Please try again later.",
        });
        // Use mock data as fallback
        setActivityData(getMockRecentActivity());
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);
  
  // Prepare data for pie charts
  const invoicePieData = [
    { name: 'Sales', value: invoiceStats.sales },
    { name: 'Supplier', value: invoiceStats.supplier },
  ];
  
  const employeePieData = [
    { name: 'Active', value: employeeStats.active },
    { name: 'Terminated', value: employeeStats.terminated },
  ];
  
  const servicesPieData = [
    { name: 'Completed', value: servicesStats.completed },
    { name: 'Pending', value: servicesStats.pending },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">{t('nav.reports')}</h1>
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading your report data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">{t('nav.reports')}</h1>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Account Activity</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="people">People</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{invoiceStats.total}</div>
                <p className="text-xs text-muted-foreground">
                  {invoiceStats.thisMonth} uploaded this month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{employeeStats.active}</div>
                <p className="text-xs text-muted-foreground">
                  {employeeStats.recentlyAdded} added in last 30 days
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Service Requests</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{servicesStats.requested}</div>
                <p className="text-xs text-muted-foreground">
                  {servicesStats.completed} completed, {servicesStats.pending} pending
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Activity</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activityData.length}</div>
                <p className="text-xs text-muted-foreground">
                  Last activity: {activityData.length > 0 ? 
                    formatDistanceToNow(activityData[0].timestamp, { addSuffix: true }) : 
                    'No recent activity'}
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts Section */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Monthly Invoice Activity</CardTitle>
                <CardDescription>
                  Number of invoices processed per month
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={monthlyData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" name="Sales Invoices" fill="#8884d8" />
                    <Bar dataKey="supplier" name="Supplier Invoices" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Distribution</CardTitle>
                <CardDescription>
                  Sales vs. Supplier Invoices
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={invoicePieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {invoicePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Employee Status</CardTitle>
                <CardDescription>
                  Active vs. Terminated Employees
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={employeePieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {employeePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Service Requests</CardTitle>
                <CardDescription>
                  Service request status
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={servicesPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {servicesPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Account Activity</CardTitle>
              <CardDescription>
                Recent events and changes to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activityData.length === 0 ? (
                <div className="py-8 text-center">
                  <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No account activity</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    No account activity has been recorded yet.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activityData.map((activity) => {
                      // Determine icon based on activity type
                      let ActivityIcon;
                      switch (activity.type) {
                        case 'employee-added':
                          ActivityIcon = UserCheck;
                          break;
                        case 'employee-terminated':
                          ActivityIcon = UserMinus;
                          break;
                        case 'invoice-uploaded':
                        case 'supplier-invoice-uploaded':
                          ActivityIcon = FileUp;
                          break;
                        case 'service-completed':
                          ActivityIcon = CheckCircle;
                          break;
                        case 'subscription-activated':
                        case 'subscription-ended':
                          ActivityIcon = Package;
                          break;
                        default:
                          ActivityIcon = Clock;
                      }

                      return (
                        <TableRow key={activity.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="mr-2 bg-muted p-2 rounded-full">
                                <ActivityIcon className="h-5 w-5" />
                              </div>
                              {activity.title}
                            </div>
                          </TableCell>
                          <TableCell>{activity.description}</TableCell>
                          <TableCell>{formatDistanceToNow(activity.timestamp, { addSuffix: true })}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Summary</CardTitle>
              <CardDescription>
                Overview of your documents and invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Documents
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{invoiceStats.total}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Sales Invoices
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{invoiceStats.sales}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Supplier Invoices
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{invoiceStats.supplier}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        This Month
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{invoiceStats.thisMonth}</div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Comparison</CardTitle>
                    <CardDescription>
                      Current month vs previous month
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-sm font-medium text-muted-foreground">This Month</p>
                        <h3 className="text-3xl font-bold mt-2">{invoiceStats.thisMonth}</h3>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-muted-foreground">Last Month</p>
                        <h3 className="text-3xl font-bold mt-2">{invoiceStats.lastMonth}</h3>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button variant="outline">View All Documents</Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="people" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Summary</CardTitle>
              <CardDescription>
                Overview of your employee information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Employees
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{employeeStats.total}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-green-600">
                        Active Employees
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{employeeStats.active}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-red-600">
                        Terminated Employees
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{employeeStats.terminated}</div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Additions</CardTitle>
                    <CardDescription>
                      Employees added in the last 30 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <div className="text-5xl font-bold">{employeeStats.recentlyAdded}</div>
                      <p className="text-sm text-muted-foreground mt-2">New employees</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button variant="outline">Manage Employees</Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
