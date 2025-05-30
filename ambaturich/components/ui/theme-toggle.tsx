'use client';

import * as React from 'react';
import { useTheme } from '@/components/ui/theme-provider';
import { IconSun, IconMoon, IconDeviceDesktop } from '@tabler/icons-react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ThemeToggleProps {
  /**
   * The mode of the theme toggle
   * "toggle" - Simple button that toggles between light and dark
   * "select" - Dropdown select with light, dark, and system options
   * @default "toggle"
   */
  mode?: 'toggle' | 'select';

  /**
   * Additional CSS classes for the component
   */
  className?: string;
}

export function ThemeToggle({
  mode = 'toggle',
  className = '',
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  // Simple toggle button
  if (mode === 'toggle') {
    return (
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className={`rounded-full p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 focus:outline-none ${className}`}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <IconSun className="h-4 w-4" />
        ) : (
          <IconMoon className="h-4 w-4" />
        )}
      </button>
    );
  }

  // Select dropdown for more theme options
  return (
    <Select value={theme} onValueChange={setTheme}>
      <SelectTrigger
        className={`w-[130px] h-8 text-sm border-none bg-transparent hover:bg-accent/50 focus:ring-0 focus:ring-offset-0 ${className}`}
        aria-label="Select theme"
      >
        <SelectValue placeholder="Theme">
          <div className="flex items-center gap-2">
            {theme === 'light' && (
              <>
                <IconSun className="h-4 w-4" />
                <span>Light</span>
              </>
            )}
            {theme === 'dark' && (
              <>
                <IconMoon className="h-4 w-4" />
                <span>Dark</span>
              </>
            )}
            {theme === 'system' && (
              <>
                <IconDeviceDesktop className="h-4 w-4" />
                <span>System</span>
              </>
            )}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="light">
            <div className="flex items-center gap-2">
              <IconSun className="h-4 w-4" />
              <span>Light</span>
            </div>
          </SelectItem>
          <SelectItem value="dark">
            <div className="flex items-center gap-2">
              <IconMoon className="h-4 w-4" />
              <span>Dark</span>
            </div>
          </SelectItem>
          <SelectItem value="system">
            <div className="flex items-center gap-2">
              <IconDeviceDesktop className="h-4 w-4" />
              <span>System</span>
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
