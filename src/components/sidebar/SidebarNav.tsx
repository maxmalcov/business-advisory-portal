
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SidebarItem from './SidebarItem';
import { SidebarItem as SidebarItemType } from './types';

type SidebarNavProps = {
  menuItems: SidebarItemType[];
  onClose: () => void;
};

const SidebarNav: React.FC<SidebarNavProps> = ({ menuItems, onClose }) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
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

  // Set initial expanded state based on current route
  useEffect(() => {
    const initialExpanded = menuItems
      .filter(item => item.children && item.children.some(child => location.pathname === child.path))
      .map(item => item.path);
    
    if (initialExpanded.length > 0) {
      setExpandedItems(initialExpanded);
    }
  }, [location.pathname, menuItems]);

  const toggleExpanded = (path: string, hasChildren: boolean) => {
    if (!hasChildren) {
      // If clicking an item without children, collapse all expanded items
      setExpandedItems([]);
      return;
    }

    setExpandedItems(prev => {
      if (prev.includes(path)) {
        // If already expanded, collapse only this item
        return prev.filter(item => item !== path);
      } else {
        // If expanding this item, collapse all others and expand only this one
        return [path];
      }
    });
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
            isExpanded={expandedItems.includes(item.path)}
            toggleExpanded={toggleExpanded}
          />
        ))}
      </ul>
    </nav>
  );
};

export default SidebarNav;
