import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ServiceItem, ServiceStatus } from '../types';
import {
  logsTable,
  notificationSettingsTable,
  serviceRequestsTable,
  supabase,
} from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext.tsx';
import { sendEmail } from '@/integrations/email';
import { log } from '@/utils/logs/log.funciton.ts';

export const useServiceRequests = (
  user: any,
  services: ServiceItem[],
  setServices: React.Dispatch<React.SetStateAction<ServiceItem[]>>,
) => {
  const { toast } = useToast();
  const [userRequests, setUserRequests] = useState<{
    [key: string]: ServiceStatus;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { t } = useLanguage();

  useEffect(() => {
    const loadUserServiceRequests = async () => {
      if (!user) return;

      try {
        const { data, error } = await serviceRequestsTable()
          .select('service_id, status')
          .eq('client_id', user.id);

        if (error) {
          console.error('Error loading service requests:', error);
          return;
        }

        const requestsMap: { [key: string]: ServiceStatus } = {};
        data.forEach((request) => {
          requestsMap[request.service_id] = request.status as ServiceStatus;
        });

        setUserRequests(requestsMap);

        setServices((prevServices) =>
          prevServices.map((service) => ({
            ...service,
            status: requestsMap[service.id] || 'available',
          })),
        );
      } catch (error) {
        console.error('Error fetching service requests:', error);
      }
    };

    loadUserServiceRequests();
  }, [user, setServices]);

  const handleRequestService = async (serviceId: string) => {
    if (!user) {
      toast({
        title: t('service.request.auth-require.title'),
        description: t('service.request.auth-require.description'),
        variant: 'destructive',
      });
      return;
    }

    const service = services.find((s) => s.id === serviceId);
    if (!service) return;

    setIsSubmitting(true);

    const { data, error } = await notificationSettingsTable()
      .select('email')
      .eq('category', 'services')
      .maybeSingle();

    if (error) {
      throw new Error(`Get notification settings error: ${error}`);
    }

    await sendEmail(
      (data as any).email,
      `New Service Request: ${service.title}`,
      `A client has submitted a new service request.

Client Name: ${user.name}
Service Requested: ${service.title}

You can manage this request in the admin dashboard.`,
    );

    log({
      action: 'Service request',
      description: `New service request ${service.title} from ${user.name}`,
      category: 'service',
      user: user.email,
      level: 'info',
    });

    try {
      console.log(`Requesting service ${serviceId} for user ${user.id}`);

      const { data, error } = await serviceRequestsTable()
        .insert({
          service_id: serviceId,
          service_name: service.title,
          client_id: user.id,
          client_name: user.name || user.email,
          status: 'pending',
        })
        .select();

      if (error) {
        console.error('Ошибка при вставке запроса сервиса:', error);
        throw error;
      }

      setServices((prevServices) =>
        prevServices.map((service) =>
          service.id === serviceId
            ? { ...service, status: 'pending' as ServiceStatus }
            : service,
        ),
      );

      toast({
        title: t('service.request.success.title'),
        description: t('service.request.success.description'),
      });
    } catch (error) {
      console.error('Error during creating service process:', error);
      toast({
        title: t('service.request.auth-failed.title'),
        description: t('service.request.auth-failed.description'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { userRequests, isSubmitting, handleRequestService };
};
