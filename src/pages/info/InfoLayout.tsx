
import React from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GettingStarted from './GettingStarted';
import FAQ from './FAQ';

const InfoLayout = () => {
  const location = useLocation();
  const defaultTab = location.pathname.includes('faq') ? 'faq' : 'getting-started';
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Information Center</h1>
        <p className="text-gray-500">Learn how to use the Bug Tracking System effectively</p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="contact">Contact Support</TabsTrigger>
            </TabsList>
            
            {/* Render content based on the selected tab */}
            {location.pathname === '/info' ? (
              <>
                <TabsContent value="getting-started">
                  <GettingStarted />
                </TabsContent>
                <TabsContent value="faq">
                  <FAQ />
                </TabsContent>
                <TabsContent value="contact">
                  <div className="py-4">
                    <h2 className="text-2xl font-semibold mb-4">Contact Support</h2>
                    <p>Need help with BugSquasher? Our support team is ready to assist you.</p>
                    <p className="mt-2">Email us at: <a href="mailto:support@bugsquasher.com" className="text-primary hover:underline">support@bugsquasher.com</a></p>
                    <p className="mt-2">Business hours: Monday to Friday, 9am to 5pm EST</p>
                  </div>
                </TabsContent>
              </>
            ) : (
              <Outlet />
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfoLayout;
