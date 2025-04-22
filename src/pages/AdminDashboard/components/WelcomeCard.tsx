
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Card, 
  CardContent, 
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
      </CardHeader>
    </Card>
  );
};

export default WelcomeCard;
