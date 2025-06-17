
import React from 'react';
import NewLayout from '@/components/NewLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Settings, Heart, Clock } from 'lucide-react';

const Profile = () => {
  return (
    <NewLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Profile Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Your account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Username</label>
                <p className="text-muted-foreground">AnimeFan123</p>
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <p className="text-muted-foreground">user@example.com</p>
              </div>
              <Button variant="outline" className="w-full">
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Watch Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Watch Statistics
              </CardTitle>
              <CardDescription>
                Your viewing habits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold">142</p>
                  <p className="text-sm text-muted-foreground">Episodes Watched</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">23</p>
                  <p className="text-sm text-muted-foreground">Series Completed</p>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold">89h 23m</p>
                <p className="text-sm text-muted-foreground">Total Watch Time</p>
              </div>
            </CardContent>
          </Card>

          {/* Favorites */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Favorites
              </CardTitle>
              <CardDescription>
                Your liked anime
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>Attack on Titan</p>
                <p>Demon Slayer</p>
                <p>One Piece</p>
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Favorites
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </NewLayout>
  );
};

export default Profile;
