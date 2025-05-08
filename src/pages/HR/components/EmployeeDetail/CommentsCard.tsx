
import React from 'react';
import { Employee } from '../../types/employee';
import { MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {useLanguage} from "@/context/LanguageContext.tsx";

interface CommentsCardProps {
  employee: Employee;
}

const CommentsCard: React.FC<CommentsCardProps> = ({ employee }) => {
  const {t} = useLanguage()
    console.log(employee.comments)
  return (
    <Card className="overflow-hidden border border-border shadow-sm">
      <div className="bg-muted/30 px-6 py-3 border-b border-border">
        <h3 className="text-md font-medium flex items-center text-foreground">
          <MessageSquare className="h-4 w-4 mr-2 text-primary" />
            {t('hr.index.employee.comments')}
        </h3>
      </div>
      <CardContent className="pt-4 bg-card">
        {employee.comments ? (
          <div>
            <p className="text-sm whitespace-pre-line text-foreground">{employee.comments}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">{t('hr.index.employee.comments.not-found')}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CommentsCard;
