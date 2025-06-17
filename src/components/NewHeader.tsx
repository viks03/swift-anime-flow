
import React, { useState } from 'react';
import { Search, Menu, User, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import LoginModal from './LoginModal';
import NotificationDropdown from './NotificationDropdown';

type HeaderProps = {
  toggleSidebar?: () => void;
};

const NewHeader = ({ toggleSidebar }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useTheme();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Navigate to search results
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden mr-2"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 mr-6">
          <div className="font-bold text-xl">
            <span className="text-primary">Anime</span>
            <span className="text-accent">Flow</span>
          </div>
        </Link>

        {/* Navigation Links - Desktop */}
        <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium mr-auto">
          <Link
            to="/"
            className="transition-colors hover:text-primary"
          >
            Home
          </Link>
          <Link
            to="/browse"
            className="transition-colors hover:text-primary"
          >
            Browse
          </Link>
          <Link
            to="/popular"
            className="transition-colors hover:text-primary"
          >
            Popular
          </Link>
          <Link
            to="/movies"
            className="transition-colors hover:text-primary"
          >
            Movies
          </Link>
          <Link
            to="/random"
            className="transition-colors hover:text-primary"
          >
            Random
          </Link>
        </nav>

        {/* Search Bar */}
        <div className="flex-1 max-w-sm mx-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search anime..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </form>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <NotificationDropdown />
          <LoginModal />
        </div>
      </div>
    </header>
  );
};

export default NewHeader;
