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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ExpenseTable, Expense } from '@/components/expense-table';

export default function UserPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Fetch expenses based on selected month
  const fetchExpenses = async (monthYear: string) => {
    try {
      setLoading(true);
      setError(null);

      // Build URL with query parameters if month is selected
      let url = '/api/struk';
      if (monthYear) {
        const [year, month] = monthYear.split('-');
        const queryParams = new URLSearchParams({
          year,
          month,
        });
        url = `${url}?${queryParams}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error('Error fetching data');
      }
      const data = await res.json();
      const formattedData = data.map((item: any) => ({
        id: item.id,
        type: item.type,
        amount: item.amount,
        date: item.uploadedAt,
        name: item.name,
      }));
      setExpenses(formattedData);
    } catch (error: any) {
      setError(error.message || 'Terjadi Kesalahan');
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when selected month changes
  useEffect(() => {
    fetchExpenses(selectedMonth);
  }, [selectedMonth]);

  // Handle month change
  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-6 px-6 md:px-0 w-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
          Dashboard
        </h2>

        {/* Month Selector */}
        <div className="flex items-center gap-3">
          <div className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-4 py-1.5 rounded-full font-medium">
            {getSelectedMonthDisplay()}
          </div>

          <Select value={selectedMonth} onValueChange={handleMonthChange}>
            <SelectTrigger className="h-8 w-8 p-0 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 bg-background">
              <IconCalendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </SelectTrigger>
            <SelectContent align="end" className="w-48">
              {getMonthOptions().map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 p-8 text-white relative overflow-hidden rounded-xl">
        <div className="relative z-10">
          <p className="text-sm text-white/80">Welcome to Ambatu Rich</p>
          <h1 className="text-3xl font-bold mt-1">
            Semangat Mencapai Target Keuangan Anda
          </h1>
          <p className="text-sm text-white/60 mt-2">
            Viewing data for {getSelectedMonthDisplay()}
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 flex items-center justify-center">
          <div className="w-64 h-64 rounded-full bg-white/10 absolute"></div>
          <div className="w-32 h-32 rounded-full bg-white/10 absolute -bottom-10 right-10"></div>
        </div>
      </div>

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
                  Your expense transactions for {getSelectedMonthDisplay()}
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
