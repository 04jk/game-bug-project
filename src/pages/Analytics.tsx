
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getStatistics } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { BugStatus, BugSeverity } from '@/types/bug';

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
  
  // Mock time-based data
  const timeData = [
    { date: '2023-01', New: 5, Fixed: 2 },
    { date: '2023-02', New: 8, Fixed: 4 },
    { date: '2023-03', New: 12, Fixed: 6 },
    { date: '2023-04', New: 10, Fixed: 9 },
    { date: '2023-05', New: 15, Fixed: 11 },
    { date: '2023-06', New: 18, Fixed: 14 },
    { date: '2023-07', New: 13, Fixed: 16 },
  ];
  
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', 
    '#82ca9d', '#ffc658', '#a4de6c', '#d0ed57', '#83a6ed'
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Analytics</h1>
        <p className="text-gray-500">Detailed insights into bug trends and patterns</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Total Bugs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalBugs}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Open Bugs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.openBugs}</div>
            <p className="text-sm text-gray-500">
              {Math.round(stats.openBugs / stats.totalBugs * 100)}% of all bugs
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Fixed Bugs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.fixedBugs}</div>
            <p className="text-sm text-gray-500">
              {Math.round(stats.fixedBugs / stats.totalBugs * 100)}% of all bugs
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Critical Bugs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.criticalBugs}</div>
            <p className="text-sm text-gray-500">
              {Math.round(stats.criticalBugs / stats.totalBugs * 100)}% of all bugs
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="status" className="w-full">
        <TabsList className="grid grid-cols-4 max-w-md">
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="severity">Severity</TabsTrigger>
          <TabsTrigger value="gameArea">Game Area</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="status" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Bugs by Status</CardTitle>
              <CardDescription>Distribution of bugs across different statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-6">
                {Object.entries(stats.byStatus).map(([status, count]) => (
                  <div key={status} className="p-4 border rounded-md">
                    <p className="text-sm text-gray-500">{status}</p>
                    <p className="text-xl font-bold">{count}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="severity" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Bugs by Severity</CardTitle>
              <CardDescription>Distribution of bugs across different severity levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={severityData}
                    layout="vertical"
                    margin={{
                      top: 5,
                      right: 30,
                      left: 100,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#9b87f5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mt-6">
                {Object.entries(stats.bySeverity).map(([severity, count]) => (
                  <div key={severity} className="p-4 border rounded-md">
                    <p className="text-sm text-gray-500">{severity}</p>
                    <p className="text-xl font-bold">{count}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="gameArea" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Bugs by Game Area</CardTitle>
              <CardDescription>Distribution of bugs across different game areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={gameAreaData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#7E69AB" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mt-6">
                {Object.entries(stats.byGameArea).map(([area, count]) => (
                  <div key={area} className="p-4 border rounded-md">
                    <p className="text-sm text-gray-500">{area}</p>
                    <p className="text-xl font-bold">{count}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="timeline" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Bug Trends Over Time</CardTitle>
              <CardDescription>New vs Fixed bugs over the last 7 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={timeData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="New" stroke="#9b87f5" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="Fixed" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="p-4 border rounded-md mt-6">
                <h3 className="font-medium mb-2">Insights</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Bug reports have increased by 160% over the last 7 months</li>
                  <li>Fix rate has improved by 700% from January to July</li>
                  <li>The gap between new bugs and fixed bugs is narrowing</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
