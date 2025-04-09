
import React from 'react';
import { Employee } from '../../types/employee';
import { MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface CommentsCardProps {
  employee: Employee;
}

const CommentsCard: React.FC<CommentsCardProps> = ({ employee }) => {
  return (
    <Card className="overflow-hidden border border-border shadow-sm">
      <div className="bg-muted/30 px-6 py-3 border-b border-border">
        <h3 className="text-md font-medium flex items-center text-foreground">
          <MessageSquare className="h-4 w-4 mr-2 text-primary" />
          Comments
        </h3>
      </div>
      <CardContent className="pt-4 bg-card">
        {employee.comments ? (
          <div>
            <p className="text-sm whitespace-pre-line text-foreground">{employee.comments}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No comments available</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CommentsCard;
