
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface SeverityChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

const SeverityChart = ({ data }: SeverityChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bugs by Severity</CardTitle>
        <CardDescription>Distribution of bugs across different severity levels</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
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
          {data.map(({ name, value }) => (
            <div key={name} className="p-4 border rounded-md">
              <p className="text-sm text-gray-500">{name}</p>
              <p className="text-xl font-bold">{value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SeverityChart;

