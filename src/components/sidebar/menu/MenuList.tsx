
import React from 'react';
import { MenuItem } from './types';
import { cn } from '@/lib/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface MenuListProps {
  items: MenuItem[];
  onClose: () => void;
}

const MenuList: React.FC<MenuListProps> = ({ items, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleClick = (item: MenuItem) => {
    navigate(item.path);
    if (isMobile && !item.children) {
      onClose();
    }
  };

  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item.path} className="relative">
          <button
            onClick={() => handleClick(item)}
            className={cn(
              "flex items-center w-full px-3 py-2 text-sm transition-colors rounded-md",
              location.pathname === item.path 
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
              item.highlight && "text-sidebar-accent-foreground font-medium hover:text-sidebar-accent-foreground"
            )}
          >
            {item.highlight ? (
              <item.icon className="w-4 h-4 mr-2 text-sidebar-accent-foreground animate-[pulse_1.5s_cubic-bezier(0.4,0,0.6,1)_infinite] scale-110" />
            ) : (
              <item.icon className="w-4 h-4 mr-2" />
            )}
            <span className={cn(item.highlight && "animate-pulse")}>{item.name}</span>
          </button>
          {item.children && (
            <ul className="pl-6 mt-1 space-y-1">
              {item.children.map((child) => (
                <li key={child.path}>
                  <button
                    onClick={() => handleClick(child)}
                    className={cn(
                      "flex items-center w-full px-3 py-2 text-sm transition-colors rounded-md",
                      location.pathname === child.path
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <child.icon className="w-4 h-4 mr-2" />
                    <span>{child.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};

export default MenuList;

