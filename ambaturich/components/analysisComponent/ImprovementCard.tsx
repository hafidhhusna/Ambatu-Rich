import { IconArrowDownRight, IconChevronDown } from '@tabler/icons-react';
import { useState } from 'react';

interface Improvement {
  category: string;
  message: string;
  action: string;
}

export function ImprovementCard({ improvements }: { improvements: Improvement[] }) {
  const [showAll, setShowAll] = useState(false);

  const displayedImprovements = showAll ? improvements : improvements.slice(0, 2);
  const hasMoreImprovements = improvements.length > 2;

  return (
    <div className="space-y-4">
      {displayedImprovements.map((item, index) => (
        <div
          key={index}
          className="rounded-lg border border-blue-100 dark:border-blue-900 p-4 bg-blue-50/50 dark:bg-blue-900/20"
        >
          <div className="flex items-center gap-2 mb-1">
            <IconArrowDownRight
              size={18}
              className="text-blue-600 dark:text-blue-400"
            />
            <h3 className="font-medium text-blue-800 dark:text-blue-300">
              {item.category}
            </h3>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 ml-6 mb-1">
            {item.message}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 ml-6 font-medium">
            Tip: {item.action}
          </p>
        </div>
      ))}

      {hasMoreImprovements && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center justify-center w-full py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
        >
          <span>{showAll ? "Show less" : "Show more"}</span>
          <IconChevronDown
            size={16}
            className={`ml-1 transition-transform ${showAll ? "rotate-180" : ""}`}
          />
        </button>
      )}
    </div>
  );
}
