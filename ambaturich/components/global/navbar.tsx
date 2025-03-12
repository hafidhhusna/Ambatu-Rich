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
import { toast } from 'sonner';

const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated';

  const getIconForPath = (path: string) => {
    switch (path) {
      case '/':
        return <IconHome className="h-3 w-3 sm:h-4 sm:w-4 text-neutral-500" />;
      case '/about':
        return (
          <IconInfoCircle className="h-3 w-3 sm:h-4 sm:w-4 text-neutral-500" />
        );
      case '/profile':
        return <IconUser className="h-3 w-3 sm:h-4 sm:w-4 text-neutral-500" />;
      default:
        return (
          <IconBuildingStore className="h-3 w-3 sm:h-4 sm:w-4 text-neutral-500" />
        );
    }
  };

  const navItems = navbar_list.map((item) => ({
    name: item.menu,
    link: item.path,
    icon: getIconForPath(item.path),
  }));

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success('Logged out successfully');
      router.push('/auth/signin');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to log out');
    }
  };

  return (
    <>
      <FloatingNav
        navItems={navItems}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      <div className="h-12"></div>
    </>
  );
};

export default Navbar;
