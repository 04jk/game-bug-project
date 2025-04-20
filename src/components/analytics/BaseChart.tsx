
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer } from "recharts";

interface BaseChartProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  data: Array<{
    name: string;
    value: number;
  }> | Array<any>;
  legendContent?: React.ReactNode;
  additionalContent?: React.ReactNode;
}

const BaseChart = ({ 
  title, 
  description, 
  children, 
  data, 
  legendContent,
  additionalContent 
}: BaseChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </div>
        
        {legendContent}
        
        {/* Optional data summary grid */}
        {additionalContent ? (
          additionalContent
        ) : data && data[0] && 'name' in data[0] && 'value' in data[0] ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {data.map(({ name, value }) => (
              <div key={name} className="p-4 border rounded-md">
                <p className="text-sm text-gray-500">{name}</p>
                <p className="text-xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default BaseChart;
