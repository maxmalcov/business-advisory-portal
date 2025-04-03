
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
  
  // Colors that match the design in the image
  const COLORS = ['#9b87f5', '#7E69AB', '#78C6D0', '#33C3F0'];
  const STATUS_COLORS = ['#42B883', '#F59E0B', '#6B7280'];
  
  const chartConfig = {
    financial: { color: '#9b87f5' },
    tax: { color: '#7E69AB' },
    payroll: { color: '#78C6D0' },
    custom: { color: '#33C3F0' }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Monthly Reports Chart */}
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm text-muted-foreground">{t('reports.charts.monthly')}</CardTitle>
        </CardHeader>
        <CardContent className="h-[220px] pt-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: 0, bottom: 20 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis width={25} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#9b87f5" name="Reports" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Reports by Type Chart */}
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm text-muted-foreground">{t('reports.charts.by_type')}</CardTitle>
        </CardHeader>
        <CardContent className="h-[220px] pt-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
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
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {typesData.map((entry, index) => (
              <div key={`legend-${index}`} className="flex items-center gap-1 text-xs">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                />
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Reports by Status Chart */}
      <Card className="md:col-span-2">
        <CardHeader className="py-4">
          <CardTitle className="text-sm text-muted-foreground">{t('reports.charts.by_status')}</CardTitle>
        </CardHeader>
        <CardContent className="h-[180px] pt-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={statusData} 
              layout="horizontal"
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportCharts;
