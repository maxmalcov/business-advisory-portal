
import { ReactElement } from 'react';

export type SidebarItem = {
  name: string;
  path: string;
  icon: React.ElementType;
  children?: SidebarItem[];
};

export type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};
