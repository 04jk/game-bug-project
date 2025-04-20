
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const InfoLayout = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Information Center</h1>
        <p className="text-gray-500">Learn how to use the Bug Tracking System effectively</p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="getting-started" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="contact">Contact Support</TabsTrigger>
            </TabsList>
            
            {/* Outlet renders the matched child route component */}
            <Outlet />
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfoLayout;
