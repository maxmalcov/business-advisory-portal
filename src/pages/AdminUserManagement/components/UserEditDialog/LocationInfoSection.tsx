
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
  React.useEffect(() => {
    console.log("LocationInfoSection received user data:", {
      address: user.address,
      postalCode: user.postalCode,
      city: user.city,
      province: user.province,
      country: user.country
    });
  }, [user]);

  return (
    <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-gray-500 flex-shrink-0" />
          <Label htmlFor="address" className="font-medium">Address</Label>
        </div>
        <Input 
          id="address"
          value={user.address || ''}
          onChange={(e) => onUserChange({...user, address: e.target.value})}
          className="flex-grow"
          readOnly={isReadOnly}
          disabled={isReadOnly}
        />
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Hash className="h-5 w-5 text-gray-500 flex-shrink-0" />
          <Label htmlFor="postal-code" className="font-medium">Postal Code</Label>
        </div>
        <Input 
          id="postal-code"
          value={user.postalCode || ''}
          onChange={(e) => onUserChange({...user, postalCode: e.target.value})}
          className="w-full"
          readOnly={isReadOnly}
          disabled={isReadOnly}
        />
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-gray-500 flex-shrink-0" />
          <Label htmlFor="city" className="font-medium">City</Label>
        </div>
        <Input 
          id="city"
          value={user.city || ''}
          onChange={(e) => onUserChange({...user, city: e.target.value})}
          className="w-full"
          readOnly={isReadOnly}
          disabled={isReadOnly}
        />
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Map className="h-5 w-5 text-gray-500 flex-shrink-0" />
          <Label htmlFor="province" className="font-medium">Province/State</Label>
        </div>
        <Input 
          id="province"
          value={user.province || ''}
          onChange={(e) => onUserChange({...user, province: e.target.value})}
          className="w-full"
          readOnly={isReadOnly}
          disabled={isReadOnly}
        />
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-gray-500 flex-shrink-0" />
          <Label htmlFor="country" className="font-medium">Country</Label>
        </div>
        <Input 
          id="country"
          value={user.country || ''}
          onChange={(e) => onUserChange({...user, country: e.target.value})}
          className="w-full"
          readOnly={isReadOnly}
          disabled={isReadOnly}
        />
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-gray-500 flex-shrink-0" />
          <Label htmlFor="nif" className="font-medium">NIF/Tax ID</Label>
        </div>
        <Input 
          id="nif"
          value={user.nif || ''}
          onChange={(e) => onUserChange({...user, nif: e.target.value})}
          className="w-full"
          readOnly={isReadOnly}
          disabled={isReadOnly}
        />
      </div>
    </div>
  );
};

export default LocationInfoSection;
