import React from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/context/ThemeContext';

type SidebarHeaderProps = {
  onClose: () => void;
};

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ onClose }) => {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="px-4 py-8 mb-10">
      <div className="flex items-center justify-between">
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className={`${isDark ? 'text-white hover:bg-white/10' : 'text-sidebar-foreground'}`}
          >
            &times;
          </Button>
        )}
      </div>
    </div>
  );
};

export default SidebarHeader;
