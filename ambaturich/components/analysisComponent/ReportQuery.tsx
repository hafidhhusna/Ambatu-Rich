import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { IconSend, IconRobot } from '@tabler/icons-react';

export function ReportQuery() {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-blue-100 dark:bg-blue-800 p-1.5 rounded-full">
            <IconRobot size={16} className="text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-sm font-medium text-blue-800 dark:text-blue-300">AI Finance Assistant</p>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 ml-7">
          Ask me anything about your spending patterns, budget optimization, or saving tips!
        </p>
      </div>

      <div className="space-y-2">
        <Textarea 
          placeholder="Example: Why did my food expenses increase this month?" 
          className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 dark:border-blue-800 dark:focus:border-blue-600 dark:focus:ring-blue-600"
          rows={3}
        />
        <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white flex items-center justify-center gap-2">
          <IconSend size={16} />
          Ask Question
        </Button>
      </div>
    </div>
  );
}