import { useServiceData } from './useServiceData';
import { useServiceDialog } from './useServiceDialog';
import { useServiceSubmit } from './useServiceSubmit';

export const useServiceManagement = () => {
  const { services, setServices, loading, setLoading, handleDelete } =
    useServiceData();
  const {
    isDialogOpen,
    setIsDialogOpen,
    isEditMode,
    openAddDialog,
    openEditDialog,
    serviceForm,
  } = useServiceDialog();
  const { handleSubmit: submitService } = useServiceSubmit(
    setLoading,
    setServices,
    setIsDialogOpen,
    serviceForm.resetForm,
  );

  const handleSubmit = async () => {
    const formData = serviceForm.getFormData();
    await submitService(isEditMode, serviceForm.currentService, formData);
  };

  return {
    // Service data
    services,
    loading,

    // Dialog state
    isDialogOpen,
    setIsDialogOpen,
    isEditMode,

    // Form state
    ...serviceForm,

    // Actions
    openAddDialog,
    openEditDialog,
    handleSubmit,
    handleDelete,
  };
};
