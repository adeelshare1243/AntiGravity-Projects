'use client';

import React from 'react';

interface CountryItem {
  name: string;
  flagUrl: string;
}

const DEFAULT_COVERED_COUNTRIES: CountryItem[] = [
  { name: 'France', flagUrl: '/assets/flags/fr.svg' },
  { name: 'Spain', flagUrl: '/assets/flags/es.svg' },
  { name: 'Italy', flagUrl: '/assets/flags/it.svg' },
  { name: 'Portugal', flagUrl: '/assets/flags/pt.svg' },
  { name: 'Poland', flagUrl: '/assets/flags/pl.svg' },
  { name: 'Sweden', flagUrl: '/assets/flags/se.svg' },
  { name: 'Ireland', flagUrl: '/assets/flags/ie.svg' },
  { name: 'Greece', flagUrl: '/assets/flags/gr.svg' },
  { name: 'Switzerland', flagUrl: '/assets/flags/ch.svg' },
  { name: 'United Kingdom', flagUrl: '/assets/flags/gb.svg' },
  { name: 'Germany', flagUrl: '/assets/flags/de.svg' },
  { name: 'Netherlands', flagUrl: '/assets/flags/nl.svg' },
];

interface CoveredCountriesProps {
  title?: string;
  count?: number;
  countries?: CountryItem[];
}

export const CoveredCountries: React.FC<CoveredCountriesProps> = ({
  title,
  count = 44,
  countries = DEFAULT_COVERED_COUNTRIES,
}) => {
  const displayTitle = title || `Covered Countries (${count})`;

  return (
    <section className="w-full bg-[#F7F7F7] py-14 md:py-20 my-4 md:my-6">
      <div className="w-full max-w-[1080px] mx-auto px-4 sm:px-6 flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 text-center">
          {displayTitle}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 md:gap-x-12 gap-y-6 w-full max-w-[960px]">
          {countries.map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <img
                src={item.flagUrl}
                alt={`${item.name} flag`}
                className="w-6 h-6 rounded-full object-cover shadow-2xs shrink-0 bg-white"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="text-[15px] font-semibold text-gray-800">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoveredCountries;
