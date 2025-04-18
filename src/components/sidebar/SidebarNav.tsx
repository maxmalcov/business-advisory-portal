
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SidebarItem from './SidebarItem';
import { SidebarItem as SidebarItemType } from './types';

type SidebarNavProps = {
  menuItems: SidebarItemType[];
  onClose: () => void;
};

const SidebarNav: React.FC<SidebarNavProps> = ({ menuItems, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
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
      setExpandedItems([]);
      return;
    }

    setExpandedItems(prev => {
      if (prev.includes(path)) {
        return prev.filter(item => item !== path);
      } else {
        return [path];
      }
    });
  };

  const handleItemClick = (path: string, hasChildren: boolean) => {
    // Navigate to the path
    navigate(path);
    
    // Toggle submenu
    toggleExpanded(path, hasChildren);
    
    // Close sidebar on mobile if it's not a parent item
    if (!hasChildren) {
      onClose();
    }
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
            onClick={handleItemClick}
          />
        ))}
      </ul>
    </nav>
  );
};

export default SidebarNav;
