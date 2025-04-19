
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <h1 className="text-3xl font-bold">About BugSquasher</h1>
        <p className="text-gray-500">Learn more about our bug tracking system</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            BugSquasher is a comprehensive bug tracking system designed to help development teams efficiently manage and resolve software issues. Our platform provides powerful tools for bug reporting, tracking, and analysis.
          </p>
          <p>
            We believe in making bug tracking simple and effective, enabling teams to focus on what matters most: creating great software.
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              <li>Detailed bug reporting with attachments</li>
              <li>Real-time bug tracking and updates</li>
              <li>Advanced analytics and insights</li>
              <li>Team collaboration tools</li>
              <li>Customizable workflows</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Why Choose Us</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              <li>User-friendly interface</li>
              <li>Robust security measures</li>
              <li>Scalable solution</li>
              <li>Dedicated support team</li>
              <li>Regular updates and improvements</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
