
import React, { useEffect } from 'react';
import { Outlet, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GettingStarted from './GettingStarted';
import FAQ from './FAQ';

const InfoLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine which tab should be active based on the current URL
  const getTabValue = () => {
    if (location.pathname.includes('faq')) return 'faq';
    if (location.pathname.includes('contact')) return 'contact';
    return 'getting-started';
  };
  
  const defaultTab = getTabValue();
  
  // Handle tab change to update the URL accordingly
  const handleTabChange = (value: string) => {
    if (value === 'getting-started') {
      navigate('/info/getting-started');
    } else if (value === 'faq') {
      navigate('/info/faq');
    } else if (value === 'contact') {
      navigate('/info/contact');
    }
  };
  
  // If at root info path, redirect to the default tab
  useEffect(() => {
    if (location.pathname === '/info') {
      navigate(`/info/${defaultTab}`);
    }
  }, [location.pathname, defaultTab, navigate]);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Information Center</h1>
        <p className="text-gray-500">Learn how to use the Bug Tracking System effectively</p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <Tabs 
            value={defaultTab} 
            className="w-full" 
            onValueChange={handleTabChange}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="contact">Contact Support</TabsTrigger>
            </TabsList>
            
            {/* Render either the outlet or the direct content based on route */}
            {location.pathname !== '/info' ? (
              <Outlet />
            ) : (
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
                    <p className="mb-4">Need help with BugSquasher? Our support team is ready to assist you.</p>
                    
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <h3 className="font-medium text-lg mb-2">Email Support</h3>
                      <p>Email us at: <a href="mailto:support@bugsquasher.com" className="text-primary hover:underline">support@bugsquasher.com</a></p>
                      <p className="text-sm text-gray-500 mt-1">We typically respond within 24 hours during business days.</p>
                    </div>
                    
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <h3 className="font-medium text-lg mb-2">Business Hours</h3>
                      <p>Monday to Friday: 9am to 5pm EST</p>
                      <p>Weekend support available for emergency issues only.</p>
                    </div>
                    
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-lg mb-2">Admin Support</h3>
                      <p>For Admin or Project Manager role access:</p>
                      <p>Contact your organization's system administrator or email <a href="mailto:admin@bugsquasher.com" className="text-primary hover:underline">admin@bugsquasher.com</a> with your request.</p>
                    </div>
                  </div>
                </TabsContent>
              </>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfoLayout;
