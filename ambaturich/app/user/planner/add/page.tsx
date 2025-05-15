'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRouter, useSearchParams } from 'next/navigation';

const UserProfile: React.FC = () => {
  const [budget, setBudget] = useState<number>(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [aiNote, setAiNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Read start and end dates from query parameters if available
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    if (start) setStartDate(start);
    if (end) setEndDate(end);
  }, [searchParams]);

  // Helper to convert yyyy-mm-dd to dd/mm/yyyy for display
  const formatDateForDisplay = (isoDate: string) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage(null);

    try {
      // Simple validation for date range
      if (!startDate || !endDate) {
        setMessage('❌ Please select both start and end dates');
        setLoading(false);
        return;
      }

      if (startDate > endDate) {
        setMessage('❌ Start date cannot be after end date');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/planner/add_budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budget,
          date_range: `${startDate} to ${endDate}`, // send range as string
          ai_note: aiNote,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setMessage('✅ Plan created successfully!');
      router.push('/user/planner'); // Redirect after success
    } catch (error: any) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Add a Plan</h2>
        <Card className="p-6 mt-4 bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-full">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Plan Ahead</h3>
          <div className="grid grid-cols-1 gap-4 mt-4">
            <Label>
              Budget
              <Input
                type="number"
                className="mt-1"
                placeholder="Enter budget"
                value={budget}
                onChange={(e) => setBudget(parseFloat(e.target.value))}
              />
            </Label>
            <Label>
              Start Date
              <Input
                type="date"
                className="mt-1"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Label>
            <Label>
              End Date
              <Input
                type="date"
                className="mt-1"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Label>
            <Label>
              Choose a Plan
              <select className="mt-1 w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                <option value="basic">Basic</option>
                <option value="premium">Premium</option>
              </select>
            </Label>
            <Label>
              Add Note for The AI
              <Textarea
                className="mt-1"
                placeholder="Enter additional notes..."
                value={aiNote}
                onChange={(e) => setAiNote(e.target.value)}
              />
            </Label>
          </div>
          <Button
            className="mt-4 w-full bg-blue-600 text-white dark:bg-blue-500 dark:text-white"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Planning...' : 'Plan Ahead'}
          </Button>
          {message && (
            <p className="mt-3 text-center text-sm text-gray-700 dark:text-gray-300">{message}</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
