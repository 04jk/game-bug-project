
import { Bug, BugSeverity, BugStatus, Comment } from "../types/bug";
import { v4 as uuidv4 } from "uuid";

// Mock users
const users = [
  { id: "user1", name: "John Developer" },
  { id: "user2", name: "Sarah Tester" },
  { id: "user3", name: "Michael Manager" },
  { id: "user4", name: "Emily Designer" }
];

// Mock bug comments
const generateMockComments = (bugId: string, count: number = Math.floor(Math.random() * 5)): Comment[] => {
  return Array(count).fill(null).map((_, index) => {
    const user = users[Math.floor(Math.random() * users.length)];
    return {
      id: uuidv4(),
      bugId,
      userId: user.id,
      userName: user.name,
      content: `This is a mock comment ${index + 1} for the bug. We need to investigate this issue further.`,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString()
    };
  });
};

// Mock bugs data
const generateMockBugs = (count: number = 25): Bug[] => {
  const gameAreas = ["UI/UX", "Controls", "Graphics", "Audio", "Gameplay", "Networking", "Performance", "AI"];
  const platforms = ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile", "All Platforms"];
  
  return Array(count).fill(null).map((_, index) => {
    const id = uuidv4();
    const reportedBy = users[Math.floor(Math.random() * users.length)].name;
    const assignedTo = Math.random() > 0.3 ? users[Math.floor(Math.random() * users.length)].name : undefined;
    const severity = Object.values(BugSeverity)[Math.floor(Math.random() * 4)];
    const createdDate = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));
    
    return {
      id,
      title: `Bug #${index + 1}: ${["Game crashes when", "Visual glitch appears after", "Audio cuts out during", "Performance drops while", "Controls freeze when"][Math.floor(Math.random() * 5)]} ${["loading new level", "defeating boss", "changing settings", "connecting to multiplayer", "saving game"][Math.floor(Math.random() * 5)]}`,
      description: `This bug occurs consistently and affects gameplay significantly. ${Math.random() > 0.5 ? "It happens only in certain conditions." : "It appears to be a widespread issue."}`,
      stepsToReproduce: `1. Start the game\n2. ${["Enter level 3", "Open the settings menu", "Connect to multiplayer", "Equip the legendary item", "Use special ability near water"][Math.floor(Math.random() * 5)]}\n3. ${["Wait for 30 seconds", "Press the jump button repeatedly", "Switch weapons quickly", "Interact with NPC", "Save the game"][Math.floor(Math.random() * 5)]}\n4. Observe the bug occurring`,
      status: Object.values(BugStatus)[Math.floor(Math.random() * 6)],
      severity,
      assignedTo,
      reportedBy,
      gameArea: gameAreas[Math.floor(Math.random() * gameAreas.length)],
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      createdAt: createdDate.toISOString(),
      updatedAt: new Date(createdDate.getTime() + Math.floor(Math.random() * 5 * 24 * 60 * 60 * 1000)).toISOString(),
      comments: generateMockComments(id)
    };
  });
};

export const mockBugs = generateMockBugs();

