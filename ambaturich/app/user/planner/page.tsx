'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { IconCalendar, IconChartBar } from '@tabler/icons-react';

type Plan = {
  id: string;
  budget: number;
  date_range: string;
  ai_note?: string;
  used?: number;
};

const UserProfile: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPlans = async () => {
      const res = await fetch('/api/planner/get_plans');
      const data = await res.json();
      setPlans(data);
    };

    fetchPlans();
  }, []);

  const goToPlannerWithMonth = (offset: number) => {
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    const formatted = target.toISOString().slice(0, 7); // YYYY-MM
    router.push(`/user/planner/add?month=${formatted}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-6 px-6 md:px-0 w-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold tracking-tight">AI Planner</h2>
        <div className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-4 py-1.5 rounded-full font-medium">
          May 2025
        </div>
      </div>

      {/* Planning Overview */}
      <Card className="border-blue-100 dark:border-blue-900 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 overflow-hidden shadow-lg w-full">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 dark:bg-white/10 rounded-full">
              <IconCalendar className="text-white" size={22} />
            </div>
            <div>
              <CardTitle className="text-white text-xl">Planning Overview</CardTitle>
              <CardDescription className="text-white/80 mt-1">
                Organize your financial goals and track progress
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
                    ? 'How to Improve This Month Expenses'
                    : 'How to Improve Future Expenses'}
                </p>
                <Button
                  className="mt-2 bg-white/20 hover:bg-white/30 text-white border-0"
                  onClick={() => goToPlannerWithMonth(index)} // 0 = this month, 1 = next month
                >
                  {label}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Plan Section */}
      <Card className="shadow-md overflow-hidden w-full">
        <CardHeader className="bg-gradient-to-r from-blue-600/5 to-indigo-600/5 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardTitle className="text-blue-800 dark:text-blue-300 text-lg flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-full">
              <IconChartBar className="text-blue-600 dark:text-blue-400" size={16} />
            </div>
            Current Plan
          </CardTitle>
        </CardHeader>
        <div className="p-6 bg-white dark:bg-gray-900">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const date = new Date(plan.date_range);
              const monthYear = date.toLocaleDateString('default', {
                month: 'long',
                year: 'numeric',
              });

              const used = plan.used ?? Math.floor(Math.random() * plan.budget);
              const progress = Math.min((used / plan.budget) * 100, 100).toFixed(0);

              return (
                <Card
                  key={plan.id}
                  className="border-blue-100 dark:border-blue-900 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
                >
                  <div className="h-40 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                    <div className="text-blue-400 dark:text-blue-500 text-sm">
                      {used === 0 ? 'No Data Yet' : `Used: Rp${used.toLocaleString()}`}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-blue-800 dark:text-blue-300">
                      Budget Plan for {monthYear}
                    </h4>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                      <div
                        className="bg-blue-600 dark:bg-blue-500 h-1.5 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Progress: {progress}%
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserProfile;
