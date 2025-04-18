
import { BugStatus, BugSeverity } from "../../types/bug";
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
