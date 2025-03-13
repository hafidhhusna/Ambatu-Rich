'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { UserSidebar } from '@/components/global/sidebar';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();

  // Authentication check - redirect if not authenticated
  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Desktop sidebar */}
      <div className="fixed inset-y-0 left-0 z-40 hidden md:block">
        <UserSidebar />
      </div>

      {/* Content area */}
      <div className="flex flex-col flex-grow min-h-screen">
        {/* Mobile sidebar/header - only shown on mobile */}
        <div className="block md:hidden">
          <UserSidebar />
        </div>

        {/* Main content with proper margin on desktop only */}
        <div className="flex-1 ml-0 md:ml-64">
          <main className="container px-4 py-4 md:py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
