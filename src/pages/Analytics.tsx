
import React from 'react';
import { getStatistics } from '@/data/analytics/bugStatistics';
import StatsOverview from '@/components/analytics/StatsOverview';
import ChartTabs from '@/components/analytics/ChartTabs';

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
      
      <StatsOverview stats={stats} />
      
      <ChartTabs 
        statusData={statusData}
        severityData={severityData}
        gameAreaData={gameAreaData}
        timeData={stats.timeData}
        colors={COLORS}
      />
    </div>
  );
};

export default Analytics;
