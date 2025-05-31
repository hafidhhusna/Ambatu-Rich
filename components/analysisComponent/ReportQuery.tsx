import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { IconSend, IconRobot } from '@tabler/icons-react';

export function ReportQuery() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!input.trim()) return;
    setLoading(true);
    setResponse('');
    setError(null);

    try {
      const res = await fetch('/api/analytics/ai_assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) {
        throw new Error('Failed to get AI response');
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let aiResponse = '';

      while (!done) {
        const { value, done: doneReading } = await reader!.read();
        done = doneReading;
        if (value) {
          aiResponse += decoder.decode(value);
          setResponse(aiResponse);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-blue-100 dark:bg-blue-800 p-1.5 rounded-full">
            <IconRobot size={16} className="text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
            AI Finance Assistant
          </p>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 ml-7">
          Ask me anything about your spending patterns, budget optimization, or
          saving tips!
        </p>
      </div>

      {/* Response shown above input */}
      <div className="whitespace-pre-wrap p-4 bg-white dark:bg-gray-900 rounded-md border border-gray-300 dark:border-gray-700 min-h-[100px]">
        {error && <p className="text-red-500">Error: {error}</p>}
        {!error && response && <>{response}</>}
        {!error && !response && !loading && (
          <p className="text-gray-500">
            Ask a question below to see a response.
          </p>
        )}
      </div>

      {/* Input area */}
      <Textarea
        placeholder="Example: Why did my food expenses increase this month?"
        className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 dark:border-blue-800 dark:focus:border-blue-600 dark:focus:ring-blue-600"
        rows={3}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={loading}
      />
      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white flex items-center justify-center gap-2"
        onClick={handleSubmit}
        disabled={loading}
      >
        <IconSend size={16} />
        {loading ? 'Loading...' : 'Ask Question'}
      </Button>
    </div>
  );
}
