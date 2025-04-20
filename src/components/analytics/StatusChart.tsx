
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface StatusChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  colors: string[];
}

const StatusChart = ({ data, colors }: StatusChartProps) => {
  return (
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
                data={data}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
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

export default StatusChart;

