
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import BaseChart from "./BaseChart";

interface GameAreaChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

const GameAreaChart = ({ data }: GameAreaChartProps) => {
  return (
    <BaseChart 
      title="Bugs by Game Area" 
      description="Distribution of bugs across different game areas" 
      data={data}
    >
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
    </BaseChart>
  );
};

export default GameAreaChart;
