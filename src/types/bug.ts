
export enum BugSeverity {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  CRITICAL = "Critical"
}

export enum BugStatus {
  NEW = "New",
  ASSIGNED = "Assigned",
  IN_PROGRESS = "In Progress",
  UNDER_REVIEW = "Under Review",
  FIXED = "Fixed",
  CLOSED = "Closed"
}

export interface Comment {
  id: string;
  bugId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface Bug {
  id: string;
  title: string;
  description: string;
  stepsToReproduce: string;
  status: BugStatus;
  severity: BugSeverity;
  assignedTo?: string;
  reportedBy: string;
  gameArea: string;
  platform: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}
