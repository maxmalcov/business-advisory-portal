
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';  // Import useAuth to check user role
import { useServiceForm } from '../hooks/useServiceForm';
import { useServiceEditor } from '../hooks/useServiceEditor';
import { ServiceEditorHeader } from './ServiceEditorHeader';
import { ServiceEditorForm } from './ServiceEditorForm';
import {useLanguage} from "@/context/LanguageContext.tsx";

const ServiceEditor: React.FC = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const isEditMode = !!serviceId;
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth(); // Get auth state and user role
  
  // Debug auth state
  useEffect(() => {
    console.log('Auth state in ServiceEditor:', { 
      isAuthenticated, 
      userType: user?.userType, 
      user 
    });
  }, [isAuthenticated, user]);
  
  // Redirect if not admin
  useEffect(() => {
    if (isAuthenticated && user && user.userType !== 'admin') {
      console.log('User is not admin, redirecting');
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to manage services.',
        variant: 'destructive',
      });
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate, toast]);
  
  // Service form state
  const serviceForm = useServiceForm();
  
  // Get service data and submit handler
  const { 
    loading, 
    service, 
    saveService 
  } = useServiceEditor(serviceId, serviceForm.resetForm);

  // Set form data when service is loaded (for edit mode)
  useEffect(() => {
    if (service && isEditMode) {
      serviceForm.populateFormWithService(service);
    }
  }, [service, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formData = serviceForm.getFormData();
      console.log('Submitting form data:', formData);
      await saveService(formData);
      
      toast({
        title: `Service ${isEditMode ? 'updated' : 'created'} successfully`,
        description: `The service "${serviceForm.title}" has been ${isEditMode ? 'updated' : 'created'}.`,
      });
      
      navigate('/admin/service-catalog');
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        title: 'Error',
        description: `Failed to ${isEditMode ? 'update' : 'create'} service. Please try again.`,
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    navigate('/admin/service-catalog');
  };

  // Add debugging for form state
  useEffect(() => {
    console.log('ServiceEditor form state:', {
      title: serviceForm.title,
      description: serviceForm.description,
      price: serviceForm.price
    });
  }, [serviceForm.title, serviceForm.description, serviceForm.price]);

  if (loading && isEditMode) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const {t} = useLanguage()

  return (
    <div className="space-y-6">
      <ServiceEditorHeader 
        isEditMode={isEditMode} 
        onCancel={handleCancel} 
      />
      
      <Card>
        <CardHeader>
          <CardTitle>{t('services.details')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ServiceEditorForm
            serviceForm={serviceForm}
            isEditMode={isEditMode}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceEditor;
