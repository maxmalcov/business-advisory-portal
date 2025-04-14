
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Hash, Building2, Map, Globe, FileText } from 'lucide-react';
import type { User } from '../../hooks/types';

interface LocationInfoSectionProps {
  user: User;
  onUserChange: (user: User) => void;
  isReadOnly?: boolean;
}

const LocationInfoSection: React.FC<LocationInfoSectionProps> = ({ user, onUserChange, isReadOnly = false }) => {
  return (
    <div className="p-3 bg-gray-50 rounded-md">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Location Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <Label htmlFor="address" className="text-xs font-medium">Address</Label>
          </div>
          <Input 
            id="address"
            value={user.address || ''}
            onChange={(e) => onUserChange({...user, address: e.target.value})}
            className="h-9"
            readOnly={isReadOnly}
            disabled={isReadOnly}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <Label htmlFor="postal-code" className="text-xs font-medium">Postal Code</Label>
          </div>
          <Input 
            id="postal-code"
            value={user.postalCode || ''}
            onChange={(e) => onUserChange({...user, postalCode: e.target.value})}
            className="h-9"
            readOnly={isReadOnly}
            disabled={isReadOnly}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <Label htmlFor="city" className="text-xs font-medium">City</Label>
          </div>
          <Input 
            id="city"
            value={user.city || ''}
            onChange={(e) => onUserChange({...user, city: e.target.value})}
            className="h-9"
            readOnly={isReadOnly}
            disabled={isReadOnly}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Map className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <Label htmlFor="province" className="text-xs font-medium">Province/State</Label>
          </div>
          <Input 
            id="province"
            value={user.province || ''}
            onChange={(e) => onUserChange({...user, province: e.target.value})}
            className="h-9"
            readOnly={isReadOnly}
            disabled={isReadOnly}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <Label htmlFor="country" className="text-xs font-medium">Country</Label>
          </div>
          <Input 
            id="country"
            value={user.country || ''}
            onChange={(e) => onUserChange({...user, country: e.target.value})}
            className="h-9"
            readOnly={isReadOnly}
            disabled={isReadOnly}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <Label htmlFor="nif" className="text-xs font-medium">NIF/Tax ID</Label>
          </div>
          <Input 
            id="nif"
            value={user.nif || ''}
            onChange={(e) => onUserChange({...user, nif: e.target.value})}
            className="h-9"
            readOnly={isReadOnly}
            disabled={isReadOnly}
          />
        </div>
      </div>
    </div>
  );
};

export default LocationInfoSection;
