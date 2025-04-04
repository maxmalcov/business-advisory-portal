
import React from 'react';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import NewEmployeeForm from './NewEmployeeForm';
import { TooltipProvider } from '@/components/ui/tooltip';

const NewEmployee: React.FC = () => {
  const { t } = useLanguage();

  return (
    <TooltipProvider>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{t('hr.new_employee.title')}</h1>
        
        <Card>
          <NewEmployeeForm />
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default NewEmployee;
