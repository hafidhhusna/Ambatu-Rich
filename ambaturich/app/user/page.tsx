'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { IconUsers, IconHeart, IconActivity } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { ExpenseTable, Expense } from '@/components/expense-table';

const planItems = [
  { id: 1, title: 'Lorem Ipsum Dolor Sit Amet', progress: 70 },
  { id: 2, title: 'Lorem Ipsum Dolor Sit Amet', progress: 50 },
  { id: 3, title: 'Lorem Ipsum Dolor Sit Amet', progress: 40 },
];

// DUMMY DATA
const sampleExpenses: Expense[] = [
  { id: 'EXP001', type: 'Food', amount: 75000, date: '2025-03-10' },
  { id: 'EXP002', type: 'Transportation', amount: 50000, date: '2025-03-08' },
  { id: 'EXP003', type: 'Entertainment', amount: 150000, date: '2025-03-05' },
  { id: 'EXP004', type: 'Utilities', amount: 250000, date: '2025-03-01' },
  { id: 'EXP005', type: 'Shopping', amount: 400000, date: '2025-02-28' },
];

export default function UserPage() {
  // const { data: session, status } = useSession();

  // if (status === 'unauthenticated') {
  //   redirect('/auth/signin');
  // }

  // Show loading state
  // if (status === 'loading') {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
      </div>

      {/* Hero Section */}
      <div className="bg-indigo-900 p-8 text-white relative overflow-hidden rounded-xl mx-4">
        <div className="relative z-10">
          <p className="text-sm">
            {/* Welcome back, {session?.user?.name || 'USER'} */}
          </p>
          <h1 className="text-3xl font-bold mt-1">
            Lorem Ipsum Dolor Sit Amet
          </h1>

          <Button className="mt-6 bg-white text-indigo-900 hover:bg-white/90 rounded-full">
            Join Now
          </Button>
        </div>

        {/* Decorative elements */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 flex items-center justify-center">
          <div className="w-64 h-64 rounded-full bg-indigo-800/30 absolute"></div>
          <div className="w-32 h-32 rounded-full bg-indigo-700/30 absolute -bottom-10 right-10"></div>
        </div>
      </div>

      {/* Plan Section */}
      <div className="px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Your Plan</h2>
          <div className="flex gap-2"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {planItems.map((item) => (
            <Card key={item.id} className="relative group overflow-hidden">
              <div className="h-40 bg-gray-900 flex items-center justify-center">
                <div className="text-gray-600 text-xs">Belum ada bang</div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <div className="h-5 w-5 rounded bg-indigo-200 text-xs flex items-center justify-center text-indigo-600 mr-2">
                    AI
                  </div>
                  <p className="font-medium">{item.title}</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-indigo-600 h-1.5 rounded-full"
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* History data */}
      <div className="mt-8 px-4">
        <ExpenseTable
          expenses={sampleExpenses}
          title="Expense History"
          description="Your recent expense transactions"
        />
      </div>

      {/* Stats cards and other components commented out */}
    </div>
  );
}
