import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { CHART_COLORS } from '../utils/chartUtils';
import ChartTooltip from './ChartTooltip';

interface RegistrationChartProps {
  chartType: 'line' | 'bar';
  data: Array<{ date: string; displayDate: string; count: number }>;
}

const RegistrationChart: React.FC<RegistrationChartProps> = ({
  chartType,
  data,
}) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        {chartType === 'line' ? (
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={CHART_COLORS.muted}
              vertical={false}
            />
            <XAxis
              dataKey="displayDate"
              stroke={CHART_COLORS.muted}
              tick={{
                fontSize: 12,
                fill: CHART_COLORS.text,
                fontWeight: 600,
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
                fontWeight: 600,
              }}
              width={30}
            />
            <Tooltip content={<ChartTooltip data={data} />} />
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
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={CHART_COLORS.muted}
              vertical={false}
            />
            <XAxis
              dataKey="displayDate"
              stroke={CHART_COLORS.muted}
              tick={{
                fontSize: 12,
                fill: CHART_COLORS.text,
                fontWeight: 600,
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
                fontWeight: 600,
              }}
              width={30}
            />
            <Tooltip content={<ChartTooltip data={data} />} />
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
  );
};

export default RegistrationChart;
