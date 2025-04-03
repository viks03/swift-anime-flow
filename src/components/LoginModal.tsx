
import React from 'react';
import { User, Mail, Key, Check, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const LoginModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="p-2 rounded-full hover:bg-anime-muted/20">
          <User size={20} className="text-anime-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-anime-background border border-anime-muted">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            <span className="text-[#9b87f5]">Anime</span>
            <span className="text-[#F43F5E]">Flow</span>
          </DialogTitle>
          <DialogDescription className="text-center">
            Login to access your personalized anime experience
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="relative">
            <div className="absolute left-3 top-3 text-anime-muted-foreground">
              <Mail size={16} />
            </div>
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full pl-10 px-4 py-2 rounded-md bg-anime-muted/60 text-anime-foreground border border-anime-muted focus:outline-none focus:ring-1 focus:ring-[#9b87f5]"
            />
          </div>
          
          <div className="relative">
            <div className="absolute left-3 top-3 text-anime-muted-foreground">
              <Key size={16} />
            </div>
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full pl-10 px-4 py-2 rounded-md bg-anime-muted/60 text-anime-foreground border border-anime-muted focus:outline-none focus:ring-1 focus:ring-[#9b87f5]"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <div className="relative flex items-center">
                <input 
                  type="checkbox"
                  className="sr-only"
                />
                <div className="w-4 h-4 border border-anime-muted rounded flex items-center justify-center">
                  <Check size={12} className="text-[#9b87f5]" />
                </div>
              </div>
              <span className="text-sm text-anime-muted-foreground">Remember me</span>
            </label>
            <Button variant="link" className="text-[#9b87f5] text-sm p-0 h-auto flex items-center gap-1">
              <HelpCircle size={12} />
              <span>Forgot password?</span>
            </Button>
          </div>
          
          <Button className="w-full bg-[#9b87f5] hover:bg-[#7E69AB] text-white">
            Login
          </Button>
          
          <div className="text-center text-sm text-anime-muted-foreground">
            Don't have an account?{" "}
            <Button variant="link" className="text-[#9b87f5] p-0 h-auto">
              Sign up
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
