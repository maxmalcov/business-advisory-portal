
import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { UsersRound, UserPlus, UserCheck, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface RegistrationData {
  date: string;
  count: number;
}

interface UserStatsProps {
  userStats: {
    total: number;
    active: number;
    recentlyAdded: number;
    thisMonth: number;
    registrationData?: RegistrationData[];
  };
}

const UserStats: React.FC<UserStatsProps> = ({ userStats }) => {
  const [date, setDate] = useState<Date | undefined>();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Total Registered Users
            </CardTitle>
            <UsersRound className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-green-600">
              Active Users
            </CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.active}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-blue-600">
              New Users (30 Days)
            </CardTitle>
            <UserPlus className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.recentlyAdded}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-purple-600">
              Registered This Month
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.thisMonth}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {format(new Date(), 'MMMM yyyy')}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Custom Date Range Picker */}
      <div className="flex items-center space-x-2 mb-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : <span>Pick a date to view registrations</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
        
        {date && (
          <div className="text-sm font-medium">
            Users registered on {format(date, 'PP')}: 
            <span className="ml-1 text-blue-600 font-semibold">
              {/* Display value for the selected date or 0 if not available */}
              {userStats.registrationData?.find(item => item.date === format(date, 'yyyy-MM-dd'))?.count || 0}
            </span>
          </div>
        )}
      </div>
      
      {/* Registration Growth Chart */}
      {userStats.registrationData && userStats.registrationData.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-sm font-medium">User Registration Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ChartContainer
                config={{
                  registrations: { label: "Registrations", color: "#4f46e5" },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userStats.registrationData}>
                    <XAxis 
                      dataKey="date" 
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => {
                        // Format date to be more readable (e.g., "Mar 15")
                        const date = new Date(value);
                        return format(date, 'MMM d');
                      }}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="registrations"
                      stroke="#4f46e5"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <ChartTooltipContent
                              className="w-[150px]"
                              label={format(new Date(data.date), 'MMM d, yyyy')}
                              payload={payload}
                            />
                          );
                        }
                        return null;
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserStats;
