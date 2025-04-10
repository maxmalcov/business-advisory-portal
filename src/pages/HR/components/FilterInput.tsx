
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, Briefcase, UserCheck, Calendar, User, Building, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type IconType = 'search' | 'briefcase' | 'userCheck' | 'calendar' | 'user' | 'building';
type InputType = 'text' | 'select';

interface SelectOption {
  value: string;
  label: string;
}

interface FilterInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  iconType?: IconType;
  as?: InputType;
  selectOptions?: SelectOption[];
  onClear?: () => void;
}

export const FilterInput: React.FC<FilterInputProps> = ({
  value,
  onChange,
  placeholder = 'Search records...',
  className = '',
  iconType = 'search',
  as = 'text',
  selectOptions = [],
  onClear
}) => {
  const getIcon = () => {
    switch (iconType) {
      case 'search': return <Search className="h-4 w-4 text-muted-foreground" />;
      case 'briefcase': return <Briefcase className="h-4 w-4 text-muted-foreground" />;
      case 'userCheck': return <UserCheck className="h-4 w-4 text-muted-foreground" />;
      case 'calendar': return <Calendar className="h-4 w-4 text-muted-foreground" />;
      case 'user': return <User className="h-4 w-4 text-muted-foreground" />;
      case 'building': return <Building className="h-4 w-4 text-muted-foreground" />;
      default: return <Search className="h-4 w-4 text-muted-foreground" />;
    }
  };

  if (as === 'select') {
    return (
      <div className={`relative ${className}`}>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="pl-8">
            <div className="absolute left-2.5 top-2.5">
              {getIcon()}
            </div>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {selectOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-2.5 top-2.5">
        {getIcon()}
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8"
      />
      {value && onClear && (
        <button 
          onClick={onClear}
          className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
          aria-label="Clear input"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default FilterInput;
