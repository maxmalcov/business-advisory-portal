
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronDown, ChevronRight } from 'lucide-react';

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
  toggleExpanded: (path: string, hasChildren: boolean) => void;
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
    if (hasChildren) {
      e.preventDefault();
      toggleExpanded(item.path, hasChildren);
    } else {
      // If this is a leaf item, we want to close the sidebar on mobile and collapse other items
      toggleExpanded(item.path, false);
      if (isMobile) {
        onClose?.();
      }
    }
  };

  const handleChildClick = () => {
    if (isMobile) {
      onClose?.();
    }
    // We don't collapse anything when clicking a child item
  };

  return (
    <li key={item.path}>
      {!hasChildren ? (
        <Link
          to={item.path}
          className={cn(
            "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
            isActive 
              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
              : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
            item.highlight && "text-sidebar-accent-foreground font-medium hover:text-sidebar-accent-foreground"
          )}
          onClick={handleParentClick}
        >
          {item.highlight ? 
            <item.icon className="h-4 w-4 mr-2 text-sidebar-accent-foreground animate-[pulse_1.5s_cubic-bezier(0.4,0,0.6,1)_infinite] scale-110" /> : 
            <item.icon className="h-4 w-4 mr-2" />
          }
          <span className={cn(item.highlight && "animate-pulse")}>{item.name}</span>
        </Link>
      ) : (
        <div className="mb-2">
          <div
            className={cn(
              "flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors cursor-pointer",
              (isActive || childIsActive)
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            )}
            onClick={handleParentClick}
          >
            <div className="flex items-center">
              <item.icon className="h-4 w-4 mr-2" />
              <span>{item.name}</span>
            </div>
            <span className="ml-auto">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </span>
          </div>
          
          {isExpanded && (
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
                    onClick={handleChildClick}
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
