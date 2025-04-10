
import React from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

type SidebarHeaderProps = {
  onClose: () => void;
};

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ onClose }) => {
  const isMobile = useIsMobile();

  return (
    <div className="px-4 py-6 mb-8">
      <div className="flex items-center justify-between h-8">
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
