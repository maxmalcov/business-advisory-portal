import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

const ActivityChart: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Monthly Activity</h2>
      <Card>
        <CardHeader>
          <CardTitle>Activity Overview</CardTitle>
          <CardDescription>
            Client activity for the past 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] bg-muted rounded-md flex items-center justify-center">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">
                Chart visualization would appear here
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityChart;
