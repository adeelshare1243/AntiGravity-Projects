'use client';
import React from 'react';

interface UsageMeterProps {
  usedGB?: number;
  totalGB?: number;
}

export const UsageMeter: React.FC<UsageMeterProps> = ({ usedGB = 0, totalGB = 10 }) => {
  const percentage = Math.min(100, Math.round((usedGB / (totalGB || 1)) * 100));
  return (
    <div className="w-full bg-[#F7F7F7] rounded-[12px] p-4 flex flex-col gap-2 border border-[#E8E5DD]">
      <div className="flex justify-between text-xs font-semibold text-[#4B5675]">
        <span>Data Usage</span>
        <span>{usedGB} GB / {totalGB} GB</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-[#FD521B] rounded-full" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

export default UsageMeter;
