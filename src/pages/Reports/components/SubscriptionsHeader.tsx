
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Plus, PackageCheck } from 'lucide-react';

type SubscriptionHeaderProps = {
  onAddNew: () => void;
  onAddNewType: () => void;
};

const SubscriptionHeader: React.FC<SubscriptionHeaderProps> = ({ onAddNew, onAddNewType }) => {
  const { language } = useLanguage();
  
  const getTexts = () => {
    if (language === 'es') {
      return {
        title: "Gestión de Suscripciones",
        description: "Administre y supervise todas las suscripciones y tipos de suscripción de la plataforma",
        addType: "Añadir Nuevo Tipo de Suscripción",
        assign: "Asignar una Nueva Suscripción"
      };
    } else {
      return {
        title: "Subscription Management",
        description: "Manage and oversee all platform subscriptions and subscription types",
        addType: "Add New Subscription Type",
        assign: "Assign a New Subscription"
      };
    }
  };
  
  const texts = getTexts();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <PackageCheck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{texts.title}</h1>
            <p className="text-muted-foreground mt-1">
              {texts.description}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onAddNewType}>
            <Plus className="h-4 w-4 mr-1" />
            {texts.addType}
          </Button>
          <Button onClick={onAddNew}>
            <Plus className="h-4 w-4 mr-1" />
            {texts.assign}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionHeader;
