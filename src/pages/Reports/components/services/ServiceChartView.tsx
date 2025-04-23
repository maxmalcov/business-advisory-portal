
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { ServiceChartData } from '../../hooks/types/serviceTypes';

interface ServiceChartViewProps {
  data: ServiceChartData[];
  loading: boolean;
}

const ServiceChartView: React.FC<ServiceChartViewProps> = ({ data, loading }) => {
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
    <Card className="border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Service Requests per Month</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <div className="h-72">
          {data.length > 0 ? (
            <ChartContainer 
              config={{
                serviceRequests: {
                  label: "Service Requests",
                  color: "#9b87f5"
                }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart 
                  data={data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <ChartTooltip content={({ active, payload }) => {
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
                                Requests
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
                  }} />
                  <Bar
                    dataKey="count"
                    name="serviceRequests"
                    fill="var(--color-serviceRequests, #9b87f5)"
                    radius={[4, 4, 0, 0]}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground text-center">No service request data available for the selected period.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceChartView;
