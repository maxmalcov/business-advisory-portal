
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
import { UserCheck } from 'lucide-react';

interface RecentAdditionsProps {
  recentlyAdded: number;
}

const RecentAdditions: React.FC<RecentAdditionsProps> = ({ recentlyAdded }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserCheck className="mr-2 h-5 w-5 text-blue-600" />
          Active New Users
        </CardTitle>
        <CardDescription>
          Active users from recent registrations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4">
          <div className="text-5xl font-bold text-blue-600">
            {Math.round(recentlyAdded * 0.8)}
          </div>
          <p className="text-sm text-muted-foreground mt-2">Active users (~80% activation rate)</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="outline">View Activity Report</Button>
      </CardFooter>
    </Card>
  );
};

export default RecentAdditions;
