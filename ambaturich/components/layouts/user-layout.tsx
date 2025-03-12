'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  IconHome,
  IconUser,
  IconSettings,
  IconShoppingCart,
  IconHeart,
  IconLogout,
  IconMenu2,
} from '@tabler/icons-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/user',
    icon: <IconHome className="h-4 w-4 mr-2" />,
  },
  {
    title: 'Profile',
    href: '/user/profile',
    icon: <IconUser className="h-4 w-4 mr-2" />,
  },
  {
    title: 'Orders',
    href: '/user/orders',
    icon: <IconShoppingCart className="h-4 w-4 mr-2" />,
  },
  {
    title: 'Favorites',
    href: '/user/favorites',
    icon: <IconHeart className="h-4 w-4 mr-2" />,
  },
  {
    title: 'Settings',
    href: '/user/settings',
    icon: <IconSettings className="h-4 w-4 mr-2" />,
  },
];

// Side navigation component
interface SideNavProps extends React.HTMLAttributes<HTMLDivElement> {
  items: NavItem[];
}

function SideNav({ items, className, ...props }: SideNavProps) {
  const pathname = usePathname();

  return (
    <div className={cn('flex flex-col gap-2', className)} {...props}>
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
              isActive
                ? 'bg-accent text-accent-foreground font-medium'
                : 'hover:bg-accent hover:text-accent-foreground'
            )}
          >
            {item.icon}
            <span>{item.title}</span>
          </Link>
        );
      })}
    </div>
  );
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

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

  // Get user initial for avatar
  const userInitial =
    session?.user?.name?.[0] || session?.user?.email?.[0] || 'U';

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile Nav */}
      <header className="sticky top-0 z-40 border-b bg-background md:hidden">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="mr-2">
                  <IconMenu2 className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <nav className="flex flex-col gap-6">
                  <div className="flex items-center gap-2 px-2">
                    <div className="flex gap-0.5">
                      <div className="w-2 h-2 rounded-full bg-[#1f7cff]"></div>
                      <div className="w-2 h-2 rounded-full bg-[#1f7cff]"></div>
                    </div>
                    <span className="font-semibold">Ambatu-Rich</span>
                  </div>

                  <Separator />

                  <div className="px-2 py-2">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar>
                        <AvatarFallback>{userInitial}</AvatarFallback>
                        {session?.user?.image && (
                          <AvatarImage
                            src={session.user.image}
                            alt={session.user.name || ''}
                          />
                        )}
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {session?.user?.name || 'User'}
                        </div>
                        <div className="text-xs text-muted-foreground truncate max-w-28">
                          {session?.user?.email}
                        </div>
                      </div>
                    </div>

                    <ScrollArea className="h-[calc(100vh-10rem)]">
                      <SideNav items={navItems} />
                    </ScrollArea>
                  </div>

                  <div className="mt-auto px-2">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm">Theme</span>
                      <ThemeToggle />
                    </div>
                    <Button
                      variant="destructive"
                      className="w-full flex items-center justify-center gap-2"
                      onClick={handleLogout}
                    >
                      <IconLogout className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>

            <span className="font-semibold">Ambatu-Rich</span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{userInitial}</AvatarFallback>
              {session?.user?.image && (
                <AvatarImage
                  src={session.user.image}
                  alt={session.user.name || ''}
                />
              )}
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr] md:gap-6 lg:gap-10 pt-6">
        {/* Desktop sidebar */}
        <aside className="fixed top-0 z-30 hidden h-screen w-full shrink-0 md:sticky md:block border-r">
          <ScrollArea className="h-full py-6 pr-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 px-2 mb-6">
                <div className="flex gap-0.5">
                  <div className="w-2 h-2 rounded-full bg-[#1f7cff]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#1f7cff]"></div>
                </div>
                <span className="font-semibold">Ambatu-Rich</span>
              </div>

              <div className="flex items-center gap-3 px-2 mb-4">
                <Avatar>
                  <AvatarFallback>{userInitial}</AvatarFallback>
                  {session?.user?.image && (
                    <AvatarImage
                      src={session.user.image}
                      alt={session.user.name || ''}
                    />
                  )}
                </Avatar>
                <div>
                  <div className="font-medium">
                    {session?.user?.name || 'User'}
                  </div>
                  <div className="text-xs text-muted-foreground truncate max-w-28">
                    {session?.user?.email}
                  </div>
                </div>
              </div>

              <Separator className="mb-4" />

              <SideNav items={navItems} />

              <div className="mt-auto space-y-4">
                <Separator className="my-4" />
                <div className="flex items-center justify-between px-2">
                  <span className="text-sm">Theme</span>
                  <ThemeToggle />
                </div>
                <Button
                  variant="destructive"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleLogout}
                >
                  <IconLogout className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </ScrollArea>
        </aside>

        {/* Main content */}
        <main className="flex w-full flex-col overflow-hidden pb-16">
          {children}
        </main>
      </div>
    </div>
  );
}
