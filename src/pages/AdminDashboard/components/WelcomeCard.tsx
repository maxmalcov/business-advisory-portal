
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

const WelcomeCard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <Card className="border-l-4 border-l-ba-blue">
      <CardHeader>
        <CardTitle className="text-2xl">{t('admin.dashboard')}</CardTitle>
        <CardDescription>
          Welcome back, {user?.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Monitor your business activity and manage client accounts from this central dashboard.</p>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
