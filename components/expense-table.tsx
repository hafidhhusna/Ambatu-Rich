'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export type Expense = {
  id: string;
  type: string;
  amount: number;
  date: string;
  name?: string;
};

interface ExpenseTableProps {
  expenses: Expense[];
  title?: string;
  description?: string;
}

export function ExpenseTable({
  expenses,
  title = 'Expense History',
  description = 'Recent expense transactions',
}: ExpenseTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <div className="flex justify-center py-6 text-muted-foreground">
            No expense history found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">
                    {expense.name || 'Unnamed Expense'}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {expense.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                    }).format(expense.amount)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {new Date(expense.date).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
