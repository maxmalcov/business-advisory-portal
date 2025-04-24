
import React from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { formatMonthYear } from '@/utils/dates';
import { isAfter, startOfMonth } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useMonthlySubmissions } from './MonthlySubmissionsContext';

interface ActionSectionProps {
  isSubmitted: boolean;
  workHours: any[];
  selectedMonth: Date;
  loading: boolean;
  onSubmitMonth: () => void;
}

const ActionSection: React.FC<ActionSectionProps> = ({
  isSubmitted,
  workHours,
  selectedMonth,
  loading,
  onSubmitMonth,
}) => {
  const { handleAddEmployee } = useMonthlySubmissions();
  const { toast } = useToast();

  const handleSubmitMonth = async () => {
    const today = new Date();
    if (isAfter(startOfMonth(selectedMonth), startOfMonth(today))) {
      toast({
        title: "Future month not allowed",
        description: "You cannot submit data for future months.",
        variant: "destructive"
      });
      return;
    }
    
    onSubmitMonth();
  };

  return (
    <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-between">
      {!isSubmitted && (
        <Button onClick={() => handleAddEmployee()} disabled={loading}>
          Add Employee
        </Button>
      )}
      
      {!isSubmitted && workHours.length > 0 && (
        <Button onClick={handleSubmitMonth} className="sm:ml-auto" disabled={loading}>
          <Send className="mr-2 h-4 w-4" />
          Submit {formatMonthYear(selectedMonth)}
        </Button>
      )}
    </div>
  );
};

export default ActionSection;
