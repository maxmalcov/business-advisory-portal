
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ServiceCard from './Services/components/ServiceCard';
import ServiceSearch from './Services/components/ServiceSearch';
import { ServiceItem, ServiceStatus } from './Services/types';
import { initialServices } from './Services/mockData';
import { 
  CircleDollarSign, 
  FileText, 
  Users, 
  Package, 
  PackagePlus, 
  Boxes 
} from 'lucide-react';

const Services: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'CircleDollarSign':
        return <CircleDollarSign className="h-5 w-5 text-primary" />;
      case 'FileText':
        return <FileText className="h-5 w-5 text-primary" />;
      case 'Users':
        return <Users className="h-5 w-5 text-primary" />;
      case 'Package':
        return <Package className="h-5 w-5 text-primary" />;
      case 'PackagePlus':
        return <PackagePlus className="h-5 w-5 text-primary" />;
      case 'Boxes':
        return <Boxes className="h-5 w-5 text-primary" />;
      default:
        return <Package className="h-5 w-5 text-primary" />;
    }
  };
  
  const handleRequestService = (serviceId: string) => {
    // Update the service status to pending
    setServices(prevServices => 
      prevServices.map(service => 
        service.id === serviceId 
          ? { ...service, status: 'pending' as ServiceStatus } 
          : service
      )
    );
    
    // Send email notification to admin (in a real app, this would be an API call)
    toast({
      title: "Service Requested",
      description: `Your request for service has been submitted. The admin has been notified.`,
    });
    
    console.log(`Service ${serviceId} requested. Email notification sent to admin.`);
  };

  const filteredServices = services.filter(service => 
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{t('nav.additional_services')}</h1>
        <p className="text-muted-foreground">Explore our premium services designed to help your business thrive.</p>
      </div>
      
      {/* Search bar */}
      <ServiceSearch value={searchQuery} onChange={setSearchQuery} />

      {/* Services grid */}
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
            onRequestService={handleRequestService}
          />
        ))}
      </div>
    </div>
  );
};

export default Services;
