
import React from 'react';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import NewEmployeeForm from './NewEmployeeForm';
import { TooltipProvider } from '@/components/ui/tooltip';
import { UserPlus } from 'lucide-react';

const NewEmployee: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center space-x-4 pb-4 border-b">
        <div className="bg-primary/10 p-3 rounded-full">
          <UserPlus className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('hr.new_employee.title')}</h1>
          <p className="text-muted-foreground mt-1">
            Fill in the form below to register a new employee
          </p>
        </div>
      </div>

      {/* Form Section */}
      <TooltipProvider>
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-sm">
            <NewEmployeeForm />
          </Card>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default NewEmployee;
