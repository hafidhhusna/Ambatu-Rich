// Logo Usage Examples
// This file demonstrates different ways to use the Logo component

import React from 'react';
import { Logo, MetadataLogo } from './logo';

export function LogoExamples() {
  return (
    <div className="space-y-8 p-8 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-6">
        Ambatu Rich Logo Usage Examples
      </h1>

      {/* Different Sizes */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Different Sizes</h2>
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex flex-col items-center gap-2">
            <Logo size="sm" />
            <span className="text-xs text-gray-500">Small</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Logo size="md" />
            <span className="text-xs text-gray-500">Medium (Default)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Logo size="lg" />
            <span className="text-xs text-gray-500">Large</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Logo size="xl" />
            <span className="text-xs text-gray-500">Extra Large</span>
          </div>
        </div>
      </section>

      {/* Different Variants */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Different Variants</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Logo variant="default" />
            <span className="text-sm text-gray-600">Default (Icon + Text)</span>
          </div>
          <div className="flex items-center gap-4">
            <Logo variant="icon-only" />
            <span className="text-sm text-gray-600">Icon Only</span>
          </div>
          <div className="flex items-center gap-4">
            <Logo variant="text-only" />
            <span className="text-sm text-gray-600">Text Only</span>
          </div>
          <div className="flex items-center gap-4">
            <Logo showText={false} />
            <span className="text-sm text-gray-600">Hide Text Option</span>
          </div>
        </div>
      </section>

      {/* Usage in Navigation */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Navigation Usage</h2>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <Logo variant="icon-only" size="sm" />
            <div className="flex gap-4">
              <span className="text-sm">Home</span>
              <span className="text-sm">About</span>
              <span className="text-sm">Contact</span>
            </div>
          </div>
        </div>
      </section>

      {/* Metadata Logo */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Metadata/SEO Logo</h2>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <MetadataLogo />
          <p className="text-xs text-gray-500 mt-2">
            Perfect for headers, footers, and metadata usage
          </p>
        </div>
      </section>

      {/* Dark/Light Theme Examples */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Theme Variations</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <Logo size="lg" />
            <p className="text-xs text-gray-500 mt-2">Light Theme</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg border">
            <Logo size="lg" />
            <p className="text-xs text-gray-400 mt-2">Dark Theme</p>
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Code Examples</h2>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm font-mono">
          <div className="space-y-2">
            <div>
              <span className="text-gray-500">// Basic usage</span>
              <br />
              <span className="text-blue-600">{'<Logo />'}</span>
            </div>
            <div>
              <span className="text-gray-500">// Icon only for navigation</span>
              <br />
              <span className="text-blue-600">
                {'<Logo variant="icon-only" size="sm" />'}
              </span>
            </div>
            <div>
              <span className="text-gray-500">// Large logo for headers</span>
              <br />
              <span className="text-blue-600">{'<Logo size="xl" />'}</span>
            </div>
            <div>
              <span className="text-gray-500">// Metadata logo</span>
              <br />
              <span className="text-blue-600">{'<MetadataLogo />'}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LogoExamples;
