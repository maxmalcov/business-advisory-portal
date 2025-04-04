
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import SidebarMenuList from './SidebarMenuList';
import { useMenuItems } from './menuItems';

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { clientMenuItems, adminMenuItems } = useMenuItems();
  
  const isAdmin = user?.userType === 'admin';
  const menuItems = isAdmin ? adminMenuItems : clientMenuItems;

  return (
    <aside 
      className={cn(
        "bg-sidebar text-sidebar-foreground w-64 min-h-screen overflow-y-auto fixed top-0 left-0 z-40 pt-4 transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : (isMobile ? "-translate-x-full" : "translate-x-0"),
        isMobile && "shadow-lg"
      )}
    >
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
      
      <nav className="px-4 pb-4">
        <SidebarMenuList items={menuItems} onClose={onClose} />
      </nav>
    </aside>
  );
};

export default Sidebar;
