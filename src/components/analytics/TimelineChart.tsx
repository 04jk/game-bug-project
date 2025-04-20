
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface TimelineChartProps {
  data: Array<{
    date: string;
    New: number;
    Fixed: number;
  }>;
}

const TimelineChart = ({ data }: TimelineChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bug Trends Over Time</CardTitle>
        <CardDescription>New vs Fixed bugs dynamically generated from bug data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
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
            <li>Dynamic analysis of bug creation and resolution trends</li>
            <li>Data updates automatically as users report new bugs</li>
            <li>Shows developer performance through bug resolution rate</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimelineChart;

