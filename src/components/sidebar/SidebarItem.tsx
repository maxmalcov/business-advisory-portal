
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SidebarItemProps = {
  item: {
    name: string;
    path: string;
    icon: React.ElementType;
    highlight?: boolean;
    tooltip?: string;
    children?: Array<{
      name: string;
      path: string;
      icon: React.ElementType;
    }>;
  };
  isParentActive: (path: string) => boolean;
  isItemActive: (item: any) => boolean;
  onClose?: () => void;
};

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  item, 
  isParentActive, 
  isItemActive, 
  onClose 
}) => {
  const location = useLocation();
  const isMobile = useIsMobile();

  const renderLink = () => {
    const link = (
      <Link
        to={item.path}
        className={cn(
          "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
          isItemActive(item) 
            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
            : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
          item.highlight && "bg-gradient-to-br from-[#5A8BB0] to-[#3A6B9E] text-white shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 animate-fade-in"
        )}
        onClick={isMobile ? onClose : undefined}
      >
        {item.highlight ? 
          <item.icon className="h-4 w-4 mr-2 animate-pulse" /> : 
          <item.icon className="h-4 w-4 mr-2" />
        }
        <span>{item.name}</span>
      </Link>
    );

    if (item.tooltip && !isMobile) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {link}
            </TooltipTrigger>
            <TooltipContent>
              <p>{item.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return link;
  };

  return (
    <li key={item.path}>
      {!item.children ? (
        renderLink()
      ) : (
        <div className="mb-2">
          <Link
            to={item.path}
            className={cn(
              "flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors",
              isParentActive(item.path) 
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            )}
            onClick={isMobile ? onClose : undefined}
          >
            <div className="flex items-center">
              <item.icon className="h-4 w-4 mr-2" />
              <span>{item.name}</span>
            </div>
          </Link>
          
          {isParentActive(item.path) && (
            <ul className="pl-6 mt-1 space-y-1">
              {item.children?.map((child) => (
                <li key={child.path}>
                  <Link
                    to={child.path}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                      location.pathname === child.path
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    )}
                    onClick={isMobile ? onClose : undefined}
                  >
                    <child.icon className="h-4 w-4 mr-2" />
                    <span>{child.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </li>
  );
};

export default SidebarItem;
