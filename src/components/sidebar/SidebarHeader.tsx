
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

type SidebarHeaderProps = {
  onClose: () => void;
};

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ onClose }) => {
  const isMobile = useIsMobile();

  return (
    <div className="px-4 py-2 mb-6">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold text-white">Business Advisory</span>
        </Link>
        {isMobile && (
          <Button variant="ghost" size="sm" onClick={onClose} className="text-sidebar-foreground">
            &times;
          </Button>
        )}
      </div>
    </div>
  );
};

export default SidebarHeader;
