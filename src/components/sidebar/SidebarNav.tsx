
import React from 'react';
import { useLocation } from 'react-router-dom';
import SidebarItem from './SidebarItem';
import { SidebarItem as SidebarItemType } from './types';

type SidebarNavProps = {
  menuItems: SidebarItemType[];
  onClose: () => void;
};

const SidebarNav: React.FC<SidebarNavProps> = ({ menuItems, onClose }) => {
  const location = useLocation();
  
  const isItemActive = (item: SidebarItemType): boolean => {
    if (location.pathname === item.path) return true;
    if (item.children) {
      return item.children.some(child => location.pathname === child.path);
    }
    return false;
  };

  const isParentActive = (path: string): boolean => {
    return location.pathname.startsWith(path) && path !== '/';
  };

  return (
    <nav className="px-4 pb-4">
      <ul className="space-y-1">
        {menuItems.map((item) => (
          <SidebarItem 
            key={item.path}
            item={item}
            isParentActive={isParentActive}
            isItemActive={isItemActive}
            onClose={onClose}
          />
        ))}
      </ul>
    </nav>
  );
};

export default SidebarNav;
