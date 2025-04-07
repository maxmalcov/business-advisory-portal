
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
  handleSubmit
}) => {
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
  );
};

export default ServiceForm;
