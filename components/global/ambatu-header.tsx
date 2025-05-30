'use client';

import { useSidebar } from '@/components/ui/sidebar';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export function AmbatuHeader() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg">
          <div
            className={cn(
              'flex items-center',
              isCollapsed && 'justify-center w-full'
            )}
          >
            {/* Logo dots always visible */}
            <div
              className={cn(
                'flex items-center gap-1',
                isCollapsed ? 'mr-0' : 'mr-3'
              )}
            >
              <div
                className={cn(
                  'flex gap-0.5',
                  isCollapsed && 'justify-center'
                )}
              >
                <div className="w-2 h-2 sm:w-1.5 sm:h-1.5 rounded-full bg-[#1f7cff]"></div>
                <div className="w-2 h-2 sm:w-1.5 sm:h-1.5 rounded-full bg-[#1f7cff]"></div>
              </div>

              {!isCollapsed && (
                <span className="font-semibold text-[#070f18] dark:text-white text-sm ml-1">
                  Ambatu-Rich
                </span>
              )}
            </div>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
