
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import {useLanguage} from "@/context/LanguageContext.tsx";

interface ServiceEditorHeaderProps {
  isEditMode: boolean;
  onCancel: () => void;
}

export const ServiceEditorHeader: React.FC<ServiceEditorHeaderProps> = ({ 
  isEditMode, 
  onCancel 
}) => {
    const {t} = useLanguage()

  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" size="icon" onClick={onCancel}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <h1 className="text-2xl font-bold tracking-tight">
        {isEditMode ? t('services.edit-service') : t('services.create-service')}
      </h1>
    </div>
  );
};
