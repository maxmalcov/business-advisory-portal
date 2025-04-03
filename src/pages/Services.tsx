
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
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
import { Package, PackagePlus, FileText, Users, FileCheck, Clock, CircleDollarSign, Boxes } from 'lucide-react';

type ServiceCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  price: string;
  badges?: string[];
  popular?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  title, 
  description, 
  icon, 
  price, 
  badges = [],
  popular = false
}) => (
  <Card className={`h-full flex flex-col ${popular ? 'border-primary shadow-md' : ''}`}>
    <CardHeader>
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-muted rounded-lg">
            {icon}
          </div>
          <CardTitle>{title}</CardTitle>
        </div>
        {popular && <Badge className="bg-primary">Popular</Badge>}
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
        <Button variant={popular ? "default" : "outline"}>
          Learn More
        </Button>
      </div>
    </CardFooter>
  </Card>
);

const Services: React.FC = () => {
  const { t } = useLanguage();
  
  const services: ServiceCardProps[] = [
    {
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
      popular: true
    },
    {
      title: "Tax Advisory",
      description: "Professional tax planning and advisory services to minimize your tax burden.",
      icon: <FileText className="h-5 w-5 text-primary" />,
      price: "From €200/month",
      badges: [
        "Tax return preparation",
        "Tax planning strategies",
        "Audit support",
        "VAT compliance"
      ]
    },
    {
      title: "HR Management",
      description: "Comprehensive human resources services for employee management.",
      icon: <Users className="h-5 w-5 text-primary" />,
      price: "From €180/month",
      badges: [
        "Employee onboarding",
        "Benefits administration",
        "HR policy development",
        "Performance management"
      ]
    },
    {
      title: "Bookkeeping Plus",
      description: "Enhanced bookkeeping services with detailed financial reporting.",
      icon: <Package className="h-5 w-5 text-primary" />,
      price: "From €120/month",
      badges: [
        "Daily transaction recording",
        "Monthly financial reports",
        "Accounts reconciliation",
        "Cash flow management"
      ]
    },
    {
      title: "Financial Analysis",
      description: "In-depth analysis of your financial data to support business decisions.",
      icon: <PackagePlus className="h-5 w-5 text-primary" />,
      price: "From €250/month",
      badges: [
        "Profitability analysis",
        "Investment evaluation",
        "Budget preparation",
        "Financial forecasting"
      ]
    },
    {
      title: "Accounting Software Setup",
      description: "Setup and training for accounting software tailored to your business needs.",
      icon: <Boxes className="h-5 w-5 text-primary" />,
      price: "From €300 one-time",
      badges: [
        "Software selection guidance",
        "System configuration",
        "Data migration",
        "Staff training"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{t('nav.additional_services')}</h1>
        <p className="text-muted-foreground">Explore our premium services designed to help your business thrive.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <ServiceCard 
            key={index}
            title={service.title}
            description={service.description}
            icon={service.icon}
            price={service.price}
            badges={service.badges}
            popular={service.popular}
          />
        ))}
      </div>
    </div>
  );
};

export default Services;
