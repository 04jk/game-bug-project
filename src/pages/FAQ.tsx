
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FAQ = () => {
  const faqs = [
    {
      question: "What is a Bug Tracking System?",
      answer: "A Bug Tracking System (BTS) is a software application that helps developers, testers, and project managers to keep track of reported bugs in their software projects. It allows users to report bugs, assign them to developers, track their status, and maintain a database of known issues."
    },
    {
      question: "What user roles are available in this system?",
      answer: "Our system has four user roles: Admin, Project Manager, Developer, and Tester. Each role has different permissions and responsibilities in the bug tracking workflow."
    },
    {
      question: "How do I report a new bug?",
      answer: "If you have Tester or Admin privileges, you can report a new bug by clicking on the 'Create Bug' link in the sidebar. Fill out the bug report form with details like title, description, steps to reproduce, and assign it to a developer."
    },
    {
      question: "How do I reset my password?",
      answer: "To reset your password, go to the login page and click on 'Forgot password?' link. Enter your email address, and you'll receive a password reset link in your email. Follow the link to create a new password."
    },
    {
      question: "What information should I include in a bug report?",
      answer: "A good bug report should include a clear title, detailed description, steps to reproduce, expected vs. actual results, browser/OS information, severity level, and screenshots or videos if applicable."
    },
    {
      question: "Can I export user data?",
      answer: "Yes, if you have Admin privileges, you can export user data by going to the User Management page and clicking on the 'Export Users' button. You can select which fields to include in the export."
    },
    {
      question: "How can I check the status of a bug?",
      answer: "You can view all bugs by clicking on the 'Bug List' link in the sidebar. Each bug will show its current status (e.g., Open, In Progress, Fixed, Closed). Click on a specific bug to see more details and its history."
    },
    {
      question: "What analytics are available for project managers?",
      answer: "Project Managers can access analytics dashboards that show bug trends, resolution times, developer performance, and other key metrics to help track project health and progress."
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
          <CardDescription>
            Find answers to commonly asked questions about our Bug Tracking System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQ;
