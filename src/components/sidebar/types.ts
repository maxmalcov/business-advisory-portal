
export interface SidebarItem {
  name: string;
  path: string;
  icon: React.ElementType;
  highlight?: boolean;
  tooltip?: string;
  badge?: number;
  hasPendingChildren?: boolean;
  children?: SidebarItem[];
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}
