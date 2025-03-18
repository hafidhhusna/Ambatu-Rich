'use client';

import type React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import nig from '/public/images/home.png';

export default function AboutUs() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950">
      <main className="flex-1">
        <div className="container mx-auto px-4">
          {/* About Us Section */}
          <section className="text-center py-12 md:py-20">
            <h1 className="text-3xl md:text-5xl font-bold text-[#070f18] dark:text-white mb-4">
              Meet Our Team
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-12">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vehicula ullamcorper turpis, at tempus nulla.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Team Member 1 */}
              <div className="text-center">
                <Image
                  src={nig}
                  alt="Team Member 1"
                  width={200}
                  height={200}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-[#070f18] dark:text-white">Mie Ayam</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Ambatu Dev</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 max-w-xs mx-auto">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>

              {/* Team Member 2 */}
              <div className="text-center">
                <Image
                  src={nig}
                  alt="Team Member 2"
                  width={200}
                  height={200}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-[#070f18] dark:text-white">Nasi Goreng</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Ambatu Dev</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 max-w-xs mx-auto">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>

              {/* Team Member 3 */}
              <div className="text-center">
                <Image
                  src={nig}
                  alt="Team Member 3"
                  width={200}
                  height={200}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-[#070f18] dark:text-white">Sate Ayam</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Ambatu Dev</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 max-w-xs mx-auto">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
