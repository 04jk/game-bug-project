
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface GameAreaChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

const GameAreaChart = ({ data }: GameAreaChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bugs by Game Area</CardTitle>
        <CardDescription>Distribution of bugs across different game areas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
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

export default GameAreaChart;

