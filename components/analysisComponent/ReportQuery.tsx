import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  IconSend,
  IconRobot,
  IconBulb,
  IconMessageCircle,
  IconLoader2,
  IconSparkles,
} from '@tabler/icons-react';

const suggestions = [
  'Why did my food expenses increase this month?',
  'What are some tips to reduce my monthly spending?',
  'How can I better manage my transportation costs?',
  'Show me patterns in my entertainment spending',
];

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
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div className="space-y-6">
      {/* AI Introduction */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-800">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/40 to-indigo-200/40 dark:from-blue-700/20 dark:to-indigo-700/20 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="relative p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <IconSparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                AI Financial Advisor
              </h3>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Powered by advanced analytics
              </p>
            </div>
          </div>
          <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
            Get personalized insights about your spending habits, budget
            optimization tips, and financial recommendations based on your data.
          </p>
        </div>
      </div>

      {/* Response Area */}
      <div className="space-y-4">
        <div className="min-h-[200px] max-h-[400px] overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="flex items-center gap-3">
                <IconLoader2 className="w-5 h-5 animate-spin text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  AI is thinking...
                </span>
              </div>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <IconMessageCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          ) : response ? (
            <div className="p-6">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <IconRobot className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                      {response}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconBulb className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Ask me anything about your finances!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Suggestions */}
      {!response && !loading && (
        <div className="space-y-3">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Quick Suggestions
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-left p-3 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="space-y-3">
        <Textarea
          placeholder="Type your question here... (e.g., How can I reduce my monthly expenses?)"
          className="min-h-[80px] border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 resize-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              handleSubmit();
            }
          }}
        />

        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Press Cmd+Enter to send quickly
          </p>
          <Button
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? (
              <IconLoader2 className="w-4 h-4 animate-spin" />
            ) : (
              <IconSend className="w-4 h-4" />
            )}
            {loading ? 'Sending...' : 'Ask AI'}
          </Button>
        </div>
      </div>
    </div>
  );
}
