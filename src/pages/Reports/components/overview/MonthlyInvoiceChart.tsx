
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { subMonths, startOfYear, endOfYear, subYears } from 'date-fns';
import { DateRangePicker } from './DateRangePicker';
import { useToast } from '@/hooks/use-toast';

interface MonthlyInvoiceChartProps {
  monthlyData: {
    name: string;
    sales: number;
    supplier: number;
    date?: Date;
  }[];
  onDateRangeChange?: (startDate: Date, endDate: Date) => void;
}

const MonthlyInvoiceChart: React.FC<MonthlyInvoiceChartProps> = ({ 
  monthlyData,
  onDateRangeChange 
}) => {
  const { toast } = useToast();
  const [filteredData, setFilteredData] = useState(monthlyData);
  const [startDate, setStartDate] = useState<Date | undefined>(subMonths(new Date(), 5));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  
  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    if (date && endDate) {
      if (onDateRangeChange) {
        onDateRangeChange(date, endDate);
      }
    }
  };
  
  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    if (startDate && date) {
      if (onDateRangeChange) {
        onDateRangeChange(startDate, date);
      }
    }
  };
  
  const handleRangePresetChange = (preset: string) => {
    const now = new Date();
    let newStartDate: Date;
    let newEndDate: Date = now;
    
    switch (preset) {
      case 'last6months':
        newStartDate = subMonths(now, 5);
        break;
      case 'last12months':
        newStartDate = subMonths(now, 11);
        break;
      case 'thisYear':
        newStartDate = startOfYear(now);
        break;
      case 'lastYear':
        newStartDate = startOfYear(subYears(now, 1));
        newEndDate = endOfYear(subYears(now, 1));
        break;
      case 'custom':
        // Just keep the current dates for custom selection
        return;
      default:
        newStartDate = subMonths(now, 5);
    }
    
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    
    if (onDateRangeChange) {
      onDateRangeChange(newStartDate, newEndDate);
    }
    
    toast({
      title: "Date range updated",
      description: "Chart data has been filtered by the selected date range.",
    });
  };
  
  useEffect(() => {
    if (!startDate || !endDate) return;
    
    // Filter data based on date range if dates exist
    const filtered = monthlyData.filter(item => {
      if (!item.date) return true; // Include items without dates for backward compatibility
      return item.date >= startDate && item.date <= endDate;
    });
    
    setFilteredData(filtered.length > 0 ? filtered : monthlyData);
  }, [monthlyData, startDate, endDate]);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <CardTitle>Monthly Invoice Activity</CardTitle>
            <CardDescription>
              Number of invoices processed per month
            </CardDescription>
          </div>
          <div className="mt-4 sm:mt-0">
            <DateRangePicker 
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
              onRangePresetChange={handleRangePresetChange}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={filteredData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" name="Sales Invoices" fill="#8884d8" />
            <Bar dataKey="supplier" name="Supplier Invoices" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MonthlyInvoiceChart;
