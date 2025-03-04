import './globals.css';
import React from 'react';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';
import { poppins } from '@/app/font';

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
    <html lang="en">
      <body className={`${poppins.variable}`}>
        <Navbar />
        <main className="pt-[150px] pb-[100px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
