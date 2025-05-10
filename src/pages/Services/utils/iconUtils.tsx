import React from 'react';
import {
  CircleDollarSign,
  FileText,
  Users,
  Package,
  PackagePlus,
  Boxes,
} from 'lucide-react';

export const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'CircleDollarSign':
      return <CircleDollarSign className="h-5 w-5 text-primary" />;
    case 'FileText':
      return <FileText className="h-5 w-5 text-primary" />;
    case 'Users':
      return <Users className="h-5 w-5 text-primary" />;
    case 'Package':
      return <Package className="h-5 w-5 text-primary" />;
    case 'PackagePlus':
      return <PackagePlus className="h-5 w-5 text-primary" />;
    case 'Boxes':
      return <Boxes className="h-5 w-5 text-primary" />;
    default:
      return <Package className="h-5 w-5 text-primary" />;
  }
};
