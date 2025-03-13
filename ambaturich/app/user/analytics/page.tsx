'use client';

import Link from 'next/link';
import React, { useEffect, useRef } from 'react';

const UserProfile: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white  dark:bg-gray-950 px-4 text-center">

      <p className="text-base sm:text-lg md:text-xl mb-8">
        {`Belom ada`}.
      </p>
    </div>
  );
};

export default UserProfile;
