import { Icon } from 'lucide-react';
import {NavbarProps} from '../types/types';
import {
  IconHome,
  IconUser,
  IconInfoCircle,
  IconBuildingStore,
  IconAnalyze,
  IconNotification,
  IconSettings,
} from '@tabler/icons-react';

export const navbar_list: NavbarProps[] = [
  {
    menu: "Home",
    path: "/",
    icon: <IconHome className="h-3 w-3 sm:h-4 sm:w-4 text-neutral-500" />
  },
  {
    menu: "Features",
    path: "/features",
    icon: <IconBuildingStore className="h-3 w-3 sm:h-4 sm:w-4 text-neutral-500" />
  },
  {
    menu: "About Us",
    path: "/about",
    icon: <IconInfoCircle className="h-3 w-3 sm:h-4 sm:w-4 text-neutral-500" />
  }
]

export const sidebar_list: NavbarProps[] = [
  {
    menu: "Dashboard",
    path: "/user",
    icon: <IconHome className="h-4 w-4 mr-2" />
  },
  {
    menu: "Analytics",
    path: "/user/analytics",
    icon: <IconAnalyze className="h-4 w-4 mr-2" />
  },
  {
    menu: "Planner",
    path: "/user/planner",
    icon: <IconUser className="h-4 w-4 mr-2" />
  },
  {
    menu: "Notification",
    path: "/user/notification",
    icon: <IconNotification className="h-4 w-4 mr-2" />
  },
  {
    menu: "Settings",
    path: "/user/setting",
    icon: <IconSettings className="h-4 w-4 mr-2" />
  }
]

export type {
  NavbarProps,
};