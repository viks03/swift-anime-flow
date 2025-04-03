
import React, { useState } from 'react';
import { Search, Shuffle } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from './ui/button';
import NotificationDropdown from './NotificationDropdown';
import LoginModal from './LoginModal';

type HeaderProps = {
  toggleSidebar?: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Implement search functionality
  };

  const handleRandomAnime = () => {
    console.log('Finding random anime');
    // Implement random anime functionality
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-anime-background border-b border-anime-muted/50">
      <div className="content-wrapper py-3 flex items-center justify-between">
        {/* Mobile menu button */}
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-md text-anime-foreground hover:bg-anime-muted/20"
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span className="w-full h-0.5 bg-anime-foreground rounded-full"></span>
            <span className="w-full h-0.5 bg-anime-foreground rounded-full"></span>
            <span className="w-full h-0.5 bg-anime-foreground rounded-full"></span>
          </div>
        </button>
        
        {/* Logo */}
        <div className="flex-shrink-0 lg:w-1/4">
          <a href="/" className="flex items-center">
            <span className="text-[#9b87f5] font-bold text-xl">Anime</span>
            <span className="text-[#F43F5E] font-bold text-xl">Flow</span>
          </a>
        </div>
        
        {/* Search Bar */}
        <div className="hidden md:flex flex-grow max-w-md mx-4">
          <form onSubmit={handleSearch} className="flex w-full">
            <div className="relative flex w-full">
              <input
                type="text"
                placeholder="Search anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-l-md bg-anime-muted/60 text-anime-foreground border-r-0 border border-anime-muted focus:outline-none focus:ring-1 focus:ring-[#9b87f5]"
              />
              <Button
                type="submit"
                variant="secondary"
                className="rounded-r-md border border-anime-muted border-l-0 bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
              >
                <Search size={18} className="text-white" />
              </Button>
            </div>
          </form>
          
          <Button
            type="button"
            onClick={handleRandomAnime}
            className="ml-3 bg-[#9b87f5] hover:bg-[#7E69AB] text-white rounded-md"
          >
            <Shuffle size={18} className="mr-1" />
            <span className="hidden sm:inline">Random</span>
          </Button>
        </div>
        
        {/* User Actions */}
        <div className="flex items-center justify-end lg:w-1/4 space-x-2">
          <NotificationDropdown />
          <LoginModal />
        </div>
      </div>
      
      {/* Mobile Search - appears below header on small screens */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="flex w-full">
          <div className="relative flex w-full">
            <input
              type="text"
              placeholder="Search anime..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-l-md bg-anime-muted/60 text-anime-foreground border-r-0 border border-anime-muted focus:outline-none focus:ring-1 focus:ring-[#9b87f5]"
            />
            <Button
              type="submit"
              variant="secondary"
              className="rounded-r-md border border-anime-muted border-l-0 bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
            >
              <Search size={18} className="text-white" />
            </Button>
          </div>
        </form>
        <Button
          type="button"
          onClick={handleRandomAnime}
          className="mt-2 w-full bg-[#9b87f5] hover:bg-[#7E69AB] text-white rounded-md"
        >
          <Shuffle size={18} className="mr-1" />
          <span>Random Anime</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
