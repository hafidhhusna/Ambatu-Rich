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
    <div className="space-y-6 max-w-7xl mx-auto py-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold tracking-tight">Record Expense</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/user')}
          className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center gap-1"
        >
          <IconArrowLeft size={16} />
          Back to Dashboard
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left side - illustration/information */}
        <div className="md:w-1/3 space-y-6">
          <Card className="border-blue-100 dark:border-blue-900 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 overflow-hidden shadow-lg">
            <CardContent className="p-8">
              <div className="flex justify-center mb-6">
                <div className="p-2.5 bg-white/20 dark:bg-white/10 rounded-full">
                  <IconReceipt size={28} className="text-white" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-center mb-4 text-white">
                Track Your Spending
              </h2>
              <p className="text-white/80 leading-relaxed text-center">
                Recording your expenses is the first step toward better
                financial management. Add details about your purchase to build
                your spending history.
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-100 dark:border-blue-900 shadow-md overflow-hidden">
            <CardHeader className="pb-2 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardTitle className="text-blue-800 dark:text-blue-300 text-lg flex items-center gap-2.5">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                  <IconCoin
                    className="text-blue-600 dark:text-blue-400"
                    size={16}
                  />
                </div>
                Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white dark:bg-gray-900">
              <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 dark:text-blue-400 font-medium">
                    •
                  </span>
                  <span>Add receipts to keep track of important purchases</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 dark:text-blue-400 font-medium">
                    •
                  </span>
                  <span>
                    Categorize properly to analyze your spending habits
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 dark:text-blue-400 font-medium">
                    •
                  </span>
                  <span>Record expenses promptly for accurate tracking</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right side - form */}
        <Card className="md:w-2/3 border-blue-100 dark:border-blue-900 shadow-md overflow-hidden">
          <CardHeader className="pb-2 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardTitle className="text-blue-800 dark:text-blue-300 text-lg">
              Record New Expense
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Fill in the details of your transaction below
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 bg-white dark:bg-gray-900">
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
