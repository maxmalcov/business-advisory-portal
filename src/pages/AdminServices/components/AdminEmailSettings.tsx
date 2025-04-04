
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AdminEmailSettingsProps {
  adminEmail: string;
  setAdminEmail: (email: string) => void;
  handleSaveEmail: () => void;
}

const AdminEmailSettings: React.FC<AdminEmailSettingsProps> = ({
  adminEmail,
  setAdminEmail,
  handleSaveEmail
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Configure where service request notifications are sent</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="admin-email">Admin Notification Email</Label>
          <div className="flex gap-2">
            <Input 
              id="admin-email"
              type="email" 
              value={adminEmail} 
              onChange={(e) => setAdminEmail(e.target.value)} 
              className="flex-grow"
            />
            <Button onClick={handleSaveEmail}>Save</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminEmailSettings;
