
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import {
  Users,
  Upload,
  Mail,
  AlertTriangle,
} from 'lucide-react';
import { ChartDataItem, WeeklyDataItem } from '../types';

interface LogsStatisticsProps {
  chartData: ChartDataItem[];
  weeklyData: WeeklyDataItem[];
}

const LogsStatistics: React.FC<LogsStatisticsProps> = ({ chartData, weeklyData }) => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activity by Category</CardTitle>
            <CardDescription>Total events per category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Events" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Events distribution over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="users" name="User Events" fill="#8884d8" />
                  <Bar dataKey="files" name="File Events" fill="#82ca9d" />
                  <Bar dataKey="emails" name="Email Events" fill="#ffc658" />
                  <Bar dataKey="security" name="Security Events" fill="#ff8042" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>System Activity Summary</CardTitle>
          <CardDescription>Key statistics about system activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <Users className="mx-auto mb-2 h-8 w-8 text-blue-600" />
              <div className="text-2xl font-bold text-blue-700">42</div>
              <div className="text-sm text-blue-600">User Events</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <Upload className="mx-auto mb-2 h-8 w-8 text-green-600" />
              <div className="text-2xl font-bold text-green-700">65</div>
              <div className="text-sm text-green-600">File Uploads</div>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg text-center">
              <Mail className="mx-auto mb-2 h-8 w-8 text-amber-600" />
              <div className="text-2xl font-bold text-amber-700">120</div>
              <div className="text-sm text-amber-600">Emails Sent</div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-red-600" />
              <div className="text-2xl font-bold text-red-700">15</div>
              <div className="text-sm text-red-600">Security Events</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default LogsStatistics;
