
import { Bug, BugStatus, BugSeverity } from "../../types/bug";
import { mockBugs } from "../store/bugStore";

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
    
    const aValue = String(a[sort.field]).toLowerCase();
    const bValue = String(b[sort.field]).toLowerCase();
    
    return sort.direction === 'asc' 
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  return filtered;
};

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
