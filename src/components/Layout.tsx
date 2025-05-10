import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Sheet, SheetContent } from '@/components/ui/sheet';

const Layout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [window.location.pathname, isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Function to render sidebar based on device type
  const renderSidebar = () => {
    if (!isAuthenticated) return null;

    if (isMobile) {
      return (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent
            side="left"
            className="p-0 w-[85%] max-w-[280px] border-r"
          >
            <Sidebar isOpen={true} onClose={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>
      );
    }

    return (
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {isAuthenticated && renderSidebar()}

      {isAuthenticated && isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="fixed left-4 top-[4.5rem] z-30 shadow-sm"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar menu"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      )}

      <main
        className={`pt-4 transition-all duration-300 ${
          isAuthenticated
            ? isMobile
              ? 'px-4 pb-20' // Add padding bottom for mobile to account for potential bottom navigation
              : 'pl-[17rem] pr-4'
            : 'px-4'
        }`}
      >
        <div className="container mx-auto py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
