import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'icon-only' | 'text-only';
  showText?: boolean;
}

const sizeClasses = {
  sm: {
    container: 'h-6',
    dots: 'w-1.5 h-1.5',
    text: 'text-sm font-bold',
    gap: 'gap-0.5',
  },
  md: {
    container: 'h-8',
    dots: 'w-2 h-2',
    text: 'text-base font-bold',
    gap: 'gap-0.5',
  },
  lg: {
    container: 'h-10',
    dots: 'w-2.5 h-2.5',
    text: 'text-lg font-bold',
    gap: 'gap-1',
  },
  xl: {
    container: 'h-12',
    dots: 'w-3 h-3',
    text: 'text-xl font-bold',
    gap: 'gap-1',
  },
};

export function Logo({
  className,
  size = 'md',
  variant = 'default',
  showText = true,
}: LogoProps) {
  const sizeClass = sizeClasses[size];

  const LogoIcon = () => (
    <div className={cn('flex items-center', sizeClass.gap)}>
      <div
        className={cn(
          'rounded-full bg-gradient-to-br from-[#1f7cff] to-[#0056d3] shadow-lg',
          sizeClass.dots
        )}
      ></div>
      <div
        className={cn(
          'rounded-full bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] shadow-lg',
          sizeClass.dots
        )}
      ></div>
    </div>
  );

  const LogoText = () => (
    <span
      className={cn(
        'bg-gradient-to-r from-[#1f7cff] to-[#4f46e5] bg-clip-text text-transparent',
        sizeClass.text
      )}
    >
      Ambatu Rich
    </span>
  );

  if (variant === 'icon-only') {
    return (
      <div className={cn('flex items-center', sizeClass.container, className)}>
        <LogoIcon />
      </div>
    );
  }

  if (variant === 'text-only') {
    return (
      <div className={cn('flex items-center', sizeClass.container, className)}>
        <LogoText />
      </div>
    );
  }

  return (
    <div
      className={cn('flex items-center gap-2', sizeClass.container, className)}
    >
      <LogoIcon />
      {showText && <LogoText />}
    </div>
  );
}

// Metadata/SEO Logo for usage in layouts
export function MetadataLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        <div className="w-2 h-2 rounded-full bg-gradient-to-br from-[#1f7cff] to-[#0056d3]"></div>
        <div className="w-2 h-2 rounded-full bg-gradient-to-br from-[#4f46e5] to-[#7c3aed]"></div>
      </div>
      <span className="text-sm font-bold bg-gradient-to-r from-[#1f7cff] to-[#4f46e5] bg-clip-text text-transparent">
        Ambatu Rich
      </span>
    </div>
  );
}

export default Logo;
