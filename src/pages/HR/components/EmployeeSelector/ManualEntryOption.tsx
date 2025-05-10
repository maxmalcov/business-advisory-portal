import React from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ManualEntryOptionProps } from './types';

const ManualEntryOption: React.FC<ManualEntryOptionProps> = ({
  onAddManually,
}) => {
  return (
    <div className="border-t p-2">
      <Button
        variant="ghost"
        className="w-full justify-start"
        onClick={onAddManually}
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Add Manually
      </Button>
    </div>
  );
};

export default ManualEntryOption;
