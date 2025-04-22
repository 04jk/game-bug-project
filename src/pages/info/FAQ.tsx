
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { TabsContent } from '@/components/ui/tabs';

const FAQ = () => {
  return (
    <TabsContent value="faq" className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="what-is-bugsquasher">
          <AccordionTrigger>What is BugSquasher?</AccordionTrigger>
          <AccordionContent>
            BugSquasher is a comprehensive bug tracking system designed to help development teams efficiently 
            manage and resolve software issues. Our platform streamlines the process of reporting, tracking,
            and resolving bugs, enhancing team collaboration and improving software quality.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="user-roles">
          <AccordionTrigger>What are the different user roles in BugSquasher?</AccordionTrigger>
          <AccordionContent>
            <p>BugSquasher has four user roles, each with specific permissions:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Admin:</strong> Full access to all features, user management, and system settings.</li>
              <li><strong>Project Manager:</strong> Can monitor bugs, developers, testers, view analytics, and manage settings.</li>
              <li><strong>Developer:</strong> Responsible for fixing bugs, updating bug status, and participating in chats.</li>
              <li><strong>Tester:</strong> Can report new bugs, assign bugs to developers, and host chat sessions.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="how-to-report">
          <AccordionTrigger>How do I report a new bug?</AccordionTrigger>
          <AccordionContent>
            <p>To report a new bug:</p>
            <ol className="list-decimal pl-6 mt-2 space-y-1">
              <li>Log in with Tester or Admin credentials</li>
              <li>Click on "Report Bug" in the sidebar</li>
              <li>Fill out the bug report form with all relevant details</li>
              <li>Attach any screenshots or files if needed</li>
              <li>Submit the report</li>
            </ol>
            <p className="mt-2">Once submitted, the bug will be visible in the system and can be assigned to developers.</p>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="assign-bugs">
          <AccordionTrigger>How do I assign bugs to developers?</AccordionTrigger>
          <AccordionContent>
            <p>To assign a bug to a developer:</p>
            <ol className="list-decimal pl-6 mt-2 space-y-1">
              <li>Navigate to the bug details page</li>
              <li>Click on the "Assign" button</li>
              <li>Select a developer from the dropdown menu</li>
              <li>Optionally add a comment with specific instructions</li>
              <li>Click "Confirm Assignment"</li>
            </ol>
            <p className="mt-2">The assigned developer will be notified and the bug status will update accordingly.</p>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="analytics">
          <AccordionTrigger>What analytics are available?</AccordionTrigger>
          <AccordionContent>
            <p>BugSquasher provides comprehensive analytics including:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Bug resolution time statistics</li>
              <li>Developer performance metrics</li>
              <li>Bug distribution by severity, type, and status</li>
              <li>Time-based trends and progress charts</li>
              <li>Team efficiency reports</li>
            </ul>
            <p className="mt-2">These analytics are primarily available to Project Managers and Admins.</p>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="admin-access">
          <AccordionTrigger>How do I get Admin or Project Manager access?</AccordionTrigger>
          <AccordionContent>
            <p>To register as an Admin or Project Manager:</p>
            <ol className="list-decimal pl-6 mt-2 space-y-1">
              <li>Go to the registration page</li>
              <li>Fill out your details</li>
              <li>Select "Admin" or "Project Manager" as your role</li>
              <li>Enter the required secret code (contact your system administrator for this code)</li>
              <li>Complete the registration process</li>
            </ol>
            <p className="mt-2">For security reasons, Admin and Project Manager roles require special authorization.</p>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="data-storage">
          <AccordionTrigger>How is bug data stored and secured?</AccordionTrigger>
          <AccordionContent>
            <p>BugSquasher uses Supabase for secure data storage and management. All data is:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Stored in a secure PostgreSQL database</li>
              <li>Protected by Row-Level Security policies</li>
              <li>Only accessible to authenticated users with appropriate permissions</li>
              <li>Regularly backed up to prevent data loss</li>
            </ul>
            <p className="mt-2">User authentication and data access are managed through secure tokens and role-based permissions.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </TabsContent>
  );
};

export default FAQ;
