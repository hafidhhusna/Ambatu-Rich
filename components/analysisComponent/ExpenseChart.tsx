'use client';

import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';
import { TrendingUp, Loader2 } from 'lucide-react';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

// Define TypeScript interfaces
interface ExpenseData {
  type: string;
  amount: number;
  percentage: number;
}

interface ChartDataItem {
  name: string;
  value: number;
  fill: string;
}

interface ChartConfigEntry {
  label: string;
  color?: string;
}

interface ExpenseChartProps {
  selectedMonth?: string;
}

// Generate a consistent color palette for categories
const generateColors = (count: number): string[] => {
  const colors = [
    'hsl(210, 100%, 50%)', // Bright blue
    'hsl(210, 100%, 65%)', // Light blue
    'hsl(210, 100%, 40%)', // Darker blue
    'hsl(210, 70%, 75%)', // Pale blue
    'hsl(210, 90%, 30%)', // Deep blue
    'hsl(200, 80%, 60%)', // Cyan blue
    'hsl(220, 85%, 55%)', // Purple blue
    'hsl(190, 75%, 45%)', // Teal blue
  ];

  // If we need more colors than we have, generate them
  while (colors.length < count) {
    const hue = 210 + (colors.length - 8) * 30; // Shift hue for additional colors
    colors.push(`hsl(${hue % 360}, 70%, 50%)`);
  }

  return colors.slice(0, count);
};

export function ExpenseChart({ selectedMonth }: ExpenseChartProps) {
  const [expenseData, setExpenseData] = React.useState<ExpenseData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch expense data
  React.useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        setLoading(true);

        // Build URL with query parameters if selectedMonth is provided
        let url = '/api/analytics/expense_breakdown';
        if (selectedMonth) {
          const [year, month] = selectedMonth.split('-');
          const queryParams = new URLSearchParams({
            year,
            month,
          });
          url = `${url}?${queryParams}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Failed to fetch expense data');
        }

        const data: ExpenseData[] = await response.json();
        setExpenseData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching expense data:', err);
        setError('Failed to load expense data');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenseData();
  }, [selectedMonth]);

  // Transform data for the chart
  const chartData: ChartDataItem[] = React.useMemo(() => {
    const colors = generateColors(expenseData.length);
    return expenseData.map((item, index) => ({
      name: item.type,
      value: item.amount,
      fill: colors[index],
    }));
  }, [expenseData]);

  // Generate chart config dynamically
  const chartConfig: Record<string, ChartConfigEntry> = React.useMemo(() => {
    const config: Record<string, ChartConfigEntry> = {
      value: {
        label: 'Amount',
      },
    };

    const colors = generateColors(expenseData.length);
    expenseData.forEach((item, index) => {
      config[item.type] = {
        label: item.type,
        color: colors[index],
      };
    });

    return config;
  }, [expenseData]);

  // Calculate total
  const total = React.useMemo(() => {
    return expenseData.reduce((sum, item) => sum + item.amount, 0);
  }, [expenseData]);

  // Loading state
  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400 mb-2" />
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Loading expense data...
        </span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-8">
        <div className="text-sm text-red-600 dark:text-red-400 text-center">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (expenseData.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-8">
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          No expense data available for this month
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col items-center">
        {/* Chart Container - centered with more space */}
        <div className="w-full flex justify-center mb-6">
          <div className="w-full max-w-[220px]">
            <ChartContainer
              config={chartConfig}
              className="aspect-square h-[200px]"
            >
              <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value) => `Rp ${value.toLocaleString()}`}
                    />
                  }
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  strokeWidth={2}
                  paddingAngle={2}
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
                              y={cy - 6}
                              className="fill-blue-700 dark:fill-blue-300 text-xl font-bold"
                            >
                              Rp {total.toLocaleString()}
                            </tspan>
                            <tspan
                              x={cx}
                              y={cy + 16}
                              className="fill-blue-600/70 dark:fill-blue-400/70 text-xs"
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

        {/* Legend - below the chart with better spacing */}
        <div className="w-full px-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm max-w-md mx-auto">
            {chartData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: entry.fill }}
                ></div>
                <span className="text-gray-700 dark:text-gray-300 truncate flex-1">
                  {entry.name}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                  {expenseData.find((item) => item.type === entry.name)
                    ?.percentage || 0}
                  %
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Trend Indicator - with more spacing */}
        <div className="mt-4 flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
          <TrendingUp className="h-3 w-3" />
          <span>Current month's spending breakdown</span>
        </div>
      </div>
    </div>
  );
}
