
import StatCard from './StatCard';

interface StatsOverviewProps {
  stats: {
    totalBugs: number;
    openBugs: number;
    fixedBugs: number;
    criticalBugs: number;
  };
}

const StatsOverview = ({ stats }: StatsOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        title="Total Bugs" 
        value={stats.totalBugs} 
      />
      
      <StatCard 
        title="Open Bugs" 
        value={stats.openBugs} 
        subtitle={`${Math.round(stats.openBugs / stats.totalBugs * 100)}% of all bugs`}
      />
      
      <StatCard 
        title="Fixed Bugs" 
        value={stats.fixedBugs} 
        subtitle={`${Math.round(stats.fixedBugs / stats.totalBugs * 100)}% of all bugs`}
      />
      
      <StatCard 
        title="Critical Bugs" 
        value={stats.criticalBugs} 
        subtitle={`${Math.round(stats.criticalBugs / stats.totalBugs * 100)}% of all bugs`}
      />
    </div>
  );
};

export default StatsOverview;
