
import React from 'react';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const LoadingState: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center justify-center p-12">
      <div className="text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading your report data...</p>
      </div>
    </div>
  );
};

export default LoadingState;
