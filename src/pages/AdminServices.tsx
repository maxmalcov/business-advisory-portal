
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Filter, Calendar, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';

type ServiceStatus = 'available' | 'pending' | 'completed' | 'rejected' | 'in-progress';

type ServiceRequestType = {
  id: string;
  serviceId: string;
  serviceName: string;
  clientId: string;
  clientName: string;
  requestDate: string;
  status: ServiceStatus;
  adminNotes?: string;
  lastUpdated?: string;
};

const AdminServices: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [adminEmail, setAdminEmail] = useState('admin@example.com');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from: string, to: string }>({
    from: '',
    to: new Date().toISOString().split('T')[0]
  });
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [detailView, setDetailView] = useState<ServiceRequestType | null>(null);
  const [adminNote, setAdminNote] = useState<string>('');
  const [userList, setUserList] = useState<{id: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock data for service requests
  const [serviceRequests, setServiceRequests] = useState<ServiceRequestType[]>([
    {
      id: 'req1',
      serviceId: 'service3',
      serviceName: 'HR Management',
      clientId: 'client1',
      clientName: 'Acme Corp',
      requestDate: '2025-04-01',
      status: 'pending',
      adminNotes: '',
      lastUpdated: '2025-04-01'
    },
    {
      id: 'req2',
      serviceId: 'service5',
      serviceName: 'Financial Analysis',
      clientId: 'client2',
      clientName: 'Widget LLC',
      requestDate: '2025-03-28',
      status: 'completed',
      adminNotes: 'Delivered full report ahead of schedule',
      lastUpdated: '2025-03-30'
    },
    {
      id: 'req3',
      serviceId: 'service6',
      serviceName: 'Accounting Software Setup',
      clientId: 'client1',
      clientName: 'Acme Corp',
      requestDate: '2025-03-25',
      status: 'rejected',
      adminNotes: 'Client canceled the request',
      lastUpdated: '2025-03-26'
    },
    {
      id: 'req4',
      serviceId: 'service2',
      serviceName: 'Tax Consulting',
      clientId: 'client3',
      clientName: 'Tech Innovators',
      requestDate: '2025-03-22',
      status: 'in-progress',
      adminNotes: 'Waiting for additional documents from client',
      lastUpdated: '2025-03-24'
    }
  ]);

  // Fetch users for filtering
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name')
          .eq('usertype', 'client');
          
        if (error) throw error;
        
        setUserList(data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load user list for filtering',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [toast]);

  const handleUpdateStatus = (requestId: string, newStatus: ServiceStatus) => {
    const now = new Date().toISOString().split('T')[0];
    
    setServiceRequests(prev => 
      prev.map(request => 
        request.id === requestId ? { 
          ...request, 
          status: newStatus,
          lastUpdated: now
        } : request
      )
    );
    
    toast({
      title: "Status Updated",
      description: `Request status has been updated to ${newStatus}.`,
    });
    
    // Close detail view if open
    if (detailView && detailView.id === requestId) {
      setDetailView({
        ...detailView,
        status: newStatus,
        lastUpdated: now
      });
    }
    
    // In a real app, we would update the status in the database here
  };

  const handleSaveEmail = () => {
    toast({
      title: "Email Updated",
      description: "Admin notification email has been updated.",
    });
  };
  
  const handleSaveNote = (requestId: string) => {
    setServiceRequests(prev => 
      prev.map(request => 
        request.id === requestId ? { 
          ...request, 
          adminNotes: adminNote,
          lastUpdated: new Date().toISOString().split('T')[0]
        } : request
      )
    );
    
    if (detailView) {
      setDetailView({
        ...detailView,
        adminNotes: adminNote,
        lastUpdated: new Date().toISOString().split('T')[0]
      });
    }
    
    toast({
      title: "Note Saved",
      description: "Admin note has been saved for this service request.",
    });
    
    // In a real app, we would save the note to the database here
  };
  
  const openDetailView = (request: ServiceRequestType) => {
    setDetailView(request);
    setAdminNote(request.adminNotes || '');
  };
  
  const closeDetailView = () => {
    setDetailView(null);
    setAdminNote('');
  };

  // Filter service requests based on all filters
  const filteredRequests = serviceRequests.filter(request => {
    // Search filter
    const matchesSearch = 
      request.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      request.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = 
      selectedStatus === 'all' || 
      request.status === selectedStatus;
    
    // Date range filter
    const requestDate = new Date(request.requestDate);
    const fromDate = dateRange.from ? new Date(dateRange.from) : new Date(0);
    const toDate = dateRange.to ? new Date(dateRange.to) : new Date();
    const matchesDateRange = 
      requestDate >= fromDate && 
      requestDate <= toDate;
    
    // User filter
    const matchesUser = 
      selectedUser === 'all' || 
      request.clientId === selectedUser;
    
    return matchesSearch && matchesStatus && matchesDateRange && matchesUser;
  });

  const getStatusBadge = (status: ServiceStatus) => {
    switch(status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      default:
        return <Badge>Available</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Manage Service Requests</h1>
        <p className="text-muted-foreground">Oversee and update service requests from clients</p>
      </div>
      
      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="requests">Service Requests</TabsTrigger>
          <TabsTrigger value="settings">Notification Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="requests" className="space-y-4">
          {/* Filters Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search Filter */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by service or client..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {/* Status Filter */}
                <div className="space-y-2">
                  <Label htmlFor="status-filter" className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Status
                  </Label>
                  <Select 
                    value={selectedStatus} 
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger id="status-filter">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Date Range Filter */}
                <div className="space-y-2">
                  <Label htmlFor="date-from" className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Date Range
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="date-from"
                      type="date"
                      value={dateRange.from}
                      onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                      className="w-1/2"
                    />
                    <Input
                      id="date-to"
                      type="date"
                      value={dateRange.to}
                      onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                      className="w-1/2"
                    />
                  </div>
                </div>
                
                {/* User Filter */}
                <div className="space-y-2">
                  <Label htmlFor="user-filter" className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Client
                  </Label>
                  <Select 
                    value={selectedUser} 
                    onValueChange={setSelectedUser}
                  >
                    <SelectTrigger id="user-filter">
                      <SelectValue placeholder="Filter by client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Clients</SelectItem>
                      {!isLoading && userList.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                      {/* Add mock data if no real users loaded */}
                      {isLoading && (
                        <>
                          <SelectItem value="client1">Acme Corp</SelectItem>
                          <SelectItem value="client2">Widget LLC</SelectItem>
                          <SelectItem value="client3">Tech Innovators</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Service Requests Table */}
          <Card>
            <CardHeader>
              <CardTitle>Service Requests</CardTitle>
              <CardDescription>
                {filteredRequests.length} requests found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>List of all service requests from clients</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.length > 0 ? (
                    filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.clientName}</TableCell>
                        <TableCell>{request.serviceName}</TableCell>
                        <TableCell>{request.requestDate}</TableCell>
                        <TableCell>{request.lastUpdated || request.requestDate}</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => openDetailView(request)}
                            >
                              Details
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No service requests found matching the current filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          {/* Admin Email Setting */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure where service request notifications are sent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="admin-email">Admin Notification Email</Label>
                <div className="flex gap-2">
                  <Input 
                    id="admin-email"
                    type="email" 
                    value={adminEmail} 
                    onChange={(e) => setAdminEmail(e.target.value)} 
                    className="flex-grow"
                  />
                  <Button onClick={handleSaveEmail}>Save</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Detail View Dialog */}
      <Dialog open={!!detailView} onOpenChange={(open) => !open && closeDetailView()}>
        {detailView && (
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Service Request Details</DialogTitle>
              <DialogDescription>
                Request ID: {detailView.id}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Client</Label>
                  <p className="font-medium">{detailView.clientName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Service</Label>
                  <p className="font-medium">{detailView.serviceName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Request Date</Label>
                  <p className="font-medium">{detailView.requestDate}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Last Updated</Label>
                  <p className="font-medium">{detailView.lastUpdated || detailView.requestDate}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Current Status</Label>
                  <p className="font-medium mt-1">{getStatusBadge(detailView.status)}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status-update">Update Status</Label>
                <Select 
                  defaultValue={detailView.status}
                  onValueChange={(value) => handleUpdateStatus(detailView.id, value as ServiceStatus)}
                >
                  <SelectTrigger id="status-update">
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="admin-notes">Admin Notes</Label>
                <Textarea 
                  id="admin-notes" 
                  placeholder="Add notes or comments about this service request"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={closeDetailView}>
                Close
              </Button>
              <Button onClick={() => handleSaveNote(detailView.id)}>
                Save Notes
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default AdminServices;
