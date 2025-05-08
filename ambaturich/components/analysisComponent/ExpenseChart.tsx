'use client';

import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';
import { TrendingUp } from 'lucide-react';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

// Updated data with color variables - using blue shades to match your dashboard theme
const data = [
  { name: 'Food', value: 400, fill: 'hsl(210, 100%, 50%)' }, // Bright blue
  { name: 'Rent', value: 300, fill: 'hsl(210, 100%, 65%)' }, // Light blue
  { name: 'Transport', value: 250, fill: 'hsl(210, 100%, 40%)' }, // Darker blue
  { name: 'Shopping', value: 200, fill: 'hsl(210, 70%, 75%)' }, // Pale blue
  { name: 'Entertainment', value: 150, fill: 'hsl(210, 90%, 30%)' }, // Deep blue
];

// Define an interface for chart config entries to ensure consistent typing
interface ChartConfigEntry {
  label: string;
  color?: string;
}

// Chart configuration with matching blue palette
const chartConfig: Record<string, ChartConfigEntry> = {
  value: {
    label: 'Amount',
  },
  Food: {
    label: 'Food',
    color: 'hsl(210, 100%, 50%)',
  },
  Rent: {
    label: 'Rent',
    color: 'hsl(210, 100%, 65%)',
  },
  Transport: {
    label: 'Transport',
    color: 'hsl(210, 100%, 40%)',
  },
  Shopping: {
    label: 'Shopping',
    color: 'hsl(210, 70%, 75%)',
  },
  Entertainment: {
    label: 'Entertainment',
    color: 'hsl(210, 90%, 30%)',
  },
};

export function ExpenseChart() {
  // Calculate total
  const total = React.useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0);
  }, []);

  // Calculate percentages
  const getPercentage = (value: number) => {
    return ((value / total) * 100).toFixed(1);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center">
        {/* Chart Container - centered */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[180px]">
            <ChartContainer
              config={chartConfig}
              className="aspect-square h-[160px]"
            >
              <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value) => `Rp ${value.toLocaleString()}`}
                    />
                  }
                />
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={40}
                  outerRadius={65}
                  strokeWidth={2}
                  paddingAngle={1}
                  strokeOpacity={0.8}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                        const cx = viewBox.cx || 0;
                        const cy = viewBox.cy || 0;

                        return (
                          <text
                            x={cx}
                            y={cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={cx}
                              y={cy - 4}
                              className="fill-blue-700 dark:fill-blue-300 text-lg font-bold"
                            >
                              Rp {total.toLocaleString()}
                            </tspan>
                            <tspan
                              x={cx}
                              y={cy + 14}
                              className="fill-blue-600/70 dark:fill-blue-400/70 text-[10px]"
                            >
                              Total
                            </tspan>
                          </text>
                        );
                      }
                      return null;
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>
        </div>

        {/* Legend - below the chart */}
        <div className="grid grid-cols-3 gap-x-3 gap-y-1.5 text-xs mt-4 w-full">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                style={{ backgroundColor: entry.fill }}
              ></div>
              <span className="text-gray-700 dark:text-gray-300 truncate">
                {entry.name}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-[10px] ml-auto">
                {getPercentage(entry.value)}%
              </span>
            </div>
          ))}
        </div>

        {/* Trend Indicator */}
        <div className="mt-2 flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
          <TrendingUp className="h-3 w-3" />
          <span>Spending down 4.3% from last month</span>
        </div>
      </div>
    </div>
  );
}
