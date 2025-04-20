
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatusChart from './StatusChart';
import SeverityChart from './SeverityChart';
import GameAreaChart from './GameAreaChart';
import TimelineChart from './TimelineChart';

interface ChartTabsProps {
  statusData: Array<{ name: string; value: number }>;
  severityData: Array<{ name: string; value: number }>;
  gameAreaData: Array<{ name: string; value: number }>;
  timeData: Array<{ date: string; New: number; Fixed: number }>;
  colors: string[];
}

const ChartTabs = ({ statusData, severityData, gameAreaData, timeData, colors }: ChartTabsProps) => {
  return (
    <Tabs defaultValue="status" className="w-full">
      <TabsList className="grid grid-cols-4 max-w-md">
        <TabsTrigger value="status">Status</TabsTrigger>
        <TabsTrigger value="severity">Severity</TabsTrigger>
        <TabsTrigger value="gameArea">Game Area</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
      </TabsList>
      
      <TabsContent value="status" className="pt-4">
        <StatusChart data={statusData} colors={colors} />
      </TabsContent>
      
      <TabsContent value="severity" className="pt-4">
        <SeverityChart data={severityData} />
      </TabsContent>
      
      <TabsContent value="gameArea" className="pt-4">
        <GameAreaChart data={gameAreaData} />
      </TabsContent>
      
      <TabsContent value="timeline" className="pt-4">
        <TimelineChart data={timeData} />
      </TabsContent>
    </Tabs>
  );
};

export default ChartTabs;
