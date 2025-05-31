'use client';

import React, { useEffect, useState } from 'react';
import { ExpenseChart } from '@/components/analysisComponent/ExpenseChart';
import { ImprovementCard } from '@/components/analysisComponent/ImprovementCard';
import { ReportQuery } from '@/components/analysisComponent/ReportQuery';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  IconChartPie,
  IconTrendingUp,
  IconRobot,
  IconCalendar,
  IconCurrencyRupee,
  IconActivity,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Improvement {
  category: string;
  change: string;
  tip: string;
}

const AnalyticsPage: React.FC = () => {
  const [overview, setOverview] = useState<{
    total_spent: number;
  } | null>(null);

  // States for improvements
  const [improvements, setImprovements] = useState<Improvement[]>([]);
  const [improvementLoading, setImprovementLoading] = useState(true);
  const [improvementError, setImprovementError] = useState<string | null>(null);

  // State for selected month and year
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      '0'
    )}`;
  });

  // Function to generate month options (last 12 months + next 6 months)
  const getMonthOptions = () => {
    const options = [];
    const now = new Date();

    // Generate months from 12 months ago to 6 months in the future
    for (let i = -12; i <= 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const value = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}`;
      const label = date.toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      });
      options.push({ value, label });
    }

    return options;
  };

  // Function to get display text for selected month
  const getSelectedMonthDisplay = () => {
    const [year, month] = selectedMonth.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  // Fetch data based on selected month
  const fetchData = async (monthYear: string) => {
    const [year, month] = monthYear.split('-');
    const queryParams = new URLSearchParams({
      year,
      month,
    });

    try {
      // Fetch overview - only need total_spent now
      const overviewRes = await fetch(
        `/api/analytics/financial_overview?${queryParams}`
      );
      if (overviewRes.ok) {
        const overviewData = await overviewRes.json();
        setOverview({
          total_spent: overviewData.total_spent,
        });
      }
    } catch (error) {
      console.error('Failed to fetch financial overview:', error);
    }

    try {
      // Fetch improvements
      setImprovementLoading(true);
      setImprovementError(null);
      const improvementsRes = await fetch(
        `/api/analytics/improvement_areas?${queryParams}`
      );
      if (!improvementsRes.ok) {
        throw new Error(`Error: ${improvementsRes.statusText}`);
      }
      const improvementsData: Improvement[] = await improvementsRes.json();
      setImprovements(improvementsData);
    } catch (error: any) {
      setImprovementError(error.message || 'Failed to fetch improvements');
    } finally {
      setImprovementLoading(false);
    }
  };

  // Effect to fetch data when selected month changes
  useEffect(() => {
    fetchData(selectedMonth);
  }, [selectedMonth]);

  // Handle month change
  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20">
      <div className="max-w-7xl mx-auto py-8 px-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track your financial insights and spending patterns
            </p>
          </div>

          {/* Month Selector */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/40 px-4 py-2 rounded-full font-medium border border-blue-200 dark:border-blue-800">
              <IconCalendar size={16} />
              {getSelectedMonthDisplay()}
            </div>

            <Select value={selectedMonth} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-10 h-10 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                <IconActivity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </SelectTrigger>
              <SelectContent align="end" className="w-52">
                {getMonthOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Enhanced Overview Card */}
        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 dark:from-blue-800 dark:via-blue-900 dark:to-indigo-900">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>

          <CardContent className="relative p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <IconCurrencyRupee className="text-white" size={28} />
              </div>
              <div>
                <h3 className="text-white text-xl font-bold">Total Spending</h3>
                <p className="text-white/80 text-sm">
                  Your expenses for {getSelectedMonthDisplay()}
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">
                {overview?.total_spent !== undefined ? (
                  `Rp ${overview.total_spent.toLocaleString()}`
                ) : (
                  <div className="flex items-center justify-center">
                    <div className="animate-pulse">Loading...</div>
                  </div>
                )}
              </div>
              <div className="text-white/70 text-sm">
                Financial activity this month
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Improvement Areas - Takes 1 column */}
          <Card className="border border-blue-100 dark:border-blue-900/50 shadow-lg backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
            <CardHeader className="border-b border-blue-100 dark:border-blue-900/50 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                  <IconTrendingUp
                    className="text-blue-600 dark:text-blue-400"
                    size={18}
                  />
                </div>
                Improvement Areas
              </CardTitle>
              <CardDescription className="text-blue-700 dark:text-blue-300">
                AI-powered spending insights
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {improvementLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : improvementError ? (
                <div className="text-center py-8">
                  <p className="text-red-500 dark:text-red-400 text-sm">
                    {improvementError}
                  </p>
                </div>
              ) : (
                <ImprovementCard
                  improvements={improvements.map((item) => ({
                    category: item.category,
                    message: item.change,
                    action: item.tip,
                  }))}
                />
              )}
            </CardContent>
          </Card>

          {/* Expense Chart - Takes 2 columns */}
          <Card className="xl:col-span-2 border border-blue-100 dark:border-blue-900/50 shadow-lg backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
            <CardHeader className="border-b border-blue-100 dark:border-blue-900/50 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                  <IconChartPie
                    className="text-blue-600 dark:text-blue-400"
                    size={18}
                  />
                </div>
                Expense Breakdown
              </CardTitle>
              <CardDescription className="text-blue-700 dark:text-blue-300">
                Visual breakdown of your spending categories
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <ExpenseChart selectedMonth={selectedMonth} />
            </CardContent>
          </Card>
        </div>

        {/* AI Assistant - Full Width */}
        <Card className="border border-blue-100 dark:border-blue-900/50 shadow-lg backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
          <CardHeader className="border-b border-blue-100 dark:border-blue-900/50 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                <IconRobot
                  className="text-blue-600 dark:text-blue-400"
                  size={18}
                />
              </div>
              AI Financial Assistant
            </CardTitle>
            <CardDescription className="text-blue-700 dark:text-blue-300">
              Get personalized financial advice and insights
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ReportQuery />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
