
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ServiceEditorHeaderProps {
  isEditMode: boolean;
  onCancel: () => void;
}

export const ServiceEditorHeader: React.FC<ServiceEditorHeaderProps> = ({ 
  isEditMode, 
  onCancel 
}) => {
  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" size="icon" onClick={onCancel}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <h1 className="text-2xl font-bold tracking-tight">
        {isEditMode ? 'Edit Service' : 'Create New Service'}
      </h1>
    </div>
  );
};
