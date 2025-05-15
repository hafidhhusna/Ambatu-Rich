'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  IconUsers,
  IconHeart,
  IconActivity,
  IconArrowRight,
  IconCalendar,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { ExpenseTable, Expense } from '@/components/expense-table';

type Plan = {
  id: string;
  budget: number;
  date_range: string;
  ai_note?: string;
  used?: number;
};

export default function UserPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    const sampleExpenses = async () => {
      try {
        const res = await fetch('api/struk');
        if (!res.ok) {
          throw new Error('Error Fetching Data');
        }
        const data = await res.json();
        const formattedData = data.map((item: any) => ({
          id: item.id,
          type: item.type,
          amount: item.amount,
          date: item.uploadedAt,
        }));
        setExpenses(formattedData);
      } catch (error: any) {
        setError(error.message || 'Terjadi Kesalahan');
      } finally {
        setLoading(false);
      }
    };

    const fetchPlans = async () => {
      try {
        const res = await fetch('/api/planner/get_plans');
        if (!res.ok) throw new Error('Failed to fetch plans');
        const data = await res.json();
        setPlans(data);
      } catch (e) {
        console.error('Error fetching plans:', e);
      }
    };

    sampleExpenses();
    fetchPlans();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-6 px-6 md:px-0 w-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <div className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-4 py-1.5 rounded-full font-medium">
          May 2025
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 p-8 text-white relative overflow-hidden rounded-xl">
        <div className="relative z-10">
          <p className="text-sm text-white/80">Welcome to Ambatu Rich</p>
          <h1 className="text-3xl font-bold mt-1">
            Lorem Ipsum Dolor Sit Amet
          </h1>

          <Button className="mt-6 bg-white text-blue-700 hover:bg-white/90 rounded-full">
            Join Now
          </Button>
        </div>

        {/* Decorative elements */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 flex items-center justify-center">
          <div className="w-64 h-64 rounded-full bg-white/10 absolute"></div>
          <div className="w-32 h-32 rounded-full bg-white/10 absolute -bottom-10 right-10"></div>
        </div>
      </div>

      {/* Plan Section */}
      <Card className="border-blue-100 dark:border-blue-900 shadow-md overflow-hidden w-full">
        <CardHeader className="bg-gradient-to-r from-blue-600/5 to-indigo-600/5 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardTitle className="text-blue-800 dark:text-blue-300 text-lg flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-full">
              <IconCalendar
                className="text-blue-600 dark:text-blue-400"
                size={16}
              />
            </div>
            Your Plan
          </CardTitle>
          <CardDescription>
            Track your financial planning progress
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 bg-white dark:bg-gray-900">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.length === 0 ? (
              <div className="text-blue-400 dark:text-blue-500 text-sm">
                No Plans Yet
              </div>
            ) : (
              plans.map((plan) => {
                const date = new Date(plan.date_range);
                const monthYear = date.toLocaleDateString('default', {
                  month: 'long',
                  year: 'numeric',
                });

                const used = plan.used ?? 0;
                const progress = Math.min((used / plan.budget) * 100, 100).toFixed(0);

                return (
                  <Card
                    key={plan.id}
                    className="relative group overflow-hidden border-blue-100 dark:border-blue-900 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
                  >
                    <div className="h-40 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                      <div className="text-blue-400 dark:text-blue-500 text-sm">
                        {used === 0 ? 'No Data Yet' : `Used: Rp${used.toLocaleString()}`}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center mb-2">
                        <div className="h-6 w-6 rounded-full bg-blue-100 text-xs flex items-center justify-center text-blue-600 dark:bg-blue-900 dark:text-blue-400 mr-2">
                          AI
                        </div>
                        <p className="font-medium text-blue-800 dark:text-blue-300">
                          Budget Plan for {monthYear}
                        </p>
                      </div>
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
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Expense History */}
      <Card className="border-blue-100 dark:border-blue-900 shadow-md overflow-hidden w-full">
        <CardHeader className="bg-gradient-to-r from-blue-600/5 to-indigo-600/5 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                <IconActivity
                  className="text-blue-600 dark:text-blue-400"
                  size={16}
                />
              </div>
              <div>
                <CardTitle className="text-blue-800 dark:text-blue-300 text-lg">
                  Expense History
                </CardTitle>
                <CardDescription>
                  Your recent expense transactions
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={() => (window.location.href = '/user/upload')}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              Add Expense
              <IconArrowRight size={16} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 bg-white dark:bg-gray-900">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              {error}
            </div>
          ) : (
            <ExpenseTable expenses={expenses} title="" description="" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