// Function to get filtered and sorted bugs
export const getFilteredBugs = (
  filters: {
    search?: string;
    status?: BugStatus[];
    severity?: BugSeverity[];
    assignedTo?: string;
    platform?: string;
    gameArea?: string;
  },
  sort: {
    field: keyof Bug;
    direction: 'asc' | 'desc';
  } = { field: 'createdAt', direction: 'desc' }
): Bug[] => {
  let filtered = [...mockBugs];

  // Apply filters
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(bug => 
      bug.title.toLowerCase().includes(searchLower) || 
      bug.description.toLowerCase().includes(searchLower)
    );
  }
  
  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter(bug => filters.status?.includes(bug.status));
  }
  
  if (filters.severity && filters.severity.length > 0) {
    filtered = filtered.filter(bug => filters.severity?.includes(bug.severity));
  }
  
  if (filters.assignedTo) {
    filtered = filtered.filter(bug => bug.assignedTo === filters.assignedTo);
  }
  
  if (filters.platform) {
    filtered = filtered.filter(bug => bug.platform === filters.platform);
  }
  
  if (filters.gameArea) {
    filtered = filtered.filter(bug => bug.gameArea === filters.gameArea);
  }

  // Apply sorting
  filtered.sort((a, b) => {
    if (sort.field === 'createdAt' || sort.field === 'updatedAt') {
      return sort.direction === 'asc' 
        ? new Date(a[sort.field]).getTime() - new Date(b[sort.field]).getTime()
        : new Date(b[sort.field]).getTime() - new Date(a[sort.field]).getTime();
    }
    
    // For string fields
    const aValue = String(a[sort.field]).toLowerCase();
    const bValue = String(b[sort.field]).toLowerCase();
    
    if (sort.direction === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  return filtered;
};

// Function to get a bug by ID
export const getBugById = (id: string): Bug | undefined => {
  return mockBugs.find(bug => bug.id === id);
};

// Function to add a new bug
export const addBug = (bug: Omit<Bug, 'id' | 'createdAt' | 'updatedAt' | 'comments'>): Bug => {
  const newBug: Bug = {
    ...bug,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    comments: []
  };
  
  mockBugs.unshift(newBug);
  return newBug;
};

// Function to update a bug
export const updateBug = (id: string, updates: Partial<Bug>): Bug | undefined => {
  const index = mockBugs.findIndex(bug => bug.id === id);
  if (index !== -1) {
    mockBugs[index] = {
      ...mockBugs[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return mockBugs[index];
  }
  return undefined;
};

// Function to add a comment to a bug
export const addComment = (bugId: string, userId: string, userName: string, content: string): Comment | undefined => {
  const bug = mockBugs.find(bug => bug.id === bugId);
  if (bug) {
    const newComment: Comment = {
      id: uuidv4(),
      bugId,
      userId,
      userName,
      content,
      createdAt: new Date().toISOString()
    };
    
    bug.comments.push(newComment);
    return newComment;
  }
  return undefined;
};

export const getStatistics = () => {
  const totalBugs = mockBugs.length;
  const openBugs = mockBugs.filter(bug => 
    bug.status !== BugStatus.CLOSED && bug.status !== BugStatus.FIXED
  ).length;
  const fixedBugs = mockBugs.filter(bug => bug.status === BugStatus.FIXED).length;
  const criticalBugs = mockBugs.filter(bug => bug.severity === BugSeverity.CRITICAL).length;
  
  const byStatus = Object.values(BugStatus).reduce<Record<string, number>>((acc, status) => {
    acc[status] = mockBugs.filter(bug => bug.status === status).length;
    return acc;
  }, {});
  
  const bySeverity = Object.values(BugSeverity).reduce<Record<string, number>>((acc, severity) => {
    acc[severity] = mockBugs.filter(bug => bug.severity === severity).length;
    return acc;
  }, {});
  
  const byGameArea: Record<string, number> = {};
  mockBugs.forEach(bug => {
    byGameArea[bug.gameArea] = (byGameArea[bug.gameArea] || 0) + 1;
  });
  
  return {
    totalBugs,
    openBugs,
    fixedBugs,
    criticalBugs,
    byStatus,
    bySeverity,
    byGameArea
  };
};

// Initial user for the app
export const currentUser = {
  id: "user1",
  name: "John Developer",
  role: "Developer"
};

// Get all unique values for filters
export const getFilterOptions = () => {
  const platforms = Array.from(new Set(mockBugs.map(bug => bug.platform)));
  const gameAreas = Array.from(new Set(mockBugs.map(bug => bug.gameArea)));
  const assignees = Array.from(new Set(mockBugs.filter(bug => bug.assignedTo).map(bug => bug.assignedTo as string)));
  
  return {
    platforms,
    gameAreas,
    assignees
  };
};
