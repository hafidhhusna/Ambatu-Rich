'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IconArrowLeft, IconReceipt, IconCoin } from '@tabler/icons-react';

const expenseTypes = [
  'Food & Drinks',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Health',
  'Education',
  'Other',
];

export default function UploadStrukPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    type: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    receipt: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTypeChange = (value: string) => {
    setFormData({
      ...formData,
      type: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        receipt: e.target.files[0],
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50/50 to-white dark:from-blue-950/20 dark:to-background">
      <div className="p-4 bg-white dark:bg-slate-900 shadow-sm">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/30"
        >
          <IconArrowLeft size={18} />
          Back to Dashboard
        </Button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6 p-6">
        {/* Left side - illustration/information */}
        <div className="md:w-1/3 space-y-6">
          <div className="bg-blue-600 dark:bg-blue-800 text-white p-8 rounded-xl shadow-lg">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-500 bg-opacity-30 dark:bg-blue-700/50 rounded-full">
                <IconReceipt size={48} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-4">
              Track Your Spending
            </h2>
            <p className="opacity-90 leading-relaxed">
              Recording your expenses is the first step toward better financial
              management. Add details about your purchase to build your spending
              history.
            </p>
          </div>

          <Card className="border-blue-100 bg-blue-50 shadow-sm dark:border-blue-900 dark:bg-blue-950/50">
            <CardContent className="p-6">
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                <IconCoin size={18} />
                Tips
              </h3>
              <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
                <li>• Add receipts to keep track of important purchases</li>
                <li>• Categorize properly to analyze your spending habits</li>
                <li>• Record expenses promptly for accurate tracking</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right side - form */}
        <Card className="md:w-2/3 border-none shadow-xl dark:shadow-blue-900/10">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white rounded-t-lg">
            <CardTitle className="text-2xl">Record New Expense</CardTitle>
            <CardDescription className="text-blue-100">
              Fill in the details of your transaction below
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="type"
                  className="text-blue-800 dark:text-blue-300"
                >
                  Expense Type
                </Label>
                <Select onValueChange={handleTypeChange}>
                  <SelectTrigger className="border-blue-200 focus:ring-blue-500 dark:border-blue-900 dark:focus:ring-blue-600">
                    <SelectValue placeholder="Select expense type" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="amount"
                  className="text-blue-800 dark:text-blue-300"
                >
                  Amount
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 dark:text-blue-400 font-medium">
                    Rp
                  </span>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    className="pl-10 border-blue-200 focus:ring-blue-500 dark:border-blue-800 dark:focus:ring-blue-600"
                    placeholder="0"
                    value={formData.amount}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="date"
                  className="text-blue-800 dark:text-blue-300"
                >
                  Date
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  className="border-blue-200 focus:ring-blue-500 dark:border-blue-800 dark:focus:ring-blue-600"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="receipt"
                  className="text-blue-800 dark:text-blue-300"
                >
                  Receipt Image (Optional)
                </Label>
                <div className="border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  <input
                    id="receipt"
                    name="receipt"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="receipt"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <IconReceipt
                      size={32}
                      className="text-blue-500 dark:text-blue-400 mb-2"
                    />
                    <span className="text-blue-700 dark:text-blue-300 font-medium">
                      {formData.receipt
                        ? formData.receipt.name
                        : 'Click to upload receipt image'}
                    </span>
                    <p className="text-xs text-blue-500 dark:text-blue-400 mt-2">
                      JPG, PNG, or other image formats
                    </p>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/30"
                  onClick={() => router.push('/user')}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  Save Expense
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
