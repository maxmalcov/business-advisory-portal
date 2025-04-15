
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { filterChartData, formatAxisDate } from './utils/chartUtils';
import ChartTypeToggle from './chart/ChartTypeToggle';
import DateRangePicker from './chart/DateRangePicker';
import TimeRangeSelector from './chart/TimeRangeSelector';
import RegistrationChart from './chart/RegistrationChart';

interface Registration {
  date: string;
  count: number;
}

interface UserRegistrationChartProps {
  registrationData: Registration[];
}

const UserRegistrationChart: React.FC<UserRegistrationChartProps> = ({ registrationData }) => {
  const [timeRange, setTimeRange] = useState('30d');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Filter data based on selected time range or custom date range
  const filteredData = filterChartData(registrationData, timeRange, dateRange);
  
  // Process data for display
  const processedData = filteredData.map(item => ({
    ...item,
    displayDate: formatAxisDate(item.date)
  }));

  // Handle time range change
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    // If changing from custom to predefined range, close the date picker if it's open
    if (value !== 'custom' && isDatePickerOpen) {
      setIsDatePickerOpen(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">
          User Registration Trends
        </CardTitle>
        <div className="flex space-x-2">
          {/* Chart type toggle */}
          <ChartTypeToggle chartType={chartType} setChartType={setChartType} />
          
          {/* Date range selector for custom range */}
          {timeRange === 'custom' ? (
            <DateRangePicker 
              dateRange={dateRange}
              setDateRange={setDateRange}
              isOpen={isDatePickerOpen}
              onOpenChange={setIsDatePickerOpen}
            />
          ) : null}
          
          {/* Always show time range selector */}
          <TimeRangeSelector 
            timeRange={timeRange} 
            onTimeRangeChange={handleTimeRangeChange} 
          />
        </div>
      </CardHeader>
      <CardContent>
        <RegistrationChart chartType={chartType} data={processedData} />
      </CardContent>
    </Card>
  );
};

export default UserRegistrationChart;
