
import { Bug, Comment } from "../../types/bug";
import { generateMockBugs } from "../generators/mockBugs";
import { v4 as uuidv4 } from "uuid";

// Initialize mock bugs
export const mockBugs = generateMockBugs();

// Bug CRUD operations
export const getBugById = (id: string): Bug | undefined => {
  return mockBugs.find(bug => bug.id === id);
};

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
