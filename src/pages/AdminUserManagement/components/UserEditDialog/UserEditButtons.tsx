import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, X } from 'lucide-react';

interface UserEditButtonsProps {
  isEditMode: boolean;
  onToggleEditMode: () => void;
}

const UserEditButtons: React.FC<UserEditButtonsProps> = ({
  isEditMode,
  onToggleEditMode,
}) => {
  return (
    <div className="flex items-center gap-2">
      {!isEditMode ? (
        <Button variant="outline" onClick={onToggleEditMode} size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      ) : (
        <Button variant="outline" onClick={onToggleEditMode} size="sm">
          <X className="h-4 w-4 mr-2" />
          Cancel Edit
        </Button>
      )}
    </div>
  );
};

export default UserEditButtons;
