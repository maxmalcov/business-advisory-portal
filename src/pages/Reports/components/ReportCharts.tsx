
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
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{t('reports.charts.monthly')}</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] pt-4">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis width={30} tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="#9b87f5" name="Reports" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      
      {/* Reports by Type Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{t('reports.charts.by_type')}</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] pt-4">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <Pie
                  data={typesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {typesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      
      {/* Reports by Status Chart */}
      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{t('reports.charts.by_status')}</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px] pt-4">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={statusData} 
                layout="vertical" 
                margin={{ top: 10, right: 30, left: 70, bottom: 10 }}
              >
                <XAxis type="number" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fontSize: 12 }} 
                  width={70} 
                />
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
