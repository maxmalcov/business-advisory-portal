
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

interface RecentAdditionsProps {
  recentlyAdded: number;
}

const RecentAdditions: React.FC<RecentAdditionsProps> = ({ recentlyAdded }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Additions</CardTitle>
        <CardDescription>
          Employees added in the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4">
          <div className="text-5xl font-bold">{recentlyAdded}</div>
          <p className="text-sm text-muted-foreground mt-2">New employees</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="outline">Manage Employees</Button>
      </CardFooter>
    </Card>
  );
};

export default RecentAdditions;
