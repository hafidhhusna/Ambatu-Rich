'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Footer: React.FC = () => {
  const pathname = usePathname();

  // Don't render footer on user pages
  if (pathname?.startsWith('/user')) {
    return null;
  }

  return (
    <footer className="container mx-auto px-4 py-8 border-t border-gray-200 dark:border-gray-800">
      <div className="md:flex md:justify-between md:items-center">
        <div className="flex items-center justify-center md:justify-start gap-2 mb-6 md:mb-0">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-[#1f7cff]"></div>
            <div className="w-2 h-2 rounded-full bg-[#1f7cff]"></div>
          </div>
          <span className="font-semibold text-[#070f18] dark:text-white">
            Ambatu-Rich
          </span>
        </div>
        <div className="flex justify-center md:justify-start gap-8 text-sm text-gray-500 dark:text-gray-400">
          <span>Features</span>
          <span>Services</span>
          <span>Industries</span>
          <span>About</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
