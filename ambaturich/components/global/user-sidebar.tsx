'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Diamond } from 'lucide-react';

import { NavUser } from '@/components/nav-user';
import { AmbatuHeader } from '@/components/global/ambatu-header';
import { DirectNav } from '@/components/global/direct-nav';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { sidebar_list } from '@/metadata/navbar_list';

export function UserSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navItems = React.useMemo(() => {
    return sidebar_list.map((item) => {
      if (item.path === '/user') {
        return {
          title: item.menu,
          url: item.path,
          icon: item.icon,
          isActive: pathname === '/user' || pathname === '/user/',
        };
      }
      return {
        title: item.menu,
        url: item.path,
        icon: item.icon,
        isActive: pathname.startsWith(item.path),
      };
    });
  }, [pathname]);

  const userData = React.useMemo(
    () => ({
      user: {
        name: session?.user?.name || 'Guest User',
        email: session?.user?.email || 'guest@example.com',
        avatar: session?.user?.image || '/avatars/default.jpg',
      },
    }),
    [session]
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AmbatuHeader />
      </SidebarHeader>
      <SidebarContent>
        <DirectNav items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
