
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface FilterInputProps {
  filterValue: string;
  setFilterValue: (value: string) => void;
  placeholder?: string;
}

const FilterInput: React.FC<FilterInputProps> = ({
  filterValue,
  setFilterValue,
  placeholder = 'Search records...'
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
        className="pl-8 max-w-xs"
      />
    </div>
  );
};

export default FilterInput;
