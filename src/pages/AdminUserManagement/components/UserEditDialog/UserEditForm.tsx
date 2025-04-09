
import React from 'react';
import BasicInfoSection from './BasicInfoSection';
import ContactInfoSection from './ContactInfoSection';
import IframeUrlsSection from './IframeUrlsSection';
import LocationInfoSection from './LocationInfoSection';
import type { User } from '../../hooks/types';

interface UserEditFormProps {
  user: User;
  onUserChange: (user: User) => void;
}

const UserEditForm: React.FC<UserEditFormProps> = ({ user, onUserChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
      <BasicInfoSection user={user} onUserChange={onUserChange} />
      <ContactInfoSection user={user} onUserChange={onUserChange} />
      <LocationInfoSection user={user} onUserChange={onUserChange} />
      <div className="col-span-1 md:col-span-2">
        <IframeUrlsSection 
          user={user} 
          onUserChange={onUserChange} 
        />
      </div>
    </div>
  );
};

export default UserEditForm;
