
import React, { useState } from 'react';
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
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type ServiceStatus = 'available' | 'pending' | 'completed' | 'rejected';

type ServiceRequestType = {
  id: string;
  serviceId: string;
  serviceName: string;
  clientId: string;
  clientName: string;
  requestDate: string;
  status: ServiceStatus;
};

const AdminServices: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [adminEmail, setAdminEmail] = useState('admin@example.com');
  
  // Mock data for service requests
  const [serviceRequests, setServiceRequests] = useState<ServiceRequestType[]>([
    {
      id: 'req1',
      serviceId: 'service3',
      serviceName: 'HR Management',
      clientId: 'client1',
      clientName: 'Acme Corp',
      requestDate: '2025-04-01',
      status: 'pending'
    },
    {
      id: 'req2',
      serviceId: 'service5',
      serviceName: 'Financial Analysis',
      clientId: 'client2',
      clientName: 'Widget LLC',
      requestDate: '2025-03-28',
      status: 'completed'
    },
    {
      id: 'req3',
      serviceId: 'service6',
      serviceName: 'Accounting Software Setup',
      clientId: 'client1',
      clientName: 'Acme Corp',
      requestDate: '2025-03-25',
      status: 'rejected'
    }
  ]);

  const handleUpdateStatus = (requestId: string, newStatus: ServiceStatus) => {
    setServiceRequests(prev => 
      prev.map(request => 
        request.id === requestId ? { ...request, status: newStatus } : request
      )
    );
    
    toast({
      title: "Status Updated",
      description: `Request status has been updated to ${newStatus}.`,
    });
  };

  const handleSaveEmail = () => {
    toast({
      title: "Email Updated",
      description: "Admin notification email has been updated.",
    });
  };

  const filteredRequests = serviceRequests.filter(request => 
    request.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    request.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search requests by service or client..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Service Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Service Requests</CardTitle>
        </CardHeader>
        <CardContent>
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
                  <TableCell>{request.clientName}</TableCell>
                  <TableCell>{request.serviceName}</TableCell>
                  <TableCell>{request.requestDate}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminServices;
