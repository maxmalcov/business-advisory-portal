
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const Layout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-background overflow-hidden">
      <Header />
      
      <div className="flex flex-1 w-full">
        {isAuthenticated && (
          <>
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            {isMobile && (
              <Button
                variant="outline"
                size="icon"
                className="fixed left-4 top-[4.5rem] z-30"
                onClick={toggleSidebar}
              >
                <Menu size={20} />
              </Button>
            )}
          </>
        )}
        
        <main className={`flex-1 bg-background p-4 transition-all duration-300 ${
          isAuthenticated ? (isMobile ? '' : 'ml-[16rem]') : ''
        }`}>
          <div className="container mx-auto py-6 h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
