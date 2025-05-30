'use client';

import React from 'react';

export function DashboardPlan() {
    return (
        <div>
            {/* Welcome Section */}
            <div className="bg-blue-900 text-white p-6 rounded-lg shadow-md flex flex-col gap-4 bg-[url('/images/dashboardCard.svg')] bg-cover bg-no-repeat bg-center">

                {/* Smaller "HELLO," and bold "MOFID" */}
                <h2 className="text-sm font-medium">
                    HELLO, <span className="font-bold">MOFID</span>
                </h2>

                {/* Bigger "Lorem Ipsum Dolor Sit Amet" */}
                <h3 className="text-3xl font-bold">
                    Lorem Ipsum Dolor Sit Amet
                </h3>

                {/* Join Now Button */}
                <button className="px-2 py-1 bg-white text-blue-900 rounded-lg font-semibold text-sm inline-flex items-center gap-1 w-fit">
                    Join Now ⏩
                </button>
            </div>


            {/* Your Plan Section */}
            <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Plan</h2>

                {/* Plan Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((_, index) => (
                        <div key={index} className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                            {/* "AI" Tag */}
                            <div className="absolute top-2 left-2 bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded-md">
                                AI
                            </div>

                            {/* Placeholder for Dark Image */}
                            <div className="bg-gray-900 h-36 rounded-md"></div>

                            {/* Plan Name */}
                            <p className="mt-2 text-gray-800 dark:text-white font-medium">
                                Lorem Ipsum Dolor Sit Amet
                            </p>

                            {/* Progress Bar */}
                            <div className="w-full h-1.5 bg-gray-300 rounded-full mt-2">
                                <div className="w-1/2 h-full bg-purple-500 rounded-full"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
