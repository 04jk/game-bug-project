
import { BugStatus, BugSeverity, Bug } from "../../types/bug";
import { mockBugs } from "../store/bugStore";

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
  
  // Generate dynamic time data based on bugs
  const timeData = generateTimelineData(mockBugs);
  
  return {
    totalBugs,
    openBugs,
    fixedBugs,
    criticalBugs,
    byStatus,
    bySeverity,
    byGameArea,
    timeData
  };
};

// Generate dynamic timeline data based on actual bugs
const generateTimelineData = (bugs: Bug[]) => {
  // Get all unique months from bug created and updated dates
  const allDates = bugs.flatMap(bug => {
    const dates = [];
    const createdDate = new Date(bug.createdAt);
    const updatedDate = new Date(bug.updatedAt);
    
    dates.push(createdDate);
    // Only add updated date if it's different from created date
    if (bug.updatedAt && bug.createdAt !== bug.updatedAt) {
      dates.push(updatedDate);
    }
    
    return dates;
  });
  
  // Sort dates and get unique months
  const sortedDates = allDates.sort((a, b) => a.getTime() - b.getTime());
  
  // If no dates available, return sample data
  if (sortedDates.length === 0) {
    return [
      { date: '2023-01', New: 5, Fixed: 2 },
      { date: '2023-02', New: 8, Fixed: 4 },
      { date: '2023-03', New: 12, Fixed: 6 },
      { date: '2023-04', New: 10, Fixed: 9 },
      { date: '2023-05', New: 15, Fixed: 11 },
      { date: '2023-06', New: 18, Fixed: 14 },
      { date: '2023-07', New: 13, Fixed: 16 },
    ];
  }
  
  // Get unique months in format YYYY-MM
  const uniqueMonths = Array.from(new Set(
    sortedDates.map(date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`)
  ));
  
  // Create timeline data
  return uniqueMonths.map(monthStr => {
    // Type assertion to let TS know this is a string
    const monthParts = monthStr.split('-');
    const year = parseInt(monthParts[0]);
    const month = parseInt(monthParts[1]);
    
    // Count new bugs created this month
    const newBugs = bugs.filter(bug => {
      const createdDate = new Date(bug.createdAt);
      return createdDate.getFullYear() === year && createdDate.getMonth() + 1 === month;
    }).length;
    
    // Count bugs fixed this month
    const fixedBugs = bugs.filter(bug => {
      if (bug.status !== BugStatus.FIXED) return false;
      const updatedDate = new Date(bug.updatedAt);
      return updatedDate.getFullYear() === year && updatedDate.getMonth() + 1 === month;
    }).length;
    
    return {
      date: monthStr,
      New: newBugs,
      Fixed: fixedBugs
    };
  });
};
