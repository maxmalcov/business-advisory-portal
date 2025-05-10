import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  onToggleStatus,
}) => {
  const { t } = useLanguage();
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  // Log the user data to verify we're receiving correct information
  useEffect(() => {
    console.log('UserEditDialog received user data:', user);
  }, [user]);

  const handleToggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  const handleSave = () => {
    onSave();
    setIsEditMode(false);
  };

  return (
    <div className="flex flex-col h-full max-h-[85vh] overflow-hidden">
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="absolute right-2 top-2 hover:bg-muted z-10"
        >
          <X className="h-4 w-4" />
        </Button>

        <UserEditHeader user={user} isEditMode={isEditMode} />
      </div>

      <div className="flex-1 overflow-hidden">
        <UserEditTabs
          user={user}
          onUserChange={onUserChange}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      <UserEditFooter
        user={user}
        isEditMode={isEditMode}
        onToggleEditMode={handleToggleEditMode}
        onSave={handleSave}
        onCancel={onCancel}
        onDelete={onDelete}
        onToggleStatus={onToggleStatus}
      />
    </div>
  );
};

export default UserEditDialog;
