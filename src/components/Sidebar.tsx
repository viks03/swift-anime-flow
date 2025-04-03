
import React from 'react';
import { Home, Clock, TrendingUp, History, User, Settings } from 'lucide-react';
import { cn } from "@/lib/utils";

type NavItem = {
  name: string;
  icon: React.ElementType;
  active?: boolean;
};

type SidebarProps = {
  isOpen: boolean;
};

const navItems: NavItem[] = [
  { name: 'Home', icon: Home, active: true },
  { name: 'Latest', icon: Clock },
  { name: 'Trending', icon: TrendingUp },
  { name: 'History', icon: History },
  { name: 'Profile', icon: User },
  { name: 'Settings', icon: Settings },
];

const Sidebar = ({ isOpen }: SidebarProps) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        "fixed top-[62px] left-0 bottom-0 z-40 w-60 bg-anime-background border-r border-anime-muted/50 transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full overflow-y-auto py-4 px-3">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <a
                  href="#"
                  className={cn("sidebar-link", item.active && "active")}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Mobile Navigation Bar - Fixed at bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-anime-background border-t border-anime-muted/50">
        <div className="grid grid-cols-6">
          {navItems.map((item) => (
            <a
              key={item.name}
              href="#"
              className={cn("mobile-nav-link", item.active && "active")}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span>{item.name}</span>
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
