'use client';

import React from 'react';

interface ComparisonTableProps {
  destinationName?: string;
  countryName?: string; // alias for backwards compatibility
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  destinationName,
  countryName,
}) => {
  const name = destinationName || countryName || 'Turkey';

  return (
    <div className="flex flex-col items-center gap-8 md:gap-11 w-full">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center gap-2 max-w-[650px]">
        <span className="bg-gray-100 text-gray-500 rounded-full text-xs px-3 py-1 font-medium tracking-wider uppercase">
          SAVE TIME & MONEY
        </span>
        <h2 className="text-2xl md:text-[36px] font-bold text-[#000000] tracking-tight leading-tight">
          Best eSIM for {name}: Compare All Options
        </h2>
      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[640px] border border-[#EDEDED] rounded-[16px] overflow-hidden bg-white shadow-2xs">
          {/* Header Row (4 Columns) */}
          <div className="grid grid-cols-4 bg-[#F7F7F7] p-4 items-center border-b border-[#EDEDED]">
            {/* Col 1 */}
            <div className="text-left font-bold text-[#252F4A] text-sm">
              Feature
            </div>

            {/* Col 2 */}
            <div className="flex flex-col items-center justify-center gap-0.5 text-center">
              <span className="font-bold text-[#252F4A] text-sm">
                Brand eSIM
              </span>
              <span className="text-xs text-[#4B5675]">Digital</span>
            </div>

            {/* Col 3 */}
            <div className="flex flex-col items-center justify-center gap-0.5 text-center">
              <span className="font-bold text-[#252F4A] text-sm">
                Other eSIM Providers
              </span>
              <span className="text-xs text-[#4B5675]">Digital</span>
            </div>

            {/* Col 4 */}
            <div className="flex flex-col items-center justify-center gap-0.5 text-center">
              <span className="font-bold text-[#252F4A] text-sm">
                Physical eSIM Providers
              </span>
              <span className="text-xs text-[#4B5675]">Digital</span>
            </div>
          </div>

          {/* Data Rows */}
          <div className="divide-y divide-[#F7F7F7]">
            {/* Row 1: Activation Time */}
            <div className="grid grid-cols-4 p-4 items-center bg-white">
              <div className="text-left text-sm text-[#252F4A]">
                Activation Time
              </div>
              <div className="text-center text-sm font-bold text-[#252F4A]">
                Instant
              </div>
              <div className="text-center text-sm text-[#4B5675]">
                15 - 30 mins
              </div>
              <div className="text-center text-sm text-[#4B5675]">
                30 - 60+ mins
              </div>
            </div>

            {/* Row 2: Starting From */}
            <div className="grid grid-cols-4 p-4 items-center bg-white">
              <div className="text-left text-sm text-[#252F4A]">
                Starting From
              </div>
              <div className="text-center text-sm font-bold text-[#252F4A]">
                $2.30
              </div>
              <div className="text-center text-sm text-[#4B5675]">
                20% higher
              </div>
              <div className="text-center text-sm text-[#4B5675]">
                70% higher
              </div>
            </div>

            {/* Row 3: No Hidden Fees */}
            <div className="grid grid-cols-4 p-4 items-center bg-white">
              <div className="text-left text-sm text-[#252F4A]">
                No Hidden Fees
              </div>
              <div className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-[#4CAF50]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="text-center text-sm text-[#4B5675]">
                Sometimes
              </div>
              <div className="text-center text-sm text-[#4B5675]">
                Often charged
              </div>
            </div>

            {/* Row 4: Setup Before Travel */}
            <div className="grid grid-cols-4 p-4 items-center bg-white">
              <div className="text-left text-sm text-[#252F4A]">
                Setup Before Travel
              </div>
              <div className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-[#4CAF50]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-[#4CAF50]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-[#FF3B30]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;
