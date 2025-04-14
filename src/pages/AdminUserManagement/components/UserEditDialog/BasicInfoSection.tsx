
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, File, Building } from 'lucide-react';
import type { User as UserType } from '../../hooks/types';

interface BasicInfoSectionProps {
  user: UserType;
  onUserChange: (user: UserType) => void;
  isReadOnly?: boolean;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ user, onUserChange, isReadOnly = false }) => {
  return (
    <div className="space-y-3 p-3 bg-gray-50 rounded-md">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <Label htmlFor="name" className="text-xs font-medium">Name</Label>
          </div>
          <Input 
            id="name"
            value={user.name}
            onChange={(e) => onUserChange({...user, name: e.target.value})}
            className="w-full h-9"
            readOnly={isReadOnly}
            disabled={isReadOnly}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <Label htmlFor="company" className="text-xs font-medium">Company Name</Label>
          </div>
          <Input 
            id="company"
            value={user.companyName || ''}
            onChange={(e) => onUserChange({...user, companyName: e.target.value})}
            className="w-full h-9"
            readOnly={isReadOnly}
            disabled={isReadOnly}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <File className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <Label htmlFor="email" className="text-xs font-medium">Email</Label>
          </div>
          <Input 
            id="email"
            value={user.email}
            onChange={(e) => onUserChange({...user, email: e.target.value})}
            className="w-full h-9"
            readOnly={isReadOnly}
            disabled={isReadOnly}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;
