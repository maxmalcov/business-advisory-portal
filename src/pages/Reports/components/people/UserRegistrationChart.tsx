
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Calendar, CalendarDays, ChartBar, ChartLine } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useLanguage } from '@/context/LanguageContext';

interface Registration {
  date: string;
  count: number;
}

interface UserRegistrationChartProps {
  registrationData: Registration[];
}

const CHART_COLORS = {
  primary: 'hsl(var(--primary))',
  muted: 'hsl(var(--muted))',
  background: 'hsl(var(--background))'
};

const TimeRangeOptions = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
];

const UserRegistrationChart: React.FC<UserRegistrationChartProps> = ({ registrationData }) => {
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState('30d');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  // Filter data based on selected time range
  const filteredData = registrationData.slice(-parseInt(timeRange.replace('d', '')));

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">
          User Registration Trends
        </CardTitle>
        <div className="flex space-x-2">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setChartType('line')} 
              className={`p-1 rounded-md ${chartType === 'line' ? 'bg-muted' : ''}`}
            >
              <ChartLine className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setChartType('bar')} 
              className={`p-1 rounded-md ${chartType === 'bar' ? 'bg-muted' : ''}`}
            >
              <ChartBar className="h-4 w-4" />
            </button>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="h-8 w-[130px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              {TimeRangeOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer
            config={{
              item: {
                color: CHART_COLORS.primary,
              },
            }}
          >
            {chartType === 'line' ? (
              <LineChart data={filteredData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.muted} vertical={false} />
                <XAxis dataKey="date" stroke={CHART_COLORS.muted} />
                <YAxis stroke={CHART_COLORS.muted} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke={CHART_COLORS.primary} 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Users"
                />
              </LineChart>
            ) : (
              <BarChart data={filteredData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.muted} vertical={false} />
                <XAxis dataKey="date" stroke={CHART_COLORS.muted} />
                <YAxis stroke={CHART_COLORS.muted} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="count" 
                  fill={CHART_COLORS.primary} 
                  name="Users" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-2 rounded shadow-sm">
        <p className="text-sm font-medium">{`Date: ${label}`}</p>
        <p className="text-sm text-primary">{`Registrations: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default UserRegistrationChart;
