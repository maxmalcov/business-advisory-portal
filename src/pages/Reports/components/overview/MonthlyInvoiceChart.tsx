
import React from 'react';
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

interface MonthlyInvoiceChartProps {
  monthlyData: {
    name: string;
    sales: number;
    supplier: number;
  }[];
}

const MonthlyInvoiceChart: React.FC<MonthlyInvoiceChartProps> = ({ monthlyData }) => {
  // Create default data if no data is provided or if it's empty
  const displayData = monthlyData && monthlyData.length > 0 
    ? monthlyData 
    : [
        { name: 'Jan', sales: 0, supplier: 0 },
        { name: 'Feb', sales: 0, supplier: 0 },
        { name: 'Mar', sales: 0, supplier: 0 },
        { name: 'Apr', sales: 0, supplier: 0 },
        { name: 'May', sales: 0, supplier: 0 },
        { name: 'Jun', sales: 0, supplier: 0 },
      ];

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Monthly Invoice Activity</CardTitle>
        <CardDescription>
          Number of invoices processed per month
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={displayData}
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
