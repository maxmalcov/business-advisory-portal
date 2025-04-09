
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Building, GlobeIcon } from 'lucide-react';
import type { User } from '../../hooks/types';

interface LocationInfoSectionProps {
  user: User;
  onUserChange: (user: User) => void;
}

const LocationInfoSection: React.FC<LocationInfoSectionProps> = ({ user, onUserChange }) => {
  // Log the user data to verify we're receiving correct information for this section
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
    <>
      <div className="space-y-3">
        <Label htmlFor="address" className="font-medium">Address</Label>
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-gray-500 flex-shrink-0" />
          <Input 
            id="address"
            value={user.address || ''}
            onChange={(e) => onUserChange({...user, address: e.target.value})}
            className="flex-grow"
            placeholder="Enter street address"
          />
        </div>
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="postal-code" className="font-medium">Postal Code</Label>
        <div className="flex items-center gap-3">
          <Building className="h-5 w-5 text-gray-500 flex-shrink-0" />
          <Input 
            id="postal-code"
            value={user.postalCode || ''}
            onChange={(e) => onUserChange({...user, postalCode: e.target.value})}
            className="flex-grow"
            placeholder="Enter postal code"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="city" className="font-medium">City</Label>
        <Input 
          id="city"
          value={user.city || ''}
          onChange={(e) => onUserChange({...user, city: e.target.value})}
          className="w-full"
          placeholder="Enter city"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="province" className="font-medium">Province/State</Label>
        <Input 
          id="province"
          value={user.province || ''}
          onChange={(e) => onUserChange({...user, province: e.target.value})}
          className="w-full"
          placeholder="Enter province or state"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="country" className="font-medium">Country</Label>
        <div className="flex items-center gap-3">
          <GlobeIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
          <Input 
            id="country"
            value={user.country || ''}
            onChange={(e) => onUserChange({...user, country: e.target.value})}
            className="flex-grow"
            placeholder="Enter country"
          />
        </div>
      </div>
    </>
  );
};

export default LocationInfoSection;
