import React from 'react';

const iconSize = { width: '20px', height: '20px' }; // Standard size for all icons

export const DashboardIcon = ({ color = 'gray' }) => (
  <img
    src="/icons/dashboardIcon.svg"
    alt="Dashboard"
    style={{
      ...iconSize,
      filter:
        color === 'blue'
          ? 'invert(27%) sepia(91%) saturate(748%) hue-rotate(190deg) brightness(95%) contrast(86%)'
          : 'none',
    }}
  />
);

export const AnalysisIcon = ({ color = 'gray' }) => (
  <img
    src="/icons/analysisIcon.svg"
    alt="Analysis"
    style={{
      ...iconSize,
      filter:
        color === 'blue'
          ? 'invert(27%) sepia(91%) saturate(748%) hue-rotate(190deg) brightness(95%) contrast(86%)'
          : 'none',
    }}
  />
);

export const CalendarIcon = ({ color = 'gray' }) => (
  <img src="/icons/calendarIcon.svg" alt="Calendar" style={{ ...iconSize }} />
);

export const SecurityIcon = ({ color = 'gray' }) => (
  <img src="/icons/securityIcon.svg" alt="Security" style={{ ...iconSize }} />
);

export const SettingIcon = ({ color = 'gray' }) => (
  <img src="/icons/settingIcon.svg" alt="Settings" style={{ ...iconSize }} />
);
