import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer: React.FC = () => {
  return (
    <footer className="container mx-auto px-4 py-8 border-t">
      <div className="md:flex md:justify-between md:items-center">
        <div className="flex items-center gap-2 mb-6 md:mb-0">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-[#1f7cff]"></div>
            <div className="w-2 h-2 rounded-full bg-[#1f7cff]"></div>
          </div>
          <span className="font-semibold text-[#070f18]">Ambatu-Rich</span>
        </div>
        <div className="flex gap-8 text-sm text-gray-500">
          <span>Features</span>
          <span>Services</span>
          <span>Industries</span>
          <span>About</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
