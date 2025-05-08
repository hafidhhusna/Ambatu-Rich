'use client';

import React from 'react';
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
import { IconChartPie, IconTrendingUp, IconRobot } from '@tabler/icons-react';

const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto py-6 px-6 md:px-0 w-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Analytics Dashboard
        </h2>
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
              <CardTitle className="text-white text-xl">
                Financial Overview
              </CardTitle>
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
              <p className="text-white text-2xl font-bold">Rp 3,450,000</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white/70 text-sm mb-1">Monthly Budget</p>
              <p className="text-white text-2xl font-bold">Rp 5,000,000</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white/70 text-sm mb-1">Remaining</p>
              <p className="text-white text-2xl font-bold">Rp 1,550,000</p>
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
                <ImprovementCard />
              </div>
            </Card>

            {/* Expense Breakdown */}
            <Card className="border-blue-100 dark:border-blue-900 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 dark:from-blue-900/20 dark:to-indigo-900/20 overflow-hidden shadow-md h-full w-full">
              <CardHeader className="">
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
              <div className="p-6 flex items-center justify-center bg-white dark:bg-gray-900 ">
                <ExpenseChart />
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
