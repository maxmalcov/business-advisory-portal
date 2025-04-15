import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, ChartBar, ChartLine } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar 
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

interface Registration {
  date: string;
  count: number;
}

interface UserRegistrationChartProps {
  registrationData: Registration[];
}

// Chart color constants
const CHART_COLORS = {
  primary: '#9b87f5',
  muted: '#8E9196',
  background: '#fff',
  text: '#222222'
};

// Time range options
const TIME_RANGES = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'custom', label: 'Custom range' },
];

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

  // Filter data based on selected time range or custom date range
  const getFilteredData = () => {
    if (timeRange === 'custom' && dateRange.from && dateRange.to) {
      return registrationData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= dateRange.from! && itemDate <= dateRange.to!;
      });
    } else {
      const days = parseInt(timeRange.replace('d', ''));
      return registrationData.slice(-days);
    }
  };

  const filteredData = getFilteredData();
  
  // Process data for display
  const processedData = filteredData.map(item => ({
    ...item,
    displayDate: new Date(item.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }));

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
  };

  // Format the date range for display
  const formatDateRange = () => {
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d, yyyy')}`;
    }
    return "Select dates";
  };

  // Custom tooltip component that shows count and date
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const registrationItem = processedData.find(
        item => item.count === payload[0].value
      );
      
      return (
        <div className="bg-white border border-gray-200 shadow-md p-2 rounded-md">
          <p className="font-semibold text-sm">{`Registrations: ${payload[0].value}`}</p>
          {registrationItem && registrationItem.date && (
            <p className="text-xs text-gray-500 mt-1">
              {new Date(registrationItem.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">
          User Registration Trends
        </CardTitle>
        <div className="flex space-x-2">
          {/* Chart type toggle */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setChartType('line')} 
              className={`p-1 rounded-md transition-colors ${chartType === 'line' ? 'bg-muted' : ''}`}
            >
              <ChartLine className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setChartType('bar')} 
              className={`p-1 rounded-md transition-colors ${chartType === 'bar' ? 'bg-muted' : ''}`}
            >
              <ChartBar className="h-4 w-4" />
            </button>
          </div>
          
          {/* Date range selector */}
          {timeRange === 'custom' ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="h-8 px-2 flex items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="max-w-[120px] truncate">{formatDateRange()}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <div className="p-3 space-y-3">
                  <div className="grid gap-2">
                    <div className="grid gap-1">
                      <label className="text-sm font-medium">From</label>
                      <input 
                        type="date" 
                        className="h-8 w-full rounded-md border border-input px-3 py-1 text-sm"
                        value={dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : ''}
                        onChange={(e) => {
                          const date = e.target.value ? new Date(e.target.value) : undefined;
                          setDateRange(prev => ({ ...prev, from: date }));
                        }}
                      />
                    </div>
                    <div className="grid gap-1">
                      <label className="text-sm font-medium">To</label>
                      <input 
                        type="date" 
                        className="h-8 w-full rounded-md border border-input px-3 py-1 text-sm"
                        value={dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : ''}
                        onChange={(e) => {
                          const date = e.target.value ? new Date(e.target.value) : undefined;
                          setDateRange(prev => ({ ...prev, to: date }));
                        }}
                      />
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      // Close the popover manually
                      document.body.click();
                    }}
                  >
                    Apply
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <Select value={timeRange} onValueChange={handleTimeRangeChange}>
              <SelectTrigger className="h-8 w-[130px]">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                {TIME_RANGES.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart 
                data={processedData} 
                margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.muted} vertical={false} />
                <XAxis 
                  dataKey="displayDate" 
                  stroke={CHART_COLORS.muted}
                  tick={{ 
                    fontSize: 12, 
                    fill: CHART_COLORS.text, 
                    fontWeight: 600 
                  }}
                  tickLine={false}
                  minTickGap={15}
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis 
                  stroke={CHART_COLORS.muted}
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ 
                    fontSize: 12, 
                    fill: CHART_COLORS.text, 
                    fontWeight: 600 
                  }}
                  width={30}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={CHART_COLORS.primary}
                  strokeWidth={2}
                  dot={{ r: 3, fill: CHART_COLORS.primary }}
                  activeDot={{ r: 5 }}
                  name="Users"
                  animationDuration={500}
                />
              </LineChart>
            ) : (
              <BarChart 
                data={processedData} 
                margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.muted} vertical={false} />
                <XAxis 
                  dataKey="displayDate" 
                  stroke={CHART_COLORS.muted}
                  tick={{ 
                    fontSize: 12, 
                    fill: CHART_COLORS.text, 
                    fontWeight: 600 
                  }}
                  tickLine={false}
                  minTickGap={15}
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis 
                  stroke={CHART_COLORS.muted}
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ 
                    fontSize: 12, 
                    fill: CHART_COLORS.text, 
                    fontWeight: 600 
                  }}
                  width={30}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="count"
                  fill={CHART_COLORS.primary}
                  name="Users"
                  radius={[4, 4, 0, 0]}
                  animationDuration={500}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserRegistrationChart;
