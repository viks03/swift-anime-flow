
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from './ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Notification = {
  id: number;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
};

const sampleNotifications: Notification[] = [
  {
    id: 1,
    title: "New Episode Released",
    message: "Jujutsu Kaisen Episode 24 is now available!",
    time: "10 minutes ago",
    isRead: false
  },
  {
    id: 2,
    title: "Continue Watching",
    message: "You left off at episode 7 of Demon Slayer.",
    time: "2 hours ago",
    isRead: false
  },
  {
    id: 3,
    title: "New Anime Added",
    message: "Chainsaw Man has been added to our library!",
    time: "Yesterday",
    isRead: true
  },
  {
    id: 4,
    title: "Updates Complete",
    message: "My Hero Academia Season 5 is now complete!",
    time: "3 days ago",
    isRead: true
  }
];

const NotificationDropdown = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative p-2 rounded-full hover:bg-anime-muted/20">
          <Bell size={20} className="text-anime-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#F43F5E] rounded-full"></span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-anime-background border border-anime-muted">
        <div className="flex justify-between items-center p-4 border-b border-anime-muted">
          <h3 className="font-semibold">Notifications</h3>
          <Button variant="link" className="text-[#9b87f5] text-xs p-0 h-auto">
            Mark all as read
          </Button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {sampleNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-4 border-b border-anime-muted hover:bg-anime-muted/20 cursor-pointer ${!notification.isRead ? 'bg-anime-muted/10' : ''}`}
            >
              <div className="flex justify-between">
                <h4 className="font-medium text-sm">{notification.title}</h4>
                <span className="text-xs text-anime-muted-foreground">{notification.time}</span>
              </div>
              <p className="text-xs mt-1 text-anime-muted-foreground">{notification.message}</p>
              {!notification.isRead && (
                <div className="mt-2 flex justify-end">
                  <div className="w-2 h-2 bg-[#9b87f5] rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="p-2 text-center border-t border-anime-muted">
          <Button variant="link" className="text-[#9b87f5] text-xs w-full">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationDropdown;
