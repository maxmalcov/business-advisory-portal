
import { useState } from 'react';
import { Service } from '@/integrations/supabase/client';
import { useServiceForm } from './useServiceForm';

export const useServiceDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const serviceForm = useServiceForm();

  const openAddDialog = () => {
    serviceForm.resetForm();
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const openEditDialog = (service: Service) => {
    serviceForm.populateFormWithService(service);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    isEditMode,
    openAddDialog,
    openEditDialog,
    serviceForm
  };
};
