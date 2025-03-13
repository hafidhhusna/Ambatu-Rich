import React from "react";
import { FeatureCardProps } from "@/types/types";

export function FeatureCard({ 
  icon, 
  title, 
  description, 
  bgColor = "bg-blue-100",
}: FeatureCardProps) {
  return (
    <div className={`flex items-start gap-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm`}>
      <div
        className={`${bgColor} p-3 rounded-full flex items-center justify-center shrink-0`}
      >
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-[#070f18] dark:text-white">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </div>
    </div>
  );
}