
import React, { useState } from 'react';
import { Search, Shuffle, Bell, User, Menu } from 'lucide-react';
import { cn } from "@/lib/utils";

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
          <Menu size={24} />
        </button>
        
        {/* Logo */}
        <div className="flex-shrink-0 lg:w-1/4">
          <a href="/" className="flex items-center">
            <span className="text-anime-primary font-bold text-xl">Anime</span>
            <span className="text-anime-accent font-bold text-xl">Flow</span>
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
                className="w-full px-4 py-2 rounded-l-md bg-anime-muted/60 text-anime-foreground border-r-0 border border-anime-muted focus:outline-none focus:ring-1 focus:ring-anime-primary"
              />
              <button
                type="submit"
                className="px-3 bg-anime-muted/60 border border-l-0 border-anime-muted rounded-r-none rounded-md hover:bg-anime-muted"
              >
                <Search size={18} className="text-anime-foreground" />
              </button>
              <button
                type="button"
                onClick={handleRandomAnime}
                className="px-3 bg-anime-primary rounded-r-md hover:bg-anime-secondary transition-colors"
                title="Random Anime"
              >
                <Shuffle size={18} className="text-white" />
              </button>
            </div>
          </form>
        </div>
        
        {/* User Actions */}
        <div className="flex items-center justify-end lg:w-1/4 space-x-4">
          <button className="p-2 rounded-full hover:bg-anime-muted/20">
            <Bell size={20} className="text-anime-foreground" />
          </button>
          <button className="p-2 rounded-full hover:bg-anime-muted/20">
            <User size={20} className="text-anime-foreground" />
          </button>
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
              className="w-full px-4 py-2 rounded-l-md bg-anime-muted/60 text-anime-foreground border-r-0 border border-anime-muted focus:outline-none focus:ring-1 focus:ring-anime-primary"
            />
            <button
              type="submit"
              className="px-3 bg-anime-muted/60 border border-l-0 border-anime-muted rounded-r-none rounded-md hover:bg-anime-muted"
            >
              <Search size={18} className="text-anime-foreground" />
            </button>
            <button
              type="button"
              onClick={handleRandomAnime}
              className="px-3 bg-anime-primary rounded-r-md hover:bg-anime-secondary transition-colors"
              title="Random Anime"
            >
              <Shuffle size={18} className="text-white" />
            </button>
          </div>
        </form>
      </div>
    </header>
  );
};

export default Header;
