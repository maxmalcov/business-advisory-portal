
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ServiceRequest, serviceRequestsTable } from '@/integrations/supabase/client';

export const useServiceRequestData = () => {
  const { toast } = useToast();
  const [adminEmail, setAdminEmail] = useState('admin@example.com');
  const [adminNotes, setAdminNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

  const handleSaveEmail = async () => {
    toast({
      title: "Email Updated",
      description: "Admin notification email has been updated.",
    });
  };

  const handleDelete = async (requestId: string) => {
    try {
      const { error } = await serviceRequestsTable()
        .delete()
        .eq('id', requestId);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Service Request Deleted",
        description: "The service request has been deleted successfully.",
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting service request:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete the service request. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    adminEmail,
    setAdminEmail,
    adminNotes,
    setAdminNotes,
    error,
    setError,
    isDialogOpen,
    setIsDialogOpen,
    selectedRequest,
    setSelectedRequest,
    handleSaveEmail,
    handleDelete
  };
};
