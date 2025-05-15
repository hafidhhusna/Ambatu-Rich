'use client';

import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface ExpenseData {
  type: string;
  amount: number;
  percentage: number; // from backend, percent per category
}

// Dummy fallback color palette for new categories
const defaultColors = [
  'hsl(210, 100%, 50%)',
  'hsl(210, 100%, 65%)',
  'hsl(210, 100%, 40%)',
  'hsl(210, 70%, 75%)',
  'hsl(210, 90%, 30%)',
];

export function ExpenseChart() {
  const [data, setData] = React.useState<ExpenseData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Simulate percentage change from last month (could come from backend)
  const [changeFromLastMonth, setChangeFromLastMonth] = React.useState<number>(-4.3);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/analytics/expense_breakdown');
        if (!res.ok) {
          throw new Error(`Error fetching data: ${res.statusText}`);
        }
        const result: ExpenseData[] = await res.json();
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Total amount from backend data
  const total = React.useMemo(() => {
    return data.reduce((sum, item) => sum + item.amount, 0);
  }, [data]);

  // Build chart config for ChartContainer from data and defaultColors
  const chartConfig = React.useMemo(() => {
    const config = {} as Record<string, { color: string; label: string }>;
    data.forEach((item, idx) => {
      config[item.type] = {
        color: defaultColors[idx % defaultColors.length],
        label: item.type,
      };
    });
    return config;
  }, [data]);

  // Prepare pie chart data
  const pieData = React.useMemo(() => {
    return data.map((item, idx) => ({
      name: item.type,
      value: item.amount,
      fill: defaultColors[idx % defaultColors.length],
    }));
  }, [data]);

  // Format percentage from backend
  const getPercentage = (item: ExpenseData) => {
    return item.percentage.toFixed(1);
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400">
        Loading chart...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 dark:text-red-400">{error}</p>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col items-center">
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[180px]">
            <ChartContainer config={chartConfig} className="aspect-square h-[160px]">
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
                  data={pieData}
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

        <div className="grid grid-cols-3 gap-x-3 gap-y-1.5 text-xs mt-4 w-full">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                style={{
                  backgroundColor: defaultColors[index % defaultColors.length],
                }}
              />
              <span className="text-gray-700 dark:text-gray-300 truncate">
                {entry.type}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-[10px] ml-auto">
                {getPercentage(entry)}%
              </span>
            </div>
          ))}
        </div>

        <div className="mt-2 flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
          {changeFromLastMonth >= 0 ? (
            <>
              <TrendingUp className="h-3 w-3" />
              <span>Spending up {changeFromLastMonth}% from last month</span>
            </>
          ) : (
            <>
              <TrendingDown className="h-3 w-3" />
              <span>Spending down {Math.abs(changeFromLastMonth)}% from last month</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
