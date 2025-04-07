
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface ServiceEditorActionsProps {
  isEditMode: boolean;
  onCancel: () => void;
}

export const ServiceEditorActions: React.FC<ServiceEditorActionsProps> = ({ 
  isEditMode, 
  onCancel 
}) => {
  return (
    <div className="flex gap-2 justify-end">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit">
        <Save className="h-4 w-4 mr-2" />
        {isEditMode ? 'Update' : 'Create'} Service
      </Button>
    </div>
  );
};
