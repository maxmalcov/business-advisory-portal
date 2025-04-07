
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { servicesTable, Service } from '@/integrations/supabase/client';

interface ServicesManagementProps {
  // Add any props here
}

const ServicesManagement: React.FC<ServicesManagementProps> = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [iconName, setIconName] = useState('Package');
  const [badges, setBadges] = useState('');
  const [popular, setPopular] = useState(false);

  // Fetch services from Supabase
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const { data, error } = await servicesTable()
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setServices(data);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        toast({
          title: "Error",
          description: "Failed to load services",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, [toast]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setIconName('Package');
    setBadges('');
    setPopular(false);
    setCurrentService(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const openEditDialog = (service: Service) => {
    setCurrentService(service);
    setTitle(service.title);
    setDescription(service.description);
    setPrice(service.price.toString());
    setIconName(service.iconName);
    setBadges(service.badges ? service.badges.join(', ') : '');
    setPopular(service.popular);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const serviceData = {
        title,
        description,
        price: parseFloat(price),
        iconName,
        badges: badges.split(',').map(b => b.trim()).filter(b => b),
        popular
      };

      if (isEditMode && currentService) {
        // Update existing service
        const { error } = await servicesTable()
          .update(serviceData)
          .eq('id', currentService.id);
          
        if (error) {
          throw error;
        }
        
        // Update local state
        setServices(prev => 
          prev.map(s => s.id === currentService.id ? { ...s, ...serviceData } : s)
        );
        
        toast({
          title: "Service Updated",
          description: `${title} has been updated successfully.`,
        });
      } else {
        // Add new service
        const { data, error } = await servicesTable()
          .insert(serviceData)
          .select();
          
        if (error) {
          throw error;
        }
        
        if (data) {
          // Add to local state
          setServices(prev => [data[0], ...prev]);
        }
        
        toast({
          title: "Service Added",
          description: `${title} has been added successfully.`,
        });
      }
      
      // Close dialog and reset form
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save service. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    
    try {
      const { error } = await servicesTable()
        .delete()
        .eq('id', serviceId);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setServices(prev => prev.filter(s => s.id !== serviceId));
      
      toast({
        title: "Service Deleted",
        description: "The service has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete service. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Services Management</CardTitle>
        <Button onClick={openAddDialog}>Add New Service</Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="text-center py-4">No services found. Add your first service!</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Popular</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.title}</TableCell>
                  <TableCell className="max-w-md truncate">{service.description}</TableCell>
                  <TableCell>${service.price}</TableCell>
                  <TableCell>
                    {service.popular ? 
                      <Badge className="bg-green-500">Popular</Badge> : 
                      <Badge variant="outline">Regular</Badge>
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openEditDialog(service)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(service.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Service Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Service' : 'Add New Service'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Service title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Describe the service"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input 
                id="price" 
                type="number"
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="iconName">Icon Name</Label>
              <Input 
                id="iconName" 
                value={iconName} 
                onChange={(e) => setIconName(e.target.value)} 
                placeholder="Package"
              />
              <p className="text-xs text-gray-500">
                Use icon names from Lucide React like: Package, CircleDollarSign, FileText, Users, etc.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="badges">Badges (comma separated)</Label>
              <Input 
                id="badges" 
                value={badges} 
                onChange={(e) => setBadges(e.target.value)} 
                placeholder="New, Premium, Limited"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="popular"
                checked={popular}
                onChange={(e) => setPopular(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="popular">Mark as Popular</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{isEditMode ? 'Update' : 'Add'} Service</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ServicesManagement;
