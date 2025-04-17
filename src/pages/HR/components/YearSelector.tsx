
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface YearSelectorProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  yearsToShow?: number;
}

const YearSelector: React.FC<YearSelectorProps> = ({ 
  selectedYear, 
  onYearChange, 
  yearsToShow = 5 
}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: yearsToShow }, 
    (_, i) => currentYear - i
  );

  return (
    <div className="mb-4">
      <Select
        value={selectedYear.toString()}
        onValueChange={(value) => onYearChange(parseInt(value))}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default YearSelector;
