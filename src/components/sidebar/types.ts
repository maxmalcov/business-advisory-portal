
import { IconType } from 'lucide-react';

export type SidebarItem = {
  name: string;
  path: string;
  icon: IconType;
  children?: SidebarItem[];
};
