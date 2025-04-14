
import React from 'react';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import type { User } from '../../hooks/types';

interface UserEditFooterProps {
  user: User;
  isEditMode: boolean;
  onSave: () => void;
  onCancel: () => void;
}

const UserEditFooter: React.FC<UserEditFooterProps> = ({
  isEditMode,
  onSave,
  onCancel
}) => {
  return (
    <DialogFooter className="px-6 py-3 border-t bg-muted/20">
      <div className="flex items-center justify-end w-full gap-2">
        <DialogClose asChild>
          <Button variant="outline" onClick={onCancel} size="sm">Close</Button>
        </DialogClose>
        {isEditMode && (
          <Button onClick={onSave} size="sm">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        )}
      </div>
    </DialogFooter>
  );
};

export default UserEditFooter;
