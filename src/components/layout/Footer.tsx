
import React from 'react';
import { Link } from 'react-router-dom';
import { Info, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  return (
    <footer className="mt-auto bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About BugSquasher</h3>
            <p className="text-gray-600 mb-4">
              A comprehensive bug tracking system designed to help development teams manage and resolve software issues efficiently.
            </p>
            <Link to="/about">
              <Button variant="outline" size="sm" className="gap-2">
                <Info className="h-4 w-4" />
                Learn More
              </Button>
            </Link>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Help Center</h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link to="/info/getting-started" className="hover:text-primary">Getting Started</Link>
              </li>
              <li>
                <Link to="/info/faq" className="hover:text-primary">FAQ</Link>
              </li>
              <li>
                <Link to="/info/contact" className="hover:text-primary">Contact Support</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link to="/new-bug" className="hover:text-primary">Report a Bug</Link>
              </li>
              <li>
                <Link to="/bugs" className="hover:text-primary">View All Bugs</Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-primary">Analytics</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} BugSquasher. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/info/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link to="/info/terms" className="hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
