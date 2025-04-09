
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff } from 'lucide-react';
import type { User } from '../../hooks/types';

interface CredentialsSectionProps {
  newUser: Omit<User, "id">;
  onUserChange: (user: Omit<User, "id">) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
}

const CredentialsSection: React.FC<CredentialsSectionProps> = ({ 
  newUser, 
  onUserChange, 
  confirmPassword, 
  setConfirmPassword 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    onUserChange({...newUser, password: newPassword});
    
    // Check if passwords match when both fields have values
    if (confirmPassword && newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmedPassword = e.target.value;
    setConfirmPassword(confirmedPassword);
    
    // Check if passwords match
    if (newUser.password && confirmedPassword && newUser.password !== confirmedPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-gray-500" />
          <Label htmlFor="password">Password *</Label>
        </div>
        <div className="relative">
          <Input 
            id="password"
            type={showPassword ? "text" : "password"}
            value={newUser.password || ''}
            onChange={handlePasswordChange}
          />
          <button 
            type="button"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-gray-500" />
          <Label htmlFor="confirm-password">Confirm Password *</Label>
        </div>
        <div className="relative">
          <Input 
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          <button 
            type="button"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {passwordError && (
          <p className="text-sm text-red-500 mt-1">{passwordError}</p>
        )}
      </div>
    </div>
  );
};

export default CredentialsSection;
