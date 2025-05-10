import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { NotificationBadge } from '../ui/notification-badge';
import { NotificationDot } from '../ui/notification-dot';
import { SidebarItem as SidebarItemType } from './types';

type SidebarItemProps = {
  item: SidebarItemType;
  isParentActive: (path: string) => boolean;
  isItemActive: (item: SidebarItemType) => boolean;
  isExpanded: boolean;
  toggleExpanded: (path: string, hasChildren: boolean) => void;
  onClick: (path: string, hasChildren: boolean) => void;
  onClose?: () => void;
};

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  isParentActive,
  isItemActive,
  isExpanded,
  onClick,
  onClose,
}) => {
  const hasChildren = item.children && item.children.length > 0;
  const isActive = isItemActive(item);

  const handleParentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick(item.path, hasChildren);
  };

  const handleChildClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <li key={item.path}>
      {!hasChildren ? (
        <Link
          to={item.path}
          className={cn(
            'flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors',
            isActive
              ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
              : 'hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
            item.highlight &&
              'text-sidebar-accent-foreground font-medium hover:text-sidebar-accent-foreground',
          )}
          onClick={handleChildClick}
        >
          <div className="flex items-center">
            {item.highlight ? (
              <item.icon className="h-4 w-4 mr-2 text-sidebar-accent-foreground animate-[pulse_1.5s_cubic-bezier(0.4,0,0.6,1)_infinite] scale-110" />
            ) : (
              <item.icon className="h-4 w-4 mr-2" />
            )}
            <span className={cn(item.highlight && 'animate-pulse')}>
              {item.name}
            </span>
          </div>
          {item.badge && (
            <NotificationBadge count={item.badge} className="ml-2" />
          )}
        </Link>
      ) : (
        <div className="mb-2">
          <div
            className={cn(
              'flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors cursor-pointer relative',
              isActive
                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                : 'hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
            )}
            onClick={handleParentClick}
          >
            <div className="flex items-center flex-1">
              <item.icon className="h-4 w-4 mr-2" />
              <span>{item.name}</span>
            </div>
            {item.badge ? (
              <NotificationBadge count={item.badge} className="mx-2" />
            ) : (
              item.hasPendingChildren && <NotificationDot />
            )}
            <span className="ml-1">
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  isExpanded ? 'rotate-0' : '-rotate-90',
                )}
              />
            </span>
          </div>

          <div
            className={cn(
              'overflow-hidden transition-all duration-200 ease-in-out',
              isExpanded ? 'max-h-96' : 'max-h-0',
            )}
          >
            <ul className="pl-6 mt-1 space-y-1">
              {item.children?.map((child) => (
                <li key={child.path}>
                  <Link
                    to={child.path}
                    className={cn(
                      'relative flex items-center px-3 py-2 rounded-md text-sm transition-colors',
                      location.pathname === child.path
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                        : 'hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
                    )}
                    onClick={handleChildClick}
                  >
                    <child.icon className="h-4 w-4 mr-2" />
                    <span>{child.name}</span>
                    {/*{child.badge && (*/}
                    {/*  <NotificationBadge count={child.badge} className="ml-2" />*/}
                    {/*)}*/}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
};

export default SidebarItem;
