
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronDown } from 'lucide-react';

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
  isExpanded: boolean;
  toggleExpanded: (item: any) => void;
  onClose?: () => void;
};

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  item, 
  isParentActive, 
  isItemActive, 
  isExpanded,
  toggleExpanded,
  onClose 
}) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const hasChildren = item.children && item.children.length > 0;
  const isActive = isItemActive(item);
  const childIsActive = hasChildren && item.children.some(child => location.pathname === child.path);

  const handleParentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleExpanded(item);
  };

  const handleChildClick = () => {
    if (isMobile) {
      onClose?.();
    }
  };

  return (
    <li key={item.path}>
      <button
        onClick={handleParentClick}
        className={cn(
          "flex w-full items-center justify-between px-3 py-2 rounded-md text-sm transition-colors",
          (isActive || childIsActive) 
            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
            : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
          item.highlight && "text-sidebar-accent-foreground font-medium hover:text-sidebar-accent-foreground"
        )}
      >
        <div className="flex items-center">
          {item.highlight ? 
            <item.icon className="h-4 w-4 mr-2 text-sidebar-accent-foreground animate-[pulse_1.5s_cubic-bezier(0.4,0,0.6,1)_infinite] scale-110" /> : 
            <item.icon className="h-4 w-4 mr-2" />
          }
          <span className={cn(item.highlight && "animate-pulse")}>{item.name}</span>
        </div>
        {hasChildren && (
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isExpanded && "transform rotate-180"
            )}
          />
        )}
      </button>
      
      {hasChildren && isExpanded && (
        <ul className={cn(
          "pl-6 mt-1 space-y-1 overflow-hidden transition-all duration-200 ease-in-out",
          "animate-accordion-down"
        )}>
          {item.children.map((child) => (
            <li key={child.path}>
              <Link
                to={child.path}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                  location.pathname === child.path
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
                onClick={handleChildClick}
              >
                <child.icon className="h-4 w-4 mr-2" />
                <span>{child.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default SidebarItem;
