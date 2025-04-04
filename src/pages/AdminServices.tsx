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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase, serviceRequestsTable, ServiceRequest } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ServiceStatus = 'available' | 'pending' | 'completed' | 'rejected';

const AdminServices: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [adminEmail, setAdminEmail] = useState('admin@example.com');
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  // Fetch service requests from Supabase
  useEffect(() => {
    const fetchServiceRequests = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await serviceRequestsTable()
          .select('*')
          .order('request_date', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setServiceRequests(data);
        }
      } catch (error) {
        console.error('Error fetching service requests:', error);
        toast({
          title: "Error",
          description: "Failed to load service requests",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchServiceRequests();
    
    // Set up a realtime subscription for updates to the service_requests table
    const subscription = supabase
      .channel('service_request_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'service_requests' 
      }, (payload) => {
        console.log('Change received!', payload);
        fetchServiceRequests();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [toast]);

  const handleUpdateStatus = async (requestId: string, newStatus: ServiceStatus) => {
    try {
      const { error } = await serviceRequestsTable()
        .update({ status: newStatus })
        .eq('id', requestId);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setServiceRequests(prev => 
        prev.map(request => 
          request.id === requestId ? { ...request, status: newStatus } : request
        )
      );
      
      toast({
        title: "Status Updated",
        description: `Request status has been updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSaveEmail = async () => {
    toast({
      title: "Email Updated",
      description: "Admin notification email has been updated.",
    });
  };

  const openDetailsDialog = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setAdminNotes(request.admin_notes || '');
    setIsDialogOpen(true);
  };

  const handleSaveNotes = async () => {
    if (!selectedRequest) return;
    
    try {
      const { error } = await serviceRequestsTable()
        .update({ admin_notes: adminNotes })
        .eq('id', selectedRequest.id);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setServiceRequests(prev => 
        prev.map(request => 
          request.id === selectedRequest.id ? { ...request, admin_notes: adminNotes } : request
        )
      );
      
      setIsDialogOpen(false);
      
      toast({
        title: "Notes Saved",
        description: "Admin notes have been updated for this request.",
      });
    } catch (error) {
      console.error('Error saving notes:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save notes. Please try again.",
        variant: "destructive"
      });
    }
  };

  const filteredRequests = serviceRequests.filter(request => {
    const matchesSearch = 
      request.service_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      request.client_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ServiceStatus) => {
    switch(status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge>Available</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Manage Service Requests</h1>
        <p className="text-muted-foreground">Oversee and update service requests from clients</p>
      </div>
      
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
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Bar */}
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requests by service or client..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Status Filter */}
        <div className="w-full md:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Service Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Service Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading service requests...</div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-4">No service requests found.</div>
          ) : (
            <Table>
              <TableCaption>List of all service requests from clients</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.client_name}</TableCell>
                    <TableCell>{request.service_name}</TableCell>
                    <TableCell>{formatDate(request.request_date)}</TableCell>
                    <TableCell>{getStatusBadge(request.status as ServiceStatus)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openDetailsDialog(request)}
                        >
                          Details
                        </Button>
                        
                        {request.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="bg-green-50 hover:bg-green-100 text-green-700"
                              onClick={() => handleUpdateStatus(request.id, 'completed')}
                            >
                              Complete
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="bg-red-50 hover:bg-red-100 text-red-700"
                              onClick={() => handleUpdateStatus(request.id, 'rejected')}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {request.status !== 'pending' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleUpdateStatus(request.id, 'pending')}
                          >
                            Reset to Pending
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Service Request Details</DialogTitle>
            <DialogDescription>
              View and manage the details of this service request
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Client:</Label>
                  <div className="font-medium">{selectedRequest.client_name}</div>
                </div>
                <div>
                  <Label>Service:</Label>
                  <div className="font-medium">{selectedRequest.service_name}</div>
                </div>
                <div>
                  <Label>Request Date:</Label>
                  <div className="font-medium">{formatDate(selectedRequest.request_date)}</div>
                </div>
                <div>
                  <Label>Status:</Label>
                  <div className="font-medium">{getStatusBadge(selectedRequest.status as ServiceStatus)}</div>
                </div>
                <div>
                  <Label>Last Updated:</Label>
                  <div className="font-medium">{formatDate(selectedRequest.updated_at)}</div>
                </div>
                <div>
                  <Label>Request ID:</Label>
                  <div className="font-medium text-xs">{selectedRequest.id}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="admin-notes">Admin Notes:</Label>
                <Textarea
                  id="admin-notes"
                  placeholder="Add internal notes about this request..."
                  rows={4}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveNotes}>Save Notes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminServices;
