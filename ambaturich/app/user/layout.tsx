import * as React from 'react';
import { UserLayoutWrapper } from '@/components/layouts/user-layout-wrapper';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserLayoutWrapper>{children}</UserLayoutWrapper>;
}
