'use client';

import React from 'react';
import { FeatureSidebar } from '@/components/global/featurebar';
import { DashboardHeader } from '@/components/dashboardComponent/DashboardHeader';
import { DashboardPlan } from '@/components/dashboardComponent/DashboardPlan';
import { DashboardHistory } from '@/components/dashboardComponent/DashboardHistory';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <FeatureSidebar />

      <div className="flex-1 p-6 md:p-10">
        {/* Search Bar */}
        <DashboardHeader />

        {/* Main Content */}
        <div className="flex flex-col gap-6 mt-6">
          {/* Featured Section */}
          <DashboardPlan />
          
          {/* Expense History Table */}
          <DashboardHistory />
        </div>
      </div>
    </div>
  );
}
