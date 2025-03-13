'use client';

import { usePathname } from 'next/navigation'; // Get current page path
import {
    DashboardIcon,
    AnalysisIcon,
    PlannerIcon,
    CalendarIcon,
    NotificationsIcon,
    SecurityIcon,
    SettingIcon
} from '@/components/icons/icons';

export function FeatureSidebar() {
    const pathname = usePathname(); // Get current page URL

    // Function to check if the menu item is active
    const isActive = (path: string) =>
        pathname === path ? 'text-blue-600 bg-gray-200 dark:bg-gray-700' : 'text-gray-700 dark:text-gray-300';

    return (
        <div className="w-64 min-h-screen bg-white dark:bg-gray-800 shadow-md p-4 flex flex-col justify-between">
            <div>
                {/* Sidebar Logo */}
                <div className="flex items-center gap-2 mr-3">
                    <div className="flex gap-0.5">
                        <div className="w-2 h-2 sm:w-1.5 sm:h-1.5 rounded-full bg-[#1f7cff]"></div>
                        <div className="w-2 h-2 sm:w-1.5 sm:h-1.5 rounded-full bg-[#1f7cff]"></div>
                    </div>
                    <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400">Ambatu-Rich</h2>
                </div>

                {/* Sidebar Menu */}
                <nav className="mt-6">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Manage</p>
                    <ul className="space-y-4">
                        <li className={`font-medium flex items-center gap-3 cursor-pointer p-2 rounded-md hover:text-blue-500 hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive('/dashboard')}`}>
                            <DashboardIcon color={pathname === '/dashboard' ? 'blue' : 'gray'} /> Dashboard
                        </li>
                        <li className={`font-medium flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive('/analysis')}`}>
                            <AnalysisIcon color={pathname === '/analysis' ? 'blue' : 'gray'} /> Analysis
                        </li>
                        <li className={`font-medium flex items-center gap-3 cursor-pointer p-2 rounded-md hover:text-blue-500 hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive('/planner')}`}>
                            <PlannerIcon color={pathname === '/planner' ? 'blue' : 'gray'} /> Planner
                        </li>
                        <li className={`font-medium flex items-center gap-3 cursor-pointer p-2 rounded-md hover:text-blue-500 hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive('/calendar')}`}>
                            <CalendarIcon color={pathname === '/calendar' ? 'blue' : 'gray'} /> Calendar
                        </li>
                        <li className={`font-medium flex items-center gap-3 cursor-pointer p-2 rounded-md hover:text-blue-500 hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive('/notifications')}`}>
                            <NotificationsIcon color={pathname === '/notifications' ? 'blue' : 'gray'} /> Notifications
                        </li>
                        <li className={`font-medium flex items-center gap-3 cursor-pointer p-2 rounded-md hover:text-blue-500 hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive('/security')}`}>
                            <SecurityIcon color={pathname === '/security' ? 'blue' : 'gray'} /> Security
                        </li>
                    </ul>

                    {/* Preferences Section */}
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mt-6 mb-2">Preferences</p>
                    <ul className="space-y-6">
                        <li className={`font-medium flex items-center gap-3 cursor-pointer p-2 rounded-md hover:text-blue-500 hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive('/setting')}`}>
                            <SettingIcon color={pathname === '/setting' ? 'blue' : 'gray'} /> Setting
                        </li>
                    </ul>
                </nav>
            </div>

            {/* User Info Section */}
            <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <span className="w-8 h-8 bg-gray-400 rounded-full" />
                <div>
                    <p className="text-gray-800 dark:text-gray-200 text-sm">testing</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">testing@gmail.com</p>
                </div>
            </div>
        </div>
    );
}
