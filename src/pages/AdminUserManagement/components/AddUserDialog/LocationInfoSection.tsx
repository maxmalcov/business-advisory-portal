
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Building, Globe } from 'lucide-react';
import type { User } from '../../hooks/types';

interface LocationInfoSectionProps {
  newUser: Omit<User, "id">;
  onUserChange: (user: Omit<User, "id">) => void;
}

const LocationInfoSection: React.FC<LocationInfoSectionProps> = ({ newUser, onUserChange }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <Label htmlFor="address">Address *</Label>
        </div>
        <Input 
          id="address"
          value={newUser.address || ''}
          onChange={(e) => onUserChange({...newUser, address: e.target.value})}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-gray-500" />
            <Label htmlFor="postal-code">Postal Code *</Label>
          </div>
          <Input 
            id="postal-code"
            value={newUser.postalCode || ''}
            onChange={(e) => onUserChange({...newUser, postalCode: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-gray-500" />
            <Label htmlFor="city">City *</Label>
          </div>
          <Input 
            id="city"
            value={newUser.city || ''}
            onChange={(e) => onUserChange({...newUser, city: e.target.value})}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-gray-500" />
            <Label htmlFor="province">Province *</Label>
          </div>
          <Input 
            id="province"
            value={newUser.province || ''}
            onChange={(e) => onUserChange({...newUser, province: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-gray-500" />
            <Label htmlFor="country">Country *</Label>
          </div>
          <Input 
            id="country"
            value={newUser.country || ''}
            onChange={(e) => onUserChange({...newUser, country: e.target.value})}
          />
        </div>
      </div>
    </div>
  );
};

export default LocationInfoSection;
