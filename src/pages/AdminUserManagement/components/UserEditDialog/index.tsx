
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import UserEditHeader from './UserEditHeader';
import UserEditTabs from './UserEditTabs';
import UserEditFooter from './UserEditFooter';
import type { User } from '../../hooks/types';

interface UserEditDialogProps {
  user: User;
  onUserChange: (user: User) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (user: User) => void;
  onToggleStatus: (user: User) => void;
}

const UserEditDialog: React.FC<UserEditDialogProps> = ({ 
  user, 
  onUserChange, 
  onSave, 
  onCancel,
  onDelete,
  onToggleStatus
}) => {
  const { t } = useLanguage();
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  // Log the user data to verify we're receiving correct information
  useEffect(() => {
    console.log("UserEditDialog received user data:", user);
  }, [user]);

  const handleToggleEditMode = () => {
    setIsEditMode(prev => !prev);
  };

  const handleSave = () => {
    onSave();
    setIsEditMode(false);
  };

  return (
    <>
      <UserEditHeader 
        user={user}
        isEditMode={isEditMode}
      />
      
      <UserEditTabs
        user={user}
        onUserChange={onUserChange}
        isEditMode={isEditMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      <UserEditFooter
        user={user}
        isEditMode={isEditMode}
        onToggleEditMode={handleToggleEditMode}
        onSave={handleSave}
        onCancel={onCancel}
        onDelete={onDelete}
        onToggleStatus={onToggleStatus}
      />
    </>
  );
};

export default UserEditDialog;
