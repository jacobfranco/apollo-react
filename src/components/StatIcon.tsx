// components/StatIcon.tsx
import React from 'react';

interface StatIconProps {
  iconSrc: string;
  value: number | string;
}

const StatIcon: React.FC<StatIconProps> = ({ iconSrc, value }) => (
  <div className="flex items-center">
    <img src={iconSrc} alt="" className="w-4 h-4" />
    <span className="ml-1 text-xs">{value}</span>
  </div>
);

export default StatIcon;
