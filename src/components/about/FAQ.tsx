
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            What is the Bug Tracking System?
          </AccordionTrigger>
          <AccordionContent>
            The Bug Tracking System is a comprehensive solution designed to help development teams efficiently track, manage, and resolve software bugs. It offers role-based access for testers, developers, project managers, and administrators, each with specific responsibilities and permissions within the system.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-2">
          <AccordionTrigger>
            What are the different user roles?
          </AccordionTrigger>
          <AccordionContent>
            <p className="mb-2">The system has four user roles with distinct responsibilities:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Testers:</strong> Create bug reports, assign bugs to developers, and communicate details.</li>
              <li><strong>Developers:</strong> View assigned bugs, update their status, and resolve issues.</li>
              <li><strong>Project Managers:</strong> Monitor overall bug statuses, team performance, and generate reports.</li>
              <li><strong>Administrators:</strong> Manage user accounts, system settings, and have full access to all features.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-3">
          <AccordionTrigger>
            How do I report a new bug?
          </AccordionTrigger>
          <AccordionContent>
            To report a new bug, you need to have a Tester or Admin role. Navigate to the "New Bug" page from the sidebar, fill in the required information about the bug (title, description, severity, steps to reproduce, etc.), attach any relevant files or screenshots, and submit the form. You can then assign the bug to a developer for resolution.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-4">
          <AccordionTrigger>
            How can I track the status of my reported bugs?
          </AccordionTrigger>
          <AccordionContent>
            You can view all bugs you've reported by going to the "Bugs" page from the sidebar and using the filter options to show only the bugs you've created. Each bug card displays its current status (New, In Progress, Testing, Resolved, Closed), and you can click on any bug to view detailed information about its progress.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-5">
          <AccordionTrigger>
            How do I change my password?
          </AccordionTrigger>
          <AccordionContent>
            If you're already logged in, go to your Settings page and update your password in the Profile section. If you've forgotten your password, use the "Forgot Password" link on the login page to receive a password reset email, which will allow you to set a new password.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-6">
          <AccordionTrigger>
            Can I communicate with developers about a bug?
          </AccordionTrigger>
          <AccordionContent>
            Yes, the system provides a chat feature where testers and developers can discuss specific bugs. On the bug detail page, you can add comments to provide additional information or ask questions. For more extensive discussions, you can use the dedicated chat room accessible from the sidebar.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-7">
          <AccordionTrigger>
            How can administrators manage user accounts?
          </AccordionTrigger>
          <AccordionContent>
            Administrators can manage all user accounts by accessing the "Users" page from the sidebar. From there, they can view all registered users, add new users, modify user roles and permissions, export user data, and deactivate accounts if needed. This centralized management ensures proper access control within the system.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-8">
          <AccordionTrigger>
            What analytics are available for project managers?
          </AccordionTrigger>
          <AccordionContent>
            Project Managers have access to comprehensive analytics on the "Analytics" page, including bug status distributions, severity breakdowns, resolution timelines, and team performance metrics. These analytics help identify trends, bottlenecks in the workflow, and areas for improvement in the development process.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FAQ;
