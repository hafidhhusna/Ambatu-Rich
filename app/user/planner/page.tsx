'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { IconCalendar, IconChartBar } from '@tabler/icons-react';
import { MonthPicker } from '@/components/ui/month-picker';

const planItems = [
  { id: 1, title: 'Lorem Ipsum Dolor Sit Amet', progress: 70 },
  { id: 2, title: 'Lorem Ipsum Dolor Sit Amet', progress: 50 },
  { id: 3, title: 'Lorem Ipsum Dolor Sit Amet', progress: 40 },
  { id: 4, title: 'Lorem Ipsum Dolor Sit Amet', progress: 60 },
  { id: 5, title: 'Lorem Ipsum Dolor Sit Amet', progress: 80 },
  { id: 6, title: 'Lorem Ipsum Dolor Sit Amet', progress: 90 },
];

const UserProfile: React.FC = () => {
  // State for selected month and year
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      '0'
    )}`;
  });

  // Function to get display text for selected month
  const getSelectedMonthDisplay = () => {
    const [year, month] = selectedMonth.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  // Handle month change
  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
    // Here you can add logic to fetch data for the selected month
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-6 px-6 md:px-0 w-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold tracking-tight">AI Planner</h2>

        {/* Month Picker */}
        <MonthPicker
          selectedMonth={selectedMonth}
          onMonthChange={handleMonthChange}
        />
      </div>

      {/* Overview Card */}
      <Card className="border-blue-100 dark:border-blue-900 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 overflow-hidden shadow-lg w-full">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 dark:bg-white/10 rounded-full">
              <IconCalendar className="text-white" size={22} />
            </div>
            <div>
              <CardTitle className="text-white text-xl">
                Planning Overview
              </CardTitle>
              <CardDescription className="text-white/80 mt-1">
                Organize your financial goals and track progress for{' '}
                {getSelectedMonthDisplay()}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Plan This Month', 'Plan Ahead'].map((label, index) => (
              <div key={index} className="bg-white/10 rounded-lg p-4">
                <p className="text-white/70 text-sm mb-1">
                  {index === 0 ? 'Current Month Planning' : 'Future Planning'}
                </p>
                <p className="text-white text-lg font-medium mb-2">
                  {index === 0
                    ? `How to Improve ${getSelectedMonthDisplay()} Expenses`
                    : 'How to Improve Future Expenses'}
                </p>
                <Button className="mt-2 bg-white/20 hover:bg-white/30 text-white border-0">
                  {label}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Your Plan Section */}
      <div className="flex-1 w-full">
        <div className="flex flex-col gap-8 mt-8 w-full">
          <Card className="border-blue-100 dark:border-blue-900 shadow-md overflow-hidden w-full">
            <CardHeader className="bg-gradient-to-r from-blue-600/5 to-indigo-600/5 dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardTitle className="text-blue-800 dark:text-blue-300 text-lg flex items-center gap-2.5">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                  <IconChartBar
                    className="text-blue-600 dark:text-blue-400"
                    size={16}
                  />
                </div>
                Current Plan
              </CardTitle>
            </CardHeader>
            <div className="p-6 bg-white dark:bg-gray-900">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {planItems.map((item) => (
                  <Card
                    key={item.id}
                    className="border-blue-100 dark:border-blue-900 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
                  >
                    <div className="h-40 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                      <div className="text-blue-400 dark:text-blue-500 text-sm">
                        No Data Yet
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-medium text-blue-800 dark:text-blue-300">
                        {item.title}
                      </h4>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                        <div
                          className="bg-blue-600 dark:bg-blue-500 h-1.5 rounded-full"
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Progress: {item.progress}%
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
