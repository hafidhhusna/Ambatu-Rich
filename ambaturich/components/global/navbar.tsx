"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { signIn } from 'next-auth/react';
import { getUserSession } from '@/lib/session';

type Props = {};

const handleGoogleSignIn = async (props: Props) => {
  const session = await signIn('google' ,{callbackUrl: '/home'});
}

const Navbar: React.FC = () => {
  return (
    <header className="container mx-auto px-4 py-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-[#1f7cff]"></div>
          <div className="w-2 h-2 rounded-full bg-[#1f7cff]"></div>
        </div>
        <span className="font-semibold text-[#070f18]">Ambatu-Rich</span>
      </div>

      <nav className="hidden md:flex items-center gap-8">
        <a href="#" className="text-sm font-medium text-[#070f18]">
          Home
        </a>
        <a href="#" className="text-sm font-medium text-gray-600">
          Features
        </a>
        <a href="#" className="text-sm font-medium text-gray-600">
          About Us
        </a>
      </nav>

      <Button className="hidden md:flex rounded-full bg-gray-200 hover:bg-gray-300 text-[#070f18] px-6"
      onClick={() => {
        handleGoogleSignIn({});
      }}>
        Sign In
      </Button>
    </header>
  );
};

export default Navbar;