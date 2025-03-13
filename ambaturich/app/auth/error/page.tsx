'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import ErrorContent from './error-content';

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-950 p-4">
      <div className="max-w-md w-full mx-auto rounded-2xl p-4 md:p-8 bg-background border shadow-md dark:border-gray-800 dark:bg-gray-950 text-center">
        <h2 className="font-bold text-xl text-foreground dark:text-white mb-4">
          Authentication Error
        </h2>

        <Suspense fallback={<p className="my-6 text-muted-foreground dark:text-gray-400">Loading error details...</p>}>
          <ErrorContent />
        </Suspense>

        <div className="mt-8">
          <Link
            href="/auth/signin"
            className="bg-[#1A237E] text-white px-4 py-2 rounded-md hover:bg-[#3949AB] transition-colors"
          >
            Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
