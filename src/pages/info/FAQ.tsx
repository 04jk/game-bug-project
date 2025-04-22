
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
        
        <AccordionItem value="admin-access">
          <AccordionTrigger>How do I get Admin or Project Manager access?</AccordionTrigger>
          <AccordionContent>
            <p>To register as an Admin or Project Manager:</p>
            <ol className="list-decimal pl-6 mt-2 space-y-1">
              <li>Go to the registration page</li>
              <li>Fill out your details</li>
              <li>Select "Admin" or "Project Manager" as your role</li>
              <li>Enter the required secret code:</li>
              <ul className="list-disc pl-6 mt-1 mb-1">
                <li>For Admin role: <code>admin1234</code></li>
                <li>For Project Manager role: <code>pm1234</code></li>
              </ul>
              <li>Complete the registration process</li>
            </ol>
            <p className="mt-2">Note: In a production environment, these secret codes would be securely managed and only shared with authorized personnel. The codes shown here are for demonstration purposes only.</p>
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
        
        <AccordionItem value="support">
          <AccordionTrigger>How can I get help if I encounter issues?</AccordionTrigger>
          <AccordionContent>
            <p>For technical support or assistance:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Email our support team at <a href="mailto:support@bugsquasher.com" className="text-primary hover:underline">support@bugsquasher.com</a></li>
              <li>Check our documentation in the "Getting Started" section</li>
              <li>Use the in-app chat support available during business hours</li>
            </ul>
            <p className="mt-2">Our support team typically responds within 24 hours during business days.</p>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="login-issues">
          <AccordionTrigger>What should I do if I can't log in?</AccordionTrigger>
          <AccordionContent>
            <p>If you're having trouble logging in:</p>
            <ol className="list-decimal pl-6 mt-2 space-y-1">
              <li>Check that you're using the correct email and password</li>
              <li>Ensure your account has been activated (check your email for verification)</li>
              <li>Try the "Forgot Password" option to reset your credentials</li>
              <li>Clear your browser cache and cookies, then try again</li>
              <li>If problems persist, contact your system administrator or our support team</li>
            </ol>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </TabsContent>
  );
};

export default FAQ;
