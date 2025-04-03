
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ChartContainer,
  ChartTooltip, 
  ChartTooltipContent,
} from '@/components/ui/chart';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip,
  Legend
} from 'recharts';
import { ChartData } from '../types';
import { useLanguage } from '@/context/LanguageContext';

interface ReportChartsProps {
  typesData: ChartData[];
  monthlyData: ChartData[];
  statusData: ChartData[];
}

const ReportCharts: React.FC<ReportChartsProps> = ({ typesData, monthlyData, statusData }) => {
  const { t } = useLanguage();
  const COLORS = ['#9b87f5', '#7E69AB', '#1EAEDB', '#33C3F0'];
  const STATUS_COLORS = ['#10B981', '#F59E0B', '#6B7280'];
  
  const chartConfig = {
    financial: { theme: { light: '#9b87f5', dark: '#7E69AB' } },
    tax: { theme: { light: '#1EAEDB', dark: '#1EAEDB' } },
    payroll: { theme: { light: '#33C3F0', dark: '#33C3F0' } },
    custom: { theme: { light: '#aaadb0', dark: '#8E9196' } }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Monthly Reports Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t('reports.charts.monthly')}</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="#9b87f5" name="Reports" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      
      {/* Reports by Type Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t('reports.charts.by_type')}</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {typesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent labelKey="name" />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      
      {/* Reports by Status Chart */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>{t('reports.charts.by_status')}</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value">
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportCharts;
