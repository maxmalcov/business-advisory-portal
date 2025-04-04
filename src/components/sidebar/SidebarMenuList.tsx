
import React from 'react';
import { SidebarItem } from './types';
import SidebarMenuItem from './SidebarMenuItem';
import SidebarParentItem from './SidebarParentItem';

type SidebarMenuListProps = {
  items: SidebarItem[];
  onClose?: () => void;
};

const SidebarMenuList: React.FC<SidebarMenuListProps> = ({ items, onClose }) => {
  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item.path}>
          {!item.children ? (
            <SidebarMenuItem item={item} onClose={onClose} />
          ) : (
            <SidebarParentItem item={item} onClose={onClose} />
          )}
        </li>
      ))}
    </ul>
  );
};

export default SidebarMenuList;
