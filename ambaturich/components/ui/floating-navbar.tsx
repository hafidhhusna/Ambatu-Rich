'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { IconLogout, IconDashboard } from '@tabler/icons-react';
import { NavItem } from '@/types/types';
import { Logo } from './logo';

export const FloatingNav = ({
  navItems,
  className,
  isLoggedIn = false,
  onLogout,
  onDashboard,
  showDashboard = false,
}: {
  navItems: NavItem[];
  className?: string;
  isLoggedIn?: boolean;
  onLogout?: () => void;
  onDashboard?: () => void;
  showDashboard?: boolean;
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Add SSR guard
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-4 left-0 right-0 flex justify-center items-center z-50">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex items-center justify-between rounded-full border ${
          isScrolled
            ? 'border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-950/70 backdrop-blur-md'
            : 'border-gray-200/30 dark:border-gray-800/30 bg-white/30 dark:bg-gray-950/30 backdrop-blur-sm'
        } px-4 sm:px-5 py-3 sm:py-2 shadow-lg ${
          isScrolled ? 'opacity-95' : 'opacity-85 hover:opacity-95'
        } ${className} max-w-3xl mx-auto transition-all duration-300`}
      >
        {/* Logo section */}
        <div className="flex items-center gap-2 mr-3">
          <Logo variant="icon-only" size="sm" />
          <span className="font-semibold text-[#070f18] hidden md:block dark:text-white text-sm">
            Ambatu Rich
          </span>
        </div>

        {/* Navigation links */}
        <div className="flex items-center space-x-2 sm:space-x-2">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.path}
              className={`flex items-center space-x-1 rounded-full px-3 py-2 sm:px-2 sm:py-1 text-xs sm:text-sm min-h-[36px] sm:min-h-0 transition-colors ${
                pathname === item.path
                  ? 'bg-gray-200/80 text-black font-medium dark:bg-gray-800/80 dark:text-white'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
              }`}
            >
              {item.icon && <span className="inline-block">{item.icon}</span>}
              <span className="hidden sm:inline">{item.menu}</span>
            </Link>
          ))}
        </div>

        {/* Right section: Theme toggle and Sign in/Dashboard */}
        <div className="ml-3 flex items-center space-x-2">
          <ThemeToggle mode="toggle" />

          {showDashboard ? (
            <Button
              className="rounded-full bg-blue-100/80 hover:bg-blue-200 text-blue-700 px-3 py-2 sm:py-1 text-xs sm:text-sm h-auto min-h-[36px] sm:min-h-0 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 flex items-center gap-1"
              onClick={onDashboard}
            >
              <IconDashboard className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          ) : !isLoggedIn ? (
            <Button
              className="rounded-full bg-gray-200/80 hover:bg-gray-300 text-[#070f18] px-3 py-2 sm:py-1 text-xs sm:text-sm h-auto min-h-[36px] sm:min-h-0 dark:bg-gray-800/80 dark:text-white dark:hover:bg-gray-700"
              onClick={() => {
                router.push('/auth/signin');
              }}
            >
              <span>Sign In</span>
            </Button>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
};
