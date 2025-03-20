'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const planItems = [
    { id: 1, title: 'Lorem Ipsum Dolor Sit Amet', progress: 70 },
    { id: 2, title: 'Lorem Ipsum Dolor Sit Amet', progress: 50 },
    { id: 3, title: 'Lorem Ipsum Dolor Sit Amet', progress: 40 },
    { id: 4, title: 'Lorem Ipsum Dolor Sit Amet', progress: 60 },
    { id: 5, title: 'Lorem Ipsum Dolor Sit Amet', progress: 80 },
    { id: 6, title: 'Lorem Ipsum Dolor Sit Amet', progress: 90 },
];

const UserProfile: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Title */}
            <h2 className="text-2xl font-bold tracking-tight">AI Planner</h2>

            {/* Two Feature Cards */}
            <div className="space-y-4">
                {["Plan This Month", "Plan Ahead"].map((label, index) => (
                    <Card key={index} className="bg-blue-50 dark:bg-gray-800 flex items-center p-4">
                        <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-lg mr-4"></div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                                {index === 0 ? "How to Improve This Month Expenses" : "How to Improve Future Expenses"}
                            </h3>
                            <Button className="mt-2 bg-blue-600 text-white dark:bg-blue-500 dark:text-white">{label}</Button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Your Plan Section */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Current Plan</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {planItems.map((item) => (
                        <Card key={item.id} className="relative group overflow-hidden">
                            <div className="h-40 bg-gray-900 flex items-center justify-center">
                                <div className="text-gray-600 text-xs">No Data Yet</div>
                            </div>
                            <CardContent className="p-4">
                                <h4 className="font-medium">{item.title}</h4>
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                    <div
                                        className="bg-indigo-600 h-1.5 rounded-full"
                                        style={{ width: `${item.progress}%` }}
                                    ></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
