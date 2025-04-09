
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UsefulLink } from '../types';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import * as Icons from 'lucide-react';

interface UsefulLinkCardProps {
  link: UsefulLink;
}

const UsefulLinkCard: React.FC<UsefulLinkCardProps> = ({ link }) => {
  const { t } = useLanguage();
  
  // Get the icon component dynamically if specified
  const IconComponent = link.icon ? Icons[link.icon as keyof typeof Icons] : undefined;
  
  return (
    <Card className="h-full flex flex-col transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          {IconComponent && <IconComponent className="h-5 w-5 text-primary" />}
          <CardTitle>{link.title}</CardTitle>
        </div>
        {link.description && (
          <CardDescription>{link.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground truncate">{link.url}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            <span>{t('useful_links.visit_website')}</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UsefulLinkCard;
