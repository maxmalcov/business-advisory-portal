
import { LucideIcon } from 'lucide-react';

export type MenuItem = {
  name: string;
  path: string;
  icon: LucideIcon;
  children?: MenuItem[];
  highlight?: boolean;
  tooltip?: string;
};

