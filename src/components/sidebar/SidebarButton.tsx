
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type SidebarButtonProps = {
  name: string;
  icon: React.ElementType;
  highlight?: boolean;
  isActive: boolean;
  hasChildren: boolean;
  isExpanded: boolean;
  onClick: (e: React.MouseEvent) => void;
};

const SidebarButton: React.FC<SidebarButtonProps> = ({
  name,
  icon: Icon,
  highlight,
  isActive,
  hasChildren,
  isExpanded,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex w-full items-center justify-between px-3 py-2 rounded-md text-sm transition-colors",
      isActive 
        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
        : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
      highlight && "text-sidebar-accent-foreground font-medium hover:text-sidebar-accent-foreground"
    )}
  >
    <div className="flex items-center">
      {highlight ? 
        <Icon className="h-4 w-4 mr-2 text-sidebar-accent-foreground animate-[pulse_1.5s_cubic-bezier(0.4,0,0.6,1)_infinite] scale-110" /> : 
        <Icon className="h-4 w-4 mr-2" />
      }
      <span className={cn(highlight && "animate-pulse")}>{name}</span>
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
);

export default SidebarButton;
