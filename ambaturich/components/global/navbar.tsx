'use client';

import React from 'react';
import { navbar_list } from '@/metadata/navbar_list';
import { usePathname, useRouter } from 'next/navigation';
import { FloatingNav } from '@/components/ui/floating-navbar';
import {
  IconHome,
  IconUser,
  IconInfoCircle,
  IconBuildingStore,
} from '@tabler/icons-react';
import { useSession, signOut } from 'next-auth/react';

const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated';

  if (pathname?.startsWith('/user')) {
    return null;
  }

  const getIconForPath = (path: string) => {
    switch (path) {
      case '/':
        return <IconHome className="h-5 w-5 sm:h-4 sm:w-4 text-neutral-500" />;
      case '/about':
        return (
          <IconInfoCircle className="h-5 w-5 sm:h-4 sm:w-4 text-neutral-500" />
        );
      case '/profile':
        return <IconUser className="h-5 w-5 sm:h-4 sm:w-4 text-neutral-500" />;
      default:
        return (
          <IconBuildingStore className="h-5 w-5 sm:h-4 sm:w-4 text-neutral-500" />
        );
    }
  };

  const handleDashboardClick = () => {
    router.push('/user');
  };

  return (
    <>
      <FloatingNav
        navItems={navbar_list.map((item) => ({
          ...item,
          icon: getIconForPath(item.path),
        }))}
        isLoggedIn={isLoggedIn}
        onDashboard={handleDashboardClick}
        showDashboard={isLoggedIn}
      />
      <div className="h-14 sm:h-12"></div>
    </>
  );
};

export default Navbar;
