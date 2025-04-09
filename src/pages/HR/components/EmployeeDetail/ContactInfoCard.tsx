
import React from 'react';
import { Employee } from '../../types/employee';
import { Home } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ContactInfoCardProps {
  employee: Employee;
}

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({ employee }) => {
  const hasContactInfo = employee.address || employee.email;
  
  return (
    <Card className="overflow-hidden border border-border shadow-sm">
      <div className="bg-muted/30 px-6 py-3 border-b border-border">
        <h3 className="text-md font-medium flex items-center text-foreground">
          <Home className="h-4 w-4 mr-2 text-primary" />
          Contact Information
        </h3>
      </div>
      <CardContent className="pt-4 bg-card">
        {hasContactInfo ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {employee.address && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p className="text-sm font-semibold text-foreground whitespace-pre-line">{employee.address}</p>
              </div>
            )}
            
            {employee.email && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-sm font-semibold text-foreground">{employee.email}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No contact information available</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactInfoCard;
