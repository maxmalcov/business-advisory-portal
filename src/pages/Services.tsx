
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Package, 
  PackagePlus, 
  FileText, 
  Users, 
  FileCheck, 
  Clock, 
  CircleDollarSign, 
  Boxes,
  Search 
} from 'lucide-react';

type ServiceStatus = 'available' | 'pending' | 'completed' | 'rejected';

type ServiceCardProps = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  price: string;
  badges?: string[];
  popular?: boolean;
  status?: ServiceStatus;
  onRequestService: (serviceId: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  id,
  title, 
  description, 
  icon, 
  price, 
  badges = [],
  popular = false,
  status = 'available',
  onRequestService
}) => {
  const getStatusColor = (status: ServiceStatus) => {
    switch(status) {
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return '';
    }
  };

  const getStatusText = (status: ServiceStatus) => {
    switch(status) {
      case 'pending': return 'Pending';
      case 'completed': return 'Completed';
      case 'rejected': return 'Rejected';
      default: return 'Request Service';
    }
  };

  return (
    <Card className={`h-full flex flex-col ${popular ? 'border-primary shadow-md' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-muted rounded-lg">
              {icon}
            </div>
            <CardTitle>{title}</CardTitle>
          </div>
          <div className="flex gap-2">
            {popular && <Badge className="bg-primary">Popular</Badge>}
            {status !== 'available' && (
              <Badge className={getStatusColor(status)}>
                {getStatusText(status)}
              </Badge>
            )}
          </div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          {badges.map((badge, index) => (
            <div key={index} className="flex items-center space-x-2">
              <FileCheck className="h-4 w-4 text-primary" />
              <span className="text-sm">{badge}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 pt-2 border-t">
        <div className="w-full flex justify-between items-center">
          <div className="text-lg font-semibold">
            {price}
          </div>
          <Button 
            variant={popular ? "default" : "outline"}
            disabled={status !== 'available'} 
            onClick={() => status === 'available' && onRequestService(id)}
          >
            {getStatusText(status)}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const Services: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState<Array<ServiceCardProps & { status: ServiceStatus }>>([
    {
      id: "service1",
      title: "Payroll Management",
      description: "Complete payroll processing and management services for your business.",
      icon: <CircleDollarSign className="h-5 w-5 text-primary" />,
      price: "From €150/month",
      badges: [
        "Monthly payroll processing",
        "Tax calculations & filings",
        "Direct deposit setup",
        "Year-end reporting"
      ],
      popular: true,
      status: 'available'
    },
    {
      id: "service2",
      title: "Tax Advisory",
      description: "Professional tax planning and advisory services to minimize your tax burden.",
      icon: <FileText className="h-5 w-5 text-primary" />,
      price: "From €200/month",
      badges: [
        "Tax return preparation",
        "Tax planning strategies",
        "Audit support",
        "VAT compliance"
      ],
      status: 'available'
    },
    {
      id: "service3",
      title: "HR Management",
      description: "Comprehensive human resources services for employee management.",
      icon: <Users className="h-5 w-5 text-primary" />,
      price: "From €180/month",
      badges: [
        "Employee onboarding",
        "Benefits administration",
        "HR policy development",
        "Performance management"
      ],
      status: 'pending'
    },
    {
      id: "service4",
      title: "Bookkeeping Plus",
      description: "Enhanced bookkeeping services with detailed financial reporting.",
      icon: <Package className="h-5 w-5 text-primary" />,
      price: "From €120/month",
      badges: [
        "Daily transaction recording",
        "Monthly financial reports",
        "Accounts reconciliation",
        "Cash flow management"
      ],
      status: 'available'
    },
    {
      id: "service5",
      title: "Financial Analysis",
      description: "In-depth analysis of your financial data to support business decisions.",
      icon: <PackagePlus className="h-5 w-5 text-primary" />,
      price: "From €250/month",
      badges: [
        "Profitability analysis",
        "Investment evaluation",
        "Budget preparation",
        "Financial forecasting"
      ],
      status: 'completed'
    },
    {
      id: "service6",
      title: "Accounting Software Setup",
      description: "Setup and training for accounting software tailored to your business needs.",
      icon: <Boxes className="h-5 w-5 text-primary" />,
      price: "From €300 one-time",
      badges: [
        "Software selection guidance",
        "System configuration",
        "Data migration",
        "Staff training"
      ],
      status: 'rejected'
    }
  ]);
  
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
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search services..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Services grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service, index) => (
          <ServiceCard 
            key={index}
            id={service.id}
            title={service.title}
            description={service.description}
            icon={service.icon}
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
