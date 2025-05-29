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
  title: 'Ambatu Rich - Smart Financial Management',
  description:
    'Innovative financial technology solution for intelligent expense tracking, budgeting, and financial insights powered by AI.',
  keywords: [
    'financial management',
    'expense tracking',
    'budgeting',
    'AI finance',
    'Ambatu Rich',
  ],
  authors: [
    { name: 'Hafidh Husna' },
    { name: 'Mahsa Quereda Bahjah' },
    { name: 'Brian Tirafi Aufauzan' },
  ],
  creator: 'Ambatu Rich Development Team',
  applicationName: 'Ambatu Rich',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Ambatu Rich - Smart Financial Management',
    description:
      'Innovative financial technology solution for intelligent expense tracking and budgeting.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Ambatu Rich',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ambatu Rich - Smart Financial Management',
    description:
      'Innovative financial technology solution for intelligent expense tracking and budgeting.',
  },
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
