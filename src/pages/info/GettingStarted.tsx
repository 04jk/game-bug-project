
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GettingStarted = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Getting Started with BugSquasher</h1>
      <p className="text-gray-600">Welcome to BugSquasher! Follow this guide to get started with our bug tracking system.</p>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Reporting Your First Bug</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>To report a new bug:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Click on the "Report Bug" button in the navigation menu</li>
              <li>Fill in the bug details, including title and description</li>
              <li>Add any relevant screenshots or videos</li>
              <li>Select the severity level and related project area</li>
              <li>Submit the bug report</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Tracking Bugs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>To view and track bugs:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Navigate to the "Bug List" section</li>
              <li>Use filters to find specific bugs</li>
              <li>Click on any bug to view its details</li>
              <li>Update the status as you work on fixes</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Using Analytics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>To analyze bug trends:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Visit the "Analytics" section</li>
              <li>View bug statistics and trends</li>
              <li>Generate reports for your team</li>
              <li>Track resolution times and team performance</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GettingStarted;
