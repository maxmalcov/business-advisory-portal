
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ServiceEditorActions } from './ServiceEditorActions';
import { ServiceFormState } from '../hooks/useServiceForm';

interface ServiceEditorFormProps {
  serviceForm: ServiceFormState;
  isEditMode: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
}

export const ServiceEditorForm: React.FC<ServiceEditorFormProps> = ({
  serviceForm,
  isEditMode,
  onSubmit,
  onCancel
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

  const {
    title, setTitle,
    description, setDescription,
    price, setPrice,
    iconName, setIconName,
    badges, setBadges,
    popular, setPopular,
    category, setCategory,
    status, setStatus
  } = serviceForm;

  // Add debugging for input changes
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Title input change triggered with value:', e.target.value);
    setTitle(e.target.value);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title*</Label>
          <Input 
            id="title" 
            value={title} 
            onChange={handleTitleChange}
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
          <ServiceFormField
            label="Price*"
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            required
          />
          
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
        
        <ServiceFormField
          label="Icon Name"
          id="iconName"
          value={iconName}
          onChange={(e) => setIconName(e.target.value)}
          placeholder="Package"
          description="Use icon names from Lucide React like: Package, CircleDollarSign, FileText, Users, etc."
        />
        
        <ServiceFormField
          label="Badges (comma separated)"
          id="badges"
          value={badges}
          onChange={(e) => setBadges(e.target.value)}
          placeholder="New, Premium, Limited"
        />
        
        <div className="flex items-center justify-between">
          <Label htmlFor="popular">Mark as Popular</Label>
          <Switch
            id="popular"
            checked={popular}
            onCheckedChange={setPopular}
          />
        </div>
        
        <ServiceToggle
          id="status"
          label="Status"
          checked={status === 'active'}
          onCheckedChange={(checked) => {
            const newStatus = checked ? 'active' : 'inactive';
            setStatus(newStatus);
          }}
          activeLabel="Active"
          inactiveLabel="Inactive"
        />
      </div>
      
      <ServiceEditorActions 
        isEditMode={isEditMode}
        onCancel={onCancel}
      />
    </form>
  );
};

interface ServiceFormFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  description?: string;
  required?: boolean;
  type?: string;
}

const ServiceFormField: React.FC<ServiceFormFieldProps> = ({
  label,
  id,
  value,
  onChange,
  placeholder,
  description,
  required = false,
  type = 'text'
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input 
        id={id} 
        type={type}
        value={value} 
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
    </div>
  );
};

interface ServiceToggleProps {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  activeLabel: string;
  inactiveLabel: string;
}

const ServiceToggle: React.FC<ServiceToggleProps> = ({
  id,
  label,
  checked,
  onCheckedChange,
  activeLabel,
  inactiveLabel
}) => {
  return (
    <div className="flex items-center justify-between">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center space-x-2">
        <Label htmlFor={`${id}-active`} className={checked ? 'text-green-600' : 'text-gray-500'}>
          {activeLabel}
        </Label>
        <Switch
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
        />
        <Label htmlFor={`${id}-inactive`} className={!checked ? 'text-red-600' : 'text-gray-500'}>
          {inactiveLabel}
        </Label>
      </div>
    </div>
  );
};
