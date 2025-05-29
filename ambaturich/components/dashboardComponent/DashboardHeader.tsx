import React from 'react';

export function DashboardHeader() {
  return (
    <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg p-2 w-full">
      {/* Search Icon (Just a Square for Now) */}
      <div className="w-6 h-6 bg-gray-400 rounded-md mr-2"></div>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search your expenses here..."
        className="flex-1 bg-transparent outline-none text-gray-700 dark:text-white"
      />

      {/* Filter Icon (Circle for Now) */}
      <div className="w-8 h-8 bg-gray-400 rounded-full ml-2"></div>
    </div>
  );
}
