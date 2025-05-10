import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TIME_RANGES } from '../utils/chartUtils';

interface TimeRangeSelectorProps {
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  timeRange,
  onTimeRangeChange,
}) => {
  return (
    <Select value={timeRange} onValueChange={onTimeRangeChange}>
      <SelectTrigger className="h-8 w-[130px]">
        <SelectValue placeholder="Select range" />
      </SelectTrigger>
      <SelectContent>
        {TIME_RANGES.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TimeRangeSelector;
