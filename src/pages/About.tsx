
import React from 'react';
import FAQ from '@/components/about/FAQ';

const About = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">About the Bug Tracking System</h1>
        <p className="text-gray-500 mt-2">Learn about our software, development team, and how to use the platform.</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="mb-4">
          The Bug Tracking System is designed to streamline the process of tracking, managing, and resolving
          software bugs across development teams. Our mission is to provide a comprehensive tool that enhances
          collaboration between testers, developers, and project managers, ultimately leading to higher quality
          software products.
        </p>
        <p>
          By offering role-based access and intuitive interfaces, we aim to make bug tracking an efficient
          and straightforward process for teams of all sizes.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-md p-4">
            <h3 className="font-semibold text-lg mb-2">Role-Based Access</h3>
            <p>Customized interfaces and permissions for testers, developers, project managers, and administrators.</p>
          </div>
          <div className="border rounded-md p-4">
            <h3 className="font-semibold text-lg mb-2">Bug Management</h3>
            <p>Comprehensive bug reporting, assignment, status tracking, and resolution workflow.</p>
          </div>
          <div className="border rounded-md p-4">
            <h3 className="font-semibold text-lg mb-2">Team Communication</h3>
            <p>Integrated chat and commenting system for efficient team collaboration.</p>
          </div>
          <div className="border rounded-md p-4">
            <h3 className="font-semibold text-lg mb-2">Analytics & Reporting</h3>
            <p>Detailed analytics and customizable reports for tracking team performance and project status.</p>
          </div>
          <div className="border rounded-md p-4">
            <h3 className="font-semibold text-lg mb-2">File Attachments</h3>
            <p>Support for uploading screenshots, logs, and other files related to bug reports.</p>
          </div>
          <div className="border rounded-md p-4">
            <h3 className="font-semibold text-lg mb-2">User Management</h3>
            <p>Administrative tools for managing user accounts, roles, and permissions.</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
        <p className="mb-4">
          New to the Bug Tracking System? Here are some resources to help you get started:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <a href="/info/getting-started" className="text-primary hover:underline">
              Getting Started Guide
            </a>
            {" - A comprehensive introduction to the platform"}
          </li>
          <li>
            <a href="/bugs" className="text-primary hover:underline">
              Browse Bugs
            </a>
            {" - View current bug reports and their statuses"}
          </li>
          <li>
            <a href="/settings" className="text-primary hover:underline">
              Settings
            </a>
            {" - Customize your profile and notification preferences"}
          </li>
        </ul>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
        <p className="mb-4">
          If you need assistance or have questions about the Bug Tracking System, please reach out to our support team:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Email: support@bugtracker.com</li>
          <li>Phone: (555) 123-4567</li>
          <li>Hours: Monday - Friday, 9:00 AM - 5:00 PM EST</li>
        </ul>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <FAQ />
      </div>
      
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-gray-500 text-sm">
          Bug Tracking System &copy; {new Date().getFullYear()} | Version 1.0.0
        </p>
      </div>
    </div>
  );
};

export default About;
