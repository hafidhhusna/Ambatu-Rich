import './globals.css';
import React from 'react';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';
import { poppins } from '@/app/font';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/auth-context';

const Navbar = dynamic(() => import('@/components/global/navbar'), {
  ssr: false,
});
const Footer = dynamic(() => import('@/components/global/footer'), {
  ssr: false,
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: 'Ambaturich',
  description: 'Ambaturich blablabla',
};

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${poppins.variable}`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem={true}
            storageKey="ambatu-theme"
          >
            <Navbar />
            <main className="">{children}</main>
            <Footer />
          </ThemeProvider>
          <Toaster richColors position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
