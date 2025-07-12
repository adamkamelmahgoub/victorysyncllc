import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Phone, Mail, Calendar, Clock, Star, Download, FileText, Bell, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'wouter';

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

function CustomerDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    scrollToTop();
  }, [activeTab]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="w-[90%] mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">
              Welcome, {user.firstName} {user.lastName}!
            </CardTitle>
            <Avatar>
              <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
            </Avatar>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList>
              <TabsTrigger value="profile" onClick={() => setActiveTab("profile")}>Profile</TabsTrigger>
              <TabsTrigger value="settings" onClick={() => setActiveTab("settings")}>Settings</TabsTrigger>
              <TabsTrigger value="notifications" onClick={() => setActiveTab("notifications")}>Notifications</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-gray-100 dark:bg-gray-800 shadow-md">
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">{user.firstName} {user.lastName}</h3>
                        <p className="text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p>
                        <Phone className="inline-block w-4 h-4 mr-2" />
                        {user.phone || 'N/A'}
                      </p>
                      <p>
                        <Mail className="inline-block w-4 h-4 mr-2" />
                        {user.email}
                      </p>
                      <p>
                        <Calendar className="inline-block w-4 h-4 mr-2" />
                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-100 dark:bg-gray-800 shadow-md">
                  <CardContent>
                    <h4 className="text-md font-semibold mb-2">Account Status</h4>
                    <Badge variant="secondary">Active</Badge>
                    <div className="mt-4">
                      <h4 className="text-md font-semibold mb-2">Recent Activity</h4>
                      <ul className="list-disc list-inside">
                        <li>Updated profile information</li>
                        <li>Logged in to dashboard</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="settings">
              <Card className="bg-gray-100 dark:bg-gray-800 shadow-md">
                <CardContent>
                  <h4 className="text-md font-semibold mb-2">Settings</h4>
                  <p>Customize your profile settings here.</p>
                  <Button className="mt-4">Update Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notifications">
              <Card className="bg-gray-100 dark:bg-gray-800 shadow-md">
                <CardContent>
                  <h4 className="text-md font-semibold mb-2">Notifications</h4>
                  <p>View recent notifications and alerts.</p>
                  <div className="mt-4">
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <span>New message from support</span>
                      <Clock className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <span>Account update</span>
                      <Clock className="w-4 h-4 text-gray-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <div className="w-[90%] mx-auto mt-4 flex justify-between items-center">
        <div className="space-x-2">
          <Link href="/terms">
            <Button size="sm" variant="link">
              Terms of Service
            </Button>
          </Link>
          <Link href="/privacy">
            <Button size="sm" variant="link">
              Privacy Policy
            </Button>
          </Link>
        </div>
        <div className="space-x-2">
          <Link href="/contact">
                      <Button size="sm" variant="outline" onClick={scrollToTop}>
                        Contact Support
                      </Button>
                    </Link>
          <Link href="/">
                    <Button variant="outline" size="sm" className="w-full" onClick={scrollToTop}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </Link>
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;