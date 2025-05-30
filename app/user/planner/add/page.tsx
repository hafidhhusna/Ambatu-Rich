'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';


const UserProfile: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Your Plan Section */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Add a Plan</h2>
                <Card className="p-6 mt-4 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Plan Ahead</h3>
                    <div className="grid grid-cols-1 gap-4 mt-4">
                        <Label>
                            Budget
                            <Input className="mt-1" placeholder="Enter budget" />
                        </Label>
                        <Label>
                            Date Range
                            <Input className="mt-1" type="date" />
                        </Label>
                        <Label>
                            Choose a Plan
                            <select className="mt-1 w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                                <option value="basic">Basic</option>
                                <option value="premium">Premium</option>
                            </select>
                        </Label>
                        <Label>
                            Add Note for The AI
                            <Textarea className="mt-1" placeholder="Enter additional notes..." />
                        </Label>
                    </div>
                    <Button className="mt-4 w-full bg-blue-600 text-white dark:bg-blue-500 dark:text-white">Plan Ahead</Button>
                </Card>
            </div>
        </div>
    );
};

export default UserProfile;
