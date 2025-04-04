
import { LucideIcon } from 'lucide-react';

export type SidebarItem = {
  name: string;
  path: string;
  icon: LucideIcon;
  children?: SidebarItem[];
};
