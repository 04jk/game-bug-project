
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getStatistics } from '@/data/analytics/bugStatistics';
import StatCard from '@/components/analytics/StatCard';
import StatusChart from '@/components/analytics/StatusChart';
import SeverityChart from '@/components/analytics/SeverityChart';
import GameAreaChart from '@/components/analytics/GameAreaChart';
import TimelineChart from '@/components/analytics/TimelineChart';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', 
  '#82ca9d', '#ffc658', '#a4de6c', '#d0ed57', '#83a6ed'
];

const Analytics = () => {
  const stats = getStatistics();
  
  // Format data for charts
  const statusData = Object.entries(stats.byStatus).map(([status, count]) => ({
    name: status,
    value: count,
  }));
  
  const severityData = Object.entries(stats.bySeverity).map(([severity, count]) => ({
    name: severity,
    value: count,
  }));
  
  const gameAreaData = Object.entries(stats.byGameArea).map(([area, count]) => ({
    name: area,
    value: count,
  }));
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Analytics</h1>
        <p className="text-gray-500">Detailed insights into bug trends and patterns</p>
      </div>
      
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
      
      <Tabs defaultValue="status" className="w-full">
        <TabsList className="grid grid-cols-4 max-w-md">
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="severity">Severity</TabsTrigger>
          <TabsTrigger value="gameArea">Game Area</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="status" className="pt-4">
          <StatusChart data={statusData} colors={COLORS} />
        </TabsContent>
        
        <TabsContent value="severity" className="pt-4">
          <SeverityChart data={severityData} />
        </TabsContent>
        
        <TabsContent value="gameArea" className="pt-4">
          <GameAreaChart data={gameAreaData} />
        </TabsContent>
        
        <TabsContent value="timeline" className="pt-4">
          <TimelineChart data={stats.timeData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;

