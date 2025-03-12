'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { IconLogout } from '@tabler/icons-react';

type NavItem = {
  name: string;
  link: string;
  icon?: React.ReactNode;
};

export const FloatingNav = ({
  navItems,
  className,
  isLoggedIn = false,
  onLogout,
}: {
  navItems: NavItem[];
  className?: string;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
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
        } px-5 py-2 shadow-lg ${
          isScrolled ? 'opacity-95' : 'opacity-85 hover:opacity-95'
        } ${className} max-w-3xl mx-auto transition-all duration-300`}
      >
        {/* Logo section */}
        <div className="flex items-center gap-1 mr-3">
          <div className="flex gap-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#1f7cff]"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#1f7cff]"></div>
          </div>
          <span className="font-semibold text-[#070f18] hidden md:block dark:text-white md:text-xs">
            Ambatu-Rich
          </span>
        </div>

        {/* Navigation links */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className={`flex items-center space-x-1 rounded-full px-2 py-1 text-xs sm:text-sm transition-colors ${
                pathname === item.link
                  ? 'bg-gray-200/80 text-black font-medium dark:bg-gray-800/80 dark:text-white'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
              }`}
            >
              {item.icon && <span className="inline-block">{item.icon}</span>}
              <span className="hidden sm:inline">{item.name}</span>
            </Link>
          ))}
        </div>

        {/* Right section: Theme toggle and Sign in/Logout */}
        <div className="ml-3 flex items-center space-x-2">
          <ThemeToggle />

          {isLoggedIn ? (
            <Button
              className="rounded-full bg-red-100/80 hover:bg-red-200 text-red-700 px-3 py-1 text-xs sm:text-sm h-auto dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 flex items-center gap-1"
              onClick={onLogout}
            >
              <IconLogout className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          ) : (
            <Button
              className="rounded-full bg-gray-200/80 hover:bg-gray-300 text-[#070f18] px-3 py-1 text-xs sm:text-sm h-auto dark:bg-gray-800/80 dark:text-white dark:hover:bg-gray-700"
              onClick={() => {
                router.push('/auth/signin');
              }}
            >
              Sign In
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
