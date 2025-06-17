
import React, { useState } from 'react';
import NewHeader from './NewHeader';
import NewSidebar from './NewSidebar';

type LayoutProps = {
  children: React.ReactNode;
};

const NewLayout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NewHeader toggleSidebar={toggleSidebar} />
      <NewSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      <main className="lg:ml-64 min-h-[calc(100vh-4rem)] pb-16 lg:pb-0">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default NewLayout;
