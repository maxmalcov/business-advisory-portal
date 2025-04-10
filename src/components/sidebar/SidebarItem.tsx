
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

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
    return (
      <Link
        to={item.path}
        className={cn(
          "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
          isItemActive(item) 
            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
            : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
          item.highlight && "text-sidebar-accent-foreground font-medium hover:text-sidebar-accent-foreground"
        )}
        onClick={isMobile ? onClose : undefined}
      >
        {item.highlight ? 
          <span className="mr-2 relative">
            <item.icon className="h-4 w-4 text-transparent animate-[pulse_1.5s_cubic-bezier(0.4,0,0.6,1)_infinite] scale-110" 
              style={{
                background: 'linear-gradient(90deg, #ff0000, #ffa500, #ffff00, #008000, #0000ff, #4b0082, #ee82ee)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                filter: 'drop-shadow(0 0 1px rgba(255,255,255,0.5))'
              }}
            /> 
          </span> : 
          <item.icon className="h-4 w-4 mr-2" />
        }
        <span className={cn(
          item.highlight && "animate-pulse relative",
          item.highlight && "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent font-semibold"
        )}>
          {item.name}
        </span>
      </Link>
    );
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
