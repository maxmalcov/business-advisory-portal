
import React from 'react';
import {
  Users,
  FileText,
  Mail,
  AlertTriangle,
  Settings,
} from 'lucide-react';

export const getLogIcon = (category: string) => {
  switch (category) {
    case 'user':
      return <Users className="h-4 w-4" />;
    case 'file':
      return <FileText className="h-4 w-4" />;
    case 'email':
      return <Mail className="h-4 w-4" />;
    case 'security':
      return <AlertTriangle className="h-4 w-4" />;
    case 'service':
      return <Settings className="h-4 w-4" />;
    case 'invoice':
      return <FileText className="h-4 w-4" />;
    case 'system':
      return <Settings className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

export const getLogBadgeStyle = (level: string) => {
  switch (level) {
    case 'info':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
    case 'error':
      return 'bg-red-100 text-red-800 hover:bg-red-100';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
  }
};
