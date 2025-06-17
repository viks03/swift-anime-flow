
import React from 'react';
import { Home, Clock, TrendingUp, History, User, Settings, Shuffle, Film, Star, Grid3X3 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";

type NavItem = {
  name: string;
  icon: React.ElementType;
  href: string;
  badge?: string;
};

type SidebarProps = {
  isOpen: boolean;
  onClose?: () => void;
};

const NewSidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();

  const navItems: NavItem[] = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Browse All', icon: Grid3X3, href: '/browse' },
    { name: 'Latest Episodes', icon: Clock, href: '/latest' },
    { name: 'Trending', icon: TrendingUp, href: '/trending' },
    { name: 'Popular', icon: Star, href: '/popular' },
    { name: 'Movies', icon: Film, href: '/movies' },
    { name: 'Random Anime', icon: Shuffle, href: '/random' },
    { name: 'Watch History', icon: History, href: '/history' },
    { name: 'My Profile', icon: User, href: '/profile' },
    { name: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        "fixed top-16 left-0 bottom-0 z-40 w-64 border-r bg-background transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full overflow-y-auto py-4">
          <div className="px-3">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Navigation
            </h2>
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                    location.pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile bottom navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t bg-background">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 p-2 text-xs font-medium transition-colors",
                location.pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="truncate">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default NewSidebar;
