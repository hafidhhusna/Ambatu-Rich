'use client';

import React from 'react';
import { IconCalendar } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MonthPickerProps {
  selectedMonth: string;
  onMonthChange: (value: string) => void;
  className?: string;
  showLabel?: boolean;
}

export function MonthPicker({
  selectedMonth,
  onMonthChange,
  className = '',
  showLabel = true,
}: MonthPickerProps) {
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

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showLabel && (
        <div className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-4 py-1.5 rounded-full font-medium">
          {getSelectedMonthDisplay()}
        </div>
      )}

      <Select value={selectedMonth} onValueChange={onMonthChange}>
        <SelectTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            title="Select month"
          >
            <IconCalendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </Button>
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
  );
}
