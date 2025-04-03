
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Profile: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">{t('nav.profile')}</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('profile.title')}</CardTitle>
          <CardDescription>{t('profile.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              <div className="font-medium">{t('profile.name')}</div>
              <div>{user?.name}</div>
            </div>
            <div className="grid gap-2">
              <div className="font-medium">{t('profile.email')}</div>
              <div>{user?.email}</div>
            </div>
            <div className="grid gap-2">
              <div className="font-medium">{t('profile.role')}</div>
              <div>{user?.userType}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
