
import { Bug, BugSeverity, BugStatus, Comment } from "../../types/bug";
import { v4 as uuidv4 } from "uuid";
import { users } from "./mockUsers";

// Mock bug comments
export const generateMockComments = (bugId: string, count: number = Math.floor(Math.random() * 5)): Comment[] => {
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
export const generateMockBugs = (count: number = 25): Bug[] => {
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
