
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Service } from '@/integrations/supabase/client';

interface ServiceFormProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  isEditMode: boolean;
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  price: string;
  setPrice: (price: string) => void;
  iconName: string;
  setIconName: (iconName: string) => void;
  badges: string;
  setBadges: (badges: string) => void;
  popular: boolean;
  setPopular: (popular: boolean) => void;
  category: string;
  setCategory: (category: string) => void;
  status: 'active' | 'inactive';
  setStatus: (status: 'active' | 'inactive') => void;
  handleSubmit: () => Promise<void>;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  isEditMode,
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
  handleSubmit
}) => {
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

  return (
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
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>{isEditMode ? 'Update' : 'Add'} Service</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceForm;
