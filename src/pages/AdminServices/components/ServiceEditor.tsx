
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useServiceForm } from '../hooks/useServiceForm';
import { useServiceEditor } from '../hooks/useServiceEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ServiceEditor: React.FC = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const isEditMode = !!serviceId;
  const { toast } = useToast();
  
  // Service form state
  const {
    title,
    setTitle,
    description,
    setDescription,
    price,
    setPrice,
    iconName,
    setIconName,
    badges,
    setBadges,
    popular,
    setPopular,
    category,
    setCategory,
    status,
    setStatus,
    resetForm,
    getFormData
  } = useServiceForm();
  
  // Get service data and submit handler
  const { 
    loading, 
    service, 
    saveService 
  } = useServiceEditor(serviceId, resetForm);

  // Set form data when service is loaded (for edit mode)
  useEffect(() => {
    if (service && isEditMode) {
      setTitle(service.title);
      setDescription(service.description);
      setPrice(service.price.toString());
      setIconName(service.iconName);
      setBadges(service.badges ? service.badges.join(', ') : '');
      setPopular(service.popular);
      setCategory(service.category || '');
      setStatus(service.status || 'active');
    }
  }, [service, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formData = getFormData();
      console.log('Submitting form data:', formData);
      await saveService(formData);
      
      toast({
        title: `Service ${isEditMode ? 'updated' : 'created'} successfully`,
        description: `The service "${title}" has been ${isEditMode ? 'updated' : 'created'}.`,
      });
      
      navigate('/admin/services');
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        title: 'Error',
        description: `Failed to ${isEditMode ? 'update' : 'create'} service. Please try again.`,
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    navigate('/admin/services');
  };

  const categories = [
    'Accounting',
    'Tax Planning',
    'Business Formation',
    'Financial Analysis',
    'Bookkeeping',
    'Payroll',
    'Consulting',
    'Other'
  ];

  if (loading && isEditMode) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" disabled>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={handleCancel}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">{isEditMode ? 'Edit Service' : 'Create New Service'}</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title*</Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Service title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description*</Label>
                <Textarea 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Describe the service"
                  rows={5}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price*</Label>
                  <Input 
                    id="price" 
                    type="number"
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
              
              <div className="flex items-center justify-between">
                <Label htmlFor="popular">Mark as Popular</Label>
                <Switch
                  id="popular"
                  checked={popular}
                  onCheckedChange={setPopular}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="status">Status</Label>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="status-active" className={status === 'active' ? 'text-green-600' : 'text-gray-500'}>
                    Active
                  </Label>
                  <Switch
                    id="status"
                    checked={status === 'active'}
                    onCheckedChange={(checked) => setStatus(checked ? 'active' : 'inactive')}
                  />
                  <Label htmlFor="status-inactive" className={status === 'inactive' ? 'text-red-600' : 'text-gray-500'}>
                    Inactive
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                {isEditMode ? 'Update' : 'Create'} Service
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceEditor;
