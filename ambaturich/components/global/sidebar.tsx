'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IconMenu2, IconChevronRight } from '@tabler/icons-react';
import { sidebar_list } from '@/metadata/navbar_list';
import { NavItem } from '@/types/types';

function SideNav({
  items,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <div className={cn('flex flex-col gap-2', className)} {...props}>
      {items.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
              isActive
                ? 'bg-accent text-accent-foreground font-medium'
                : 'hover:bg-accent hover:text-accent-foreground'
            )}
          >
            {item.icon}
            <span>{item.menu}</span>
          </Link>
        );
      })}
    </div>
  );
}

export function UserSidebar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();

  // Handle loading and unauthenticated states in the layout component
  if (status === 'loading' || status === 'unauthenticated') {
    return null;
  }

  const userInitial =
    session?.user?.name?.[0] || session?.user?.email?.[0] || 'U';

  const handleProfileClick = () => {
    router.push('/user/setting');
  };

  const Logo = () => (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        <div className="w-2 h-2 rounded-full bg-[#1f7cff]"></div>
        <div className="w-2 h-2 rounded-full bg-[#1f7cff]"></div>
      </div>
      <span className="font-semibold">Ambatu-Rich</span>
    </div>
  );

  const UserProfile = () => (
    <div
      className="flex items-center justify-between p-4 cursor-pointer hover:bg-accent rounded-md transition-colors"
      onClick={handleProfileClick}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">{userInitial}</AvatarFallback>
          {session?.user?.image && (
            <AvatarImage
              src={session.user.image}
              alt={session.user.name || ''}
            />
          )}
        </Avatar>
        <div className="overflow-hidden">
          <p className="text-sm font-medium truncate">
            {session?.user?.name || 'User'}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {session?.user?.email}
          </p>
        </div>
      </div>
      <IconChevronRight className="h-4 w-4 text-muted-foreground" />
    </div>
  );

  return (
    <>
      {/* Mobile Nav Bar */}
      <div className="sticky top-0 z-40 flex h-16 w-full items-center border-b bg-background p-4 md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mr-4">
              <IconMenu2 className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px] p-0">
            <div className="flex h-full flex-col">
              <div className="p-4">
                <Logo />
              </div>
              <Separator />
              <ScrollArea className="flex-1 px-4 py-6">
                <SideNav items={sidebar_list} />
              </ScrollArea>
              <Separator />
              <UserProfile />
            </div>
          </SheetContent>
        </Sheet>
        <Logo />

        <div className="ml-auto flex items-center gap-2">
          <Avatar
            className="h-8 w-8 cursor-pointer"
            onClick={handleProfileClick}
          >
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

      {/* Desktop sidebar */}
      <div className="hidden h-screen w-64 flex-shrink-0 border-r bg-background md:block">
        <div className="flex h-full flex-col">
          <div className="p-4">
            <Logo />
          </div>
          <Separator />
          <ScrollArea className="flex-1 px-4 py-6">
            <SideNav items={sidebar_list} />
          </ScrollArea>
          <Separator />
          <UserProfile />
        </div>
      </div>
    </>
  );
}
