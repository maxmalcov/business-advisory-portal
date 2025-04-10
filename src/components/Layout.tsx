
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
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="flex flex-1 relative">
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
        
        <main className={`flex-1 transition-all duration-300 ${isAuthenticated ? (isMobile ? 'pl-4' : 'pl-[17rem]') : ''} pr-4 pt-4`}>
          <div className="container mx-auto py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
