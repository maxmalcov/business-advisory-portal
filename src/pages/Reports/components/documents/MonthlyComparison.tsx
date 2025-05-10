import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MonthlyComparisonProps {
  thisMonth: number;
  lastMonth: number;
}

const MonthlyComparison: React.FC<MonthlyComparisonProps> = ({
  thisMonth,
  lastMonth,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Comparison</CardTitle>
        <CardDescription>Current month vs previous month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">
              This Month
            </p>
            <h3 className="text-3xl font-bold mt-2">{thisMonth}</h3>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">
              Last Month
            </p>
            <h3 className="text-3xl font-bold mt-2">{lastMonth}</h3>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="outline">View All Documents</Button>
      </CardFooter>
    </Card>
  );
};

export default MonthlyComparison;
