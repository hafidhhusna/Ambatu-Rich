import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
export function ReportQuery() {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Ask About Your Report
      </h2>
      <Textarea placeholder="Type your question here..." className="mt-3" />
      <Button className="mt-3 w-full">Submit</Button>
    </div>
  );
}