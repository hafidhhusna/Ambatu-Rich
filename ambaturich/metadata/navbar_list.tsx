import {
  Home,
  Store,
  Info,
  BarChart3,
  Bell,
  Settings,
  Users,
  type LucideIcon,
  BarChart4,
} from 'lucide-react';
import { ElementType } from 'react';

export interface NavbarProps {
  menu: string;
  path: string;
  icon: LucideIcon;
}

export const navbar_list: NavbarProps[] = [
  {
    menu: 'Home',
    path: '/',
    icon: Home,
  },
  {
    menu: 'Features',
    path: '/features',
    icon: Store,
  },
  {
    menu: 'About Us',
    path: '/about',
    icon: Info,
  },
];

export const sidebar_list: NavbarProps[] = [
  {
    menu: 'Dashboard',
    path: '/user',
    icon: Home,
  },
  {
    menu: 'Analytics',
    path: '/user/analytics',
    icon: BarChart3,
  },
  {
    menu: 'Planner',
    path: '/user/planner/add',
    icon: BarChart4,
  },
  {
    menu: 'Upload Struct',
    path: '/user/upload',
    icon: Store,
  },
  {
    menu: 'Settings',
    path: '/user/setting',
    icon: Settings,
  }
];
