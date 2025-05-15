'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { IconChartPie, IconTrendingUp, IconRobot } from '@tabler/icons-react';
import { ReportQuery } from '@/components/analysisComponent/ReportQuery';

const AnalyticsPage: React.FC = () => {
  const [overview, setOverview] = useState<{
    total_budget: number;
    total_spent: number;
    remaining_budget: number;
  } | null>(null);

  // Improvement areas state
  const [improvements, setImprovements] = useState<
    { category: string; change: string; tip: string }[]
  >([]);
  const [improvementLoading, setImprovementLoading] = useState(true);
  const [improvementError, setImprovementError] = useState<string | null>(null);

  // Expense breakdown state
  const [expenses, setExpenses] = useState<
    { type: string; amount: number; percentage: number }[]
  >([]);
  const [expenseLoading, setExpenseLoading] = useState(true);
  const [expenseError, setExpenseError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch overview
    const fetchOverview = async () => {
      try {
        const res = await fetch('/api/analytics/financial_overview');
        const data = await res.json();
        setOverview({
          total_budget: data.total_budget,
          total_spent: data.total_spent,
          remaining_budget: data.remaining_budget,
        });
      } catch (error) {
        console.error('Failed to fetch financial overview:', error);
      }
    };

    // Fetch improvements
    const fetchImprovements = async () => {
      try {
        const res = await fetch('/api/analytics/improvement_areas');
        if (!res.ok) throw new Error('Failed to fetch improvement areas');
        const data = await res.json();
        setImprovements(data);
      } catch (err: any) {
        setImprovementError(err.message || 'Unknown error');
      } finally {
        setImprovementLoading(false);
      }
    };

    // Fetch expenses
    const fetchExpenses = async () => {
      try {
        const res = await fetch('/api/analytics/expense_breakdown');
        if (!res.ok) throw new Error('Failed to fetch expense breakdown');
        const data = await res.json();
        setExpenses(data);
      } catch (err: any) {
        setExpenseError(err.message || 'Unknown error');
      } finally {
        setExpenseLoading(false);
      }
    };

    fetchOverview();
    fetchImprovements();
    fetchExpenses();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-6 px-6 md:px-0 w-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h2>
        <div className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-4 py-1.5 rounded-full font-medium">
          May 2025
        </div>
      </div>

      {/* Overview Card */}
      <Card className="border-blue-100 dark:border-blue-900 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 overflow-hidden shadow-lg w-full">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 dark:bg-white/10 rounded-full">
              <IconTrendingUp className="text-white" size={22} />
            </div>
            <div>
              <CardTitle className="text-white text-xl">Financial Overview</CardTitle>
              <CardDescription className="text-white/80 mt-1">
                Your spending patterns and insights
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white/70 text-sm mb-1">Total Spending</p>
              <p className="text-white text-2xl font-bold">
                {overview?.total_spent !== undefined
                  ? `Rp ${overview.total_spent.toLocaleString()}`
                  : 'Loading...'}
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white/70 text-sm mb-1">Monthly Budget</p>
              <p className="text-white text-2xl font-bold">
                {overview?.total_budget !== undefined
                  ? `Rp ${overview.total_budget.toLocaleString()}`
                  : 'Loading...'}
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white/70 text-sm mb-1">Remaining</p>
              <p className="text-white text-2xl font-bold">
                {overview?.remaining_budget !== undefined
                  ? `Rp ${overview.remaining_budget.toLocaleString()}`
                  : 'Loading...'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex-1 w-full">
        {/* Main Content */}
        <div className="flex flex-col gap-8 mt-8 w-full">
          {/* Two Column Layout - Improvement Areas and Expense Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
            {/* Improvement Areas */}
            <Card className="border-blue-100 dark:border-blue-900 shadow-md overflow-hidden w-full">
              <CardHeader className="bg-gradient-to-r from-blue-600/5 to-indigo-600/5 dark:from-blue-900/20 dark:to-indigo-900/20">
                <CardTitle className="text-blue-800 dark:text-blue-300 text-lg flex items-center gap-2.5">
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                    <IconTrendingUp
                      className="text-blue-600 dark:text-blue-400"
                      size={16}
                    />
                  </div>
                  Improvement Areas
                </CardTitle>
              </CardHeader>
              <div className="p-6 bg-white dark:bg-gray-900">
                {improvementLoading ? (
                  <p>Loading improvement areas...</p>
                ) : improvementError ? (
                  <p className="text-red-500">Error: {improvementError}</p>
                ) : improvements.length === 0 ? (
                  <p>No improvement areas found.</p>
                ) : (
                  improvements.map(({ category, change, tip }) => (
                    <div
                      key={category}
                      className="border border-gray-300 dark:border-gray-700 rounded-md p-4 mb-4"
                    >
                      <h4 className="text-blue-600 dark:text-blue-400 font-semibold mb-1">
                        {category}
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300">{change}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Tip: {tip}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Expense Breakdown */}
            <Card className="border-blue-100 dark:border-blue-900 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 dark:from-blue-900/20 dark:to-indigo-900/20 overflow-hidden shadow-md h-full w-full">
              <CardHeader>
                <CardTitle className="text-blue-800 dark:text-blue-300 text-lg flex items-center gap-2.5">
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                    <IconChartPie
                      className="text-blue-600 dark:text-blue-400"
                      size={16}
                    />
                  </div>
                  Expense Breakdown
                </CardTitle>
              </CardHeader>
              <div className="p-6 flex flex-col bg-white dark:bg-gray-900 rounded-md">
                {expenseLoading ? (
                  <p>Loading expense breakdown...</p>
                ) : expenseError ? (
                  <p className="text-red-500">Error: {expenseError}</p>
                ) : expenses.length === 0 ? (
                  <p>No expenses data found.</p>
                ) : (
                  <ul className="w-full max-w-md text-gray-700 dark:text-gray-300">
                    {expenses.map(({ type, amount, percentage }) => (
                      <li
                        key={type}
                        className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700"
                      >
                        <span>{type}</span>
                        <span>
                          Rp {amount.toLocaleString()} ({percentage}%)
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Card>
          </div>

          {/* Full Width AI Assistant */}
          <Card className="border-blue-100 dark:border-blue-900 shadow-md overflow-hidden w-full">
            <CardHeader className="pb-2 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardTitle className="text-blue-800 dark:text-blue-300 text-lg flex items-center gap-2.5">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                  <IconRobot
                    className="text-blue-600 dark:text-blue-400"
                    size={16}
                  />
                </div>
                Ask AI Assistant
              </CardTitle>
            </CardHeader>
            <div className="p-6 bg-white dark:bg-gray-900">
              <ReportQuery />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
