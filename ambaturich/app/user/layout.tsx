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
  // const { status } = useSession();

  // // Authentication check - redirect if not authenticated
  // if (status === 'unauthenticated') {
  //   redirect('/auth/signin');
  // }

  // // Show loading state
  // if (status === 'loading') {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <UserSidebar />

      <div className="flex-1 pt-0 md:pt-4">
        <main className="container px-4 py-4 md:py-6">{children}</main>
      </div>
    </div>
  );
}
