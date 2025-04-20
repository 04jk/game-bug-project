
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import BaseChart from "./BaseChart";

interface SeverityChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

const SeverityChart = ({ data }: SeverityChartProps) => {
  return (
    <BaseChart 
      title="Bugs by Severity" 
      description="Distribution of bugs across different severity levels" 
      data={data}
    >
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
    </BaseChart>
  );
};

export default SeverityChart;
