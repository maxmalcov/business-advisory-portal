import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { SubscriptionChartData } from '../../hooks/types/subscriptionTypes';

interface SubscriptionChartViewProps {
  data: SubscriptionChartData[];
  loading: boolean;
}

const SubscriptionChartView: React.FC<SubscriptionChartViewProps> = ({
  data,
  loading,
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="h-6 bg-muted rounded w-52 animate-pulse" />
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          <div className="h-72 flex items-center justify-center">
            <div className="text-muted-foreground">Loading chart data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Subscriptions per Month</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-8">
        <div className="h-full w-full">
          {data.length > 0 ? (
            <ChartContainer
              config={{
                subscriptions: {
                  label: 'Subscriptions',
                  color: '#3b82f6',
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={data}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 30,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  Month
                                </span>
                                <span className="font-bold text-muted-foreground">
                                  {payload[0].payload.month}
                                </span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  Subscriptions
                                </span>
                                <span className="font-bold text-accent-foreground">
                                  {payload[0].value}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="count"
                    name="subscriptions"
                    fill="var(--color-subscriptions, #3b82f6)"
                    radius={[4, 4, 0, 0]}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground text-center">
                No subscription data available for the selected period.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionChartView;
