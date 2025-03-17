'use client';

import React from 'react';
import { FeatureSidebar } from '@/components/global/featurebar';
import { AnalysisHeader } from '@/components/analysisComponent/AnalysisHeader';
import { ExpenseChart } from '@/components/analysisComponent/ExpenseChart';
import { ImprovementCard } from '@/components/analysisComponent/ImprovementCard';
import { ReportQuery } from '@/components/analysisComponent/ReportQuery';

export default function AnalysisPage() {
  return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <FeatureSidebar />

        <div className="flex-1 p-6 md:p-10">
          {/* Page Header */}
          <AnalysisHeader />

          {/* Main Content */}
          <div className="flex flex-col gap-6 mt-6">
            <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow w-full flex justify-center">
              <ExpenseChart />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
              <ImprovementCard />
              <ReportQuery />
            </div>
          </div>
          
        </div>
      </div>
  );
}