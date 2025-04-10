
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DistributionChartsProps {
  invoicePieData: { name: string; value: number }[];
  employeePieData: { name: string; value: number }[];
  servicesPieData: { name: string; value: number }[];
  colors: string[];
}

const DistributionCharts: React.FC<DistributionChartsProps> = ({
  invoicePieData,
  employeePieData,
  servicesPieData,
  colors,
}) => {
  const renderPieChart = (data: { name: string; value: number }[]) => (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Invoice Distribution</CardTitle>
          <CardDescription>
            Sales vs. Supplier Invoices
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          {renderPieChart(invoicePieData)}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Employee Status</CardTitle>
          <CardDescription>
            Active vs. Terminated Employees
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          {renderPieChart(employeePieData)}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Service Requests</CardTitle>
          <CardDescription>
            Service request status
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          {renderPieChart(servicesPieData)}
        </CardContent>
      </Card>
    </div>
  );
};

export default DistributionCharts;
