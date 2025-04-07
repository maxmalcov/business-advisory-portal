
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ServiceFormState } from '../hooks/useServiceForm';

interface ServiceEditorFormProps {
  serviceForm: ServiceFormState;
  isEditMode: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const ServiceEditorForm: React.FC<ServiceEditorFormProps> = ({
  serviceForm,
  isEditMode,
  onSubmit,
  onCancel
}) => {
  // Debugging the form inputs and state updates
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, setter: (value: string) => void) => {
    console.log('Input change:', e.target.name, e.target.value);
    setter(e.target.value);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Service Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="Enter service title"
          value={serviceForm.title}
          onChange={(e) => handleInputChange(e, serviceForm.setTitle)}
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Enter service description"
          value={serviceForm.description}
          onChange={(e) => handleInputChange(e, serviceForm.setDescription)}
          required
          rows={4}
        />
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          name="price"
          type="number"
          placeholder="Enter price"
          value={serviceForm.price}
          onChange={(e) => handleInputChange(e, serviceForm.setPrice)}
          required
        />
      </div>

      {/* Icon */}
      <div className="space-y-2">
        <Label htmlFor="iconName">Icon</Label>
        <Select 
          value={serviceForm.iconName} 
          onValueChange={serviceForm.setIconName}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an icon" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Package">Package</SelectItem>
            <SelectItem value="FileText">Document</SelectItem>
            <SelectItem value="Briefcase">Briefcase</SelectItem>
            <SelectItem value="Users">Users</SelectItem>
            <SelectItem value="CreditCard">Payment</SelectItem>
            <SelectItem value="Calendar">Calendar</SelectItem>
            <SelectItem value="Shield">Security</SelectItem>
            <SelectItem value="Star">Premium</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Badges */}
      <div className="space-y-2">
        <Label htmlFor="badges">Badges (comma separated)</Label>
        <Input
          id="badges"
          name="badges"
          placeholder="New, Popular, Premium"
          value={serviceForm.badges}
          onChange={(e) => handleInputChange(e, serviceForm.setBadges)}
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          name="category"
          placeholder="Enter category"
          value={serviceForm.category}
          onChange={(e) => handleInputChange(e, serviceForm.setCategory)}
        />
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select 
          value={serviceForm.status} 
          onValueChange={(value) => serviceForm.setStatus(value as 'active' | 'inactive')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Popular */}
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="popular"
          checked={serviceForm.popular}
          onCheckedChange={serviceForm.setPopular}
        />
        <Label htmlFor="popular">Mark as popular</Label>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditMode ? 'Update Service' : 'Create Service'}
        </Button>
      </div>
    </form>
  );
};
