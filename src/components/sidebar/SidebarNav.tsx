
import React, { useState } from 'react';
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
  React.useEffect(() => {
    const initialExpanded = menuItems
      .filter(item => item.children && item.children.some(child => location.pathname === child.path))
      .map(item => item.path);
    
    if (initialExpanded.length > 0) {
      setExpandedItems(prev => {
        // Only update if the items aren't already in the array
        const newItems = initialExpanded.filter(item => !prev.includes(item));
        return [...prev, ...newItems];
      });
    }
  }, [location.pathname, menuItems]);

  const toggleExpanded = (path: string) => {
    setExpandedItems(prev => 
      prev.includes(path)
        ? prev.filter(item => item !== path)
        : [...prev, path]
    );
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
