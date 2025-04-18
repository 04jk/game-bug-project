
import React from 'react';
import { Badge } from './badge';
import { BugStatus } from '@/types/bug';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: BugStatus;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusColor = (status: BugStatus) => {
    switch (status) {
      case BugStatus.NEW:
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case BugStatus.ASSIGNED:
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case BugStatus.IN_PROGRESS:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case BugStatus.UNDER_REVIEW:
        return "bg-indigo-100 text-indigo-800 hover:bg-indigo-200";
      case BugStatus.FIXED:
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case BugStatus.CLOSED:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <Badge className={cn(getStatusColor(status), className)} variant="outline">
      {status}
    </Badge>
  );
};

export default StatusBadge;
