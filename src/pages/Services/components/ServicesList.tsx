import React from 'react';
import { ServiceItem } from '../types';
import ServiceCard from './ServiceCard';
import { getIconComponent } from '../utils/iconUtils';
import { useLanguage } from '@/context/LanguageContext.tsx';

interface ServicesListProps {
  services: ServiceItem[];
  onRequestService: (serviceId: string) => void;
  searchQuery: string;
}

export const ServicesList = ({
  services,
  onRequestService,
  searchQuery,
}: ServicesListProps) => {
  const filteredServices = services.filter(
    (service) =>
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (filteredServices.length === 0) {
    const { t } = useLanguage();

    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          {t('services.no-available')}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredServices.map((service) => (
        <ServiceCard
          key={service.id}
          id={service.id}
          title={service.title}
          description={service.description}
          icon={getIconComponent(service.iconName)}
          price={service.price}
          badges={service.badges}
          popular={service.popular}
          status={service.status}
          onRequestService={onRequestService}
        />
      ))}
    </div>
  );
};
