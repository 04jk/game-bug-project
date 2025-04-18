
import React from 'react';
import { Badge } from './badge';
import { BugSeverity } from '@/types/bug';
import { cn } from '@/lib/utils';

interface SeverityBadgeProps {
  severity: BugSeverity;
  className?: string;
}

const SeverityBadge = ({ severity, className }: SeverityBadgeProps) => {
  const getSeverityColor = (severity: BugSeverity) => {
    switch (severity) {
      case BugSeverity.LOW:
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case BugSeverity.MEDIUM:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case BugSeverity.HIGH:
        return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      case BugSeverity.CRITICAL:
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <Badge className={cn(getSeverityColor(severity), className)} variant="outline">
      {severity}
    </Badge>
  );
};

export default SeverityBadge;
