
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { User } from '../../hooks/types';

interface CredentialsSectionProps {
  newUser: Omit<User, "id">;
  onUserChange: (user: Omit<User, "id">) => void;
}

const CredentialsSection: React.FC<CredentialsSectionProps> = ({ newUser, onUserChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="password">Password</Label>
      <Input 
        id="password"
        type="password"
        value={newUser.password || ''}
        onChange={(e) => onUserChange({...newUser, password: e.target.value})}
        placeholder="Leave blank for auto-generated password"
      />
    </div>
  );
};

export default CredentialsSection;
