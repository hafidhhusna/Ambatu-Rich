import {
  IconArrowDownRight,
  IconChevronDown,
  IconBulb,
  IconTarget,
  IconTrendingUp,
  IconAlertTriangle,
} from '@tabler/icons-react';
import { useState } from 'react';

interface Improvement {
  category: string;
  message: string;
  action: string;
}

const getCategoryIcon = (category: string) => {
  const lowerCategory = category.toLowerCase();
  if (lowerCategory.includes('food') || lowerCategory.includes('makanan')) {
    return '🍽️';
  } else if (
    lowerCategory.includes('transport') ||
    lowerCategory.includes('transportasi')
  ) {
    return '🚗';
  } else if (
    lowerCategory.includes('shopping') ||
    lowerCategory.includes('belanja')
  ) {
    return '🛍️';
  } else if (
    lowerCategory.includes('entertainment') ||
    lowerCategory.includes('hiburan')
  ) {
    return '🎬';
  } else if (
    lowerCategory.includes('health') ||
    lowerCategory.includes('kesehatan')
  ) {
    return '🏥';
  } else if (
    lowerCategory.includes('education') ||
    lowerCategory.includes('pendidikan')
  ) {
    return '📚';
  }
  return '💰';
};

const getCategoryColor = (index: number) => {
  const colors = [
    'from-blue-500 to-blue-600',
    'from-emerald-500 to-emerald-600',
    'from-amber-500 to-amber-600',
    'from-purple-500 to-purple-600',
    'from-rose-500 to-rose-600',
    'from-cyan-500 to-cyan-600',
  ];
  return colors[index % colors.length];
};

export function ImprovementCard({
  improvements,
}: {
  improvements: Improvement[];
}) {
  const [showAll, setShowAll] = useState(false);

  const displayedImprovements = showAll
    ? improvements
    : improvements.slice(0, 3);
  const hasMoreImprovements = improvements.length > 3;

  if (improvements.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
          <IconTarget className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-gray-900 dark:text-gray-100 font-medium mb-2">
          Great job!
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          No improvement areas detected this month.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayedImprovements.map((item, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-lg transition-all duration-300"
        >
          {/* Gradient accent */}
          <div
            className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${getCategoryColor(
              index
            )}`}
          ></div>

          <div className="p-5 pl-6">
            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 flex items-center justify-center text-lg">
                  {getCategoryIcon(item.category)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1 flex items-center gap-2">
                  {item.category}
                  <IconTrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {item.message}
                </p>
              </div>
            </div>

            {/* Action tip */}
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 border border-blue-100 dark:border-blue-800">
              <div className="flex items-start gap-2">
                <IconBulb className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-blue-800 dark:text-blue-300 mb-1">
                    💡 Smart Tip
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                    {item.action}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {hasMoreImprovements && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg border border-blue-200 dark:border-blue-800 transition-colors"
        >
          <span>
            {showAll
              ? 'Show less insights'
              : `Show ${improvements.length - 3} more insights`}
          </span>
          <IconChevronDown
            size={16}
            className={`transition-transform duration-200 ${
              showAll ? 'rotate-180' : ''
            }`}
          />
        </button>
      )}
    </div>
  );
}
