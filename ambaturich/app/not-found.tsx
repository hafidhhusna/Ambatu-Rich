'use client';

import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import notFoundAnimation from '@/public/animation/Animation 1741632894198.json';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white  dark:bg-gray-950 px-4 text-center">
      <div className="w-full max-w-md mb-2">
        <Lottie
          animationData={notFoundAnimation}
          loop={true}
          className="w-full"
        />
      </div>

      <p className="text-base sm:text-lg md:text-xl mb-8">
        {`Oops! The page you're looking for doesn't exist`}.
      </p>
      <Link
        href="/"
        className="bg-[#1A237E] hover:bg-[#1A237E/60] transition-colors text-white text-sm sm:text-base md:text-[16px] px-6 sm:px-8 py-2.5 rounded-3xl font-bold"
      >
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;
