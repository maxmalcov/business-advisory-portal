
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
  
  // Load expanded state from localStorage on mount
  useEffect(() => {
    const savedExpanded = localStorage.getItem('sidebarExpanded');
    if (savedExpanded) {
      setExpandedItems(JSON.parse(savedExpanded));
    }
  }, []);

  // Save expanded state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarExpanded', JSON.stringify(expandedItems));
  }, [expandedItems]);

  // Set initial expanded state based on current route
  useEffect(() => {
    const matchingParent = menuItems.find(item => 
      item.children?.some(child => location.pathname === child.path)
    );
    
    if (matchingParent && !expandedItems.includes(matchingParent.path)) {
      setExpandedItems(prev => [...prev, matchingParent.path]);
    }
  }, [location.pathname, menuItems]);

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

  const handleItemClick = (item: SidebarItemType) => {
    if (item.children) {
      setExpandedItems(prev => {
        if (prev.includes(item.path)) {
          return prev;
        } else {
          return [item.path];
        }
      });
    }
    
    // Navigate to the parent path
    if (item.path) {
      navigate(item.path);
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
            toggleExpanded={handleItemClick}
          />
        ))}
      </ul>
    </nav>
  );
};

export default SidebarNav;
