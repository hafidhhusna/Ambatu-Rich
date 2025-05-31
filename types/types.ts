import React from 'react';

interface NavItem {
  menu: string;
  path: string;
  icon?: React.ReactNode;
}

type NavbarProps = NavItem;

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
}

export type { NavItem, NavbarProps, FeatureCardProps };
