'use client';

import type React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Share,
  Wifi,
  Trello,
  Target,
  Globe,
  Gift,
  ChevronRight,
  Play,
} from 'lucide-react';
import nig from '/public/images/home.png';
import buk from '/public/images/buk.png';
import analytic from '/public/images/analytic.png';

import { FeatureCard } from '@/components/ui/feature-card';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950">
      <main className="flex-1">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <section className="md:flex md:items-center md:gap-8 pt-12">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-3xl md:text-5xl font-bold text-[#070f18] dark:text-white mb-4">
                Lorem Ipsum
                <br />
                Dolor Sit Amet
              </h1>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-6 max-w-md">
                Ambatu-Rich is helping you to setting up the payroll without
                required any finance skills or knowledge before
              </p>
              <Button className="rounded-full bg-[#1f7cff] hover:bg-[#1f7cff]/90 text-white px-6">
                Get Started
              </Button>
            </div>

            <div className="hidden md:block md:w-1/2 relative">
              <div className="rounded-3xl overflow-hidden bg-white dark:bg-gray-800 p-1">
                <Image
                  src={nig}
                  alt="Business professional"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              </div>

              {/* Floating UI elements - hidden on mobile */}
              <div className="hidden md:block absolute top-4 right-[-40px] bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="bg-[#1f7cff] p-1 rounded-full">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold dark:text-white">
                      Bulk Export
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Work faster 200x
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden md:block absolute bottom-10 left-[-60px] bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="bg-[#191046] p-1 rounded-full">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold dark:text-white">
                      Analytics
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Real-time report
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <Image
                    src={analytic}
                    alt="Analytics chart"
                    width={100}
                    height={40}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-4 mx-8 md:py-20">
            <div className="text-center mb-12">
              <div className="uppercase text-xs font-medium text-[#1f7cff] mb-2">
                WORK BETTER
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-[#070f18] dark:text-white mb-4">
                For Your Business
              </h2>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
                We did research what your company needs and here we are
                providing all of them just for you
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Share className="h-5 w-5 text-white" />}
                title="Share Insights"
                description="Working together with your team to make decisions"
                bgColor="bg-[#5c4ef7]"
              />

              <FeatureCard
                icon={<Target className="h-5 w-5 text-white" />}
                title="Track Leads"
                description="See where your money goes and comes in business"
                bgColor="bg-[#f75c4e]"
              />

              <FeatureCard
                icon={<Wifi className="h-5 w-5 text-white" />}
                title="Offline Mode"
                description="Use the feature while off from internet? sure can"
                bgColor="bg-[#191046]"
              />

              <FeatureCard
                icon={<Trello className="h-5 w-5 text-white" />}
                title="Kanban Mode"
                description="Organize the report that easy to be understand"
                bgColor="bg-[#ff1fb3]"
              />

              <FeatureCard
                icon={<Gift className="h-5 w-5 text-white" />}
                title="Reward System"
                description="Motivate your team working harder and receive a gift"
                bgColor="bg-[#5c4ef7]"
              />

              <FeatureCard
                icon={<Globe className="h-5 w-5 text-white" />}
                title="189 Country"
                description="Working together worldwide people from anywhere"
                bgColor="bg-[#f7954e]"
              />
            </div>
          </section>

          {/* Productivity Section */}
          <section className="py-12 md:py-20 md:flex md:items-center md:gap-12">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <div className="relative rounded-3xl overflow-hidden">
                <Image
                  src={buk}
                  alt="Business meeting"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg">
                    <Play className="h-6 w-6 text-[#1f7cff]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-1/2">
              <div className="uppercase text-xs font-medium text-[#1f7cff] mb-2">
                SAVE MORE TIME
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-[#070f18] dark:text-white mb-4">
                And Boost Productivity
              </h2>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-6 max-w-md">
                Your employees can bring any success into your business, so we
                need to take care of them
              </p>

              {/* Email Form */}
              <div className="flex flex-col md:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Email Address"
                  className="bg-gray-100 dark:bg-gray-800 border-0 rounded-lg md:w-2/3"
                />
                <Button className="rounded-full bg-[#1f7cff] hover:bg-[#1f7cff]/90 text-white md:w-1/3">
                  Get Started
                </Button>
              </div>
            </div>
          </section>

          {/* Dark Card */}
          <section className="py-12 md:py-20">
            <div className="bg-[#070f18] dark:bg-gray-900 text-white rounded-3xl p-8 md:p-16 text-center">
              <h3 className="text-2xl md:text-4xl font-medium mb-2">
                Lorem Ipsum.
              </h3>
              <p className="text-2xl md:text-4xl font-medium mb-8">
                Dolor Sit Amet
              </p>
              <Button className="rounded-full bg-[#1f7cff] hover:bg-[#1f7cff]/90 text-white px-6 mx-auto">
                Join Quest <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
