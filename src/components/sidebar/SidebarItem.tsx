
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import SidebarButton from './SidebarButton';
import SidebarSubmenu from './SidebarSubmenu';

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
      <SidebarButton
        name={item.name}
        icon={item.icon}
        highlight={item.highlight}
        isActive={isActive || childIsActive}
        hasChildren={hasChildren}
        isExpanded={isExpanded}
        onClick={handleParentClick}
      />
      
      {hasChildren && (
        <SidebarSubmenu
          children={item.children}
          isExpanded={isExpanded}
          onChildClick={handleChildClick}
          currentPath={location.pathname}
        />
      )}
    </li>
  );
};

export default SidebarItem;
