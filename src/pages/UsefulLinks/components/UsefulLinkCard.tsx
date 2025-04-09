
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UsefulLink } from '../types';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import * as Icons from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface UsefulLinkCardProps {
  link: UsefulLink;
}

const UsefulLinkCard: React.FC<UsefulLinkCardProps> = ({ link }) => {
  const { t } = useLanguage();
  
  // Get the icon component dynamically if specified
  let IconComponent = null;
  if (link.icon && typeof link.icon === 'string' && link.icon in Icons) {
    IconComponent = Icons[link.icon as keyof typeof Icons];
  }
  
  return (
    <Card className="h-full flex flex-col transition-all hover:shadow-md hover:-translate-y-1 duration-300">
      <CardHeader>
        <div className="flex items-center gap-2">
          {IconComponent && <IconComponent className="h-5 w-5 text-primary" />}
          <CardTitle className="text-xl">{link.title}</CardTitle>
        </div>
        {link.description && (
          <CardDescription className="line-clamp-2">{link.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-sm text-muted-foreground truncate">{link.url}</p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{link.url}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardContent>
      <CardFooter>
        <Button asChild variant="default" className="w-full group bg-blue-500 hover:bg-blue-600">
          <a 
            href={link.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center justify-center gap-2"
          >
            <span>Open link</span>
            <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UsefulLinkCard;
