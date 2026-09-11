'use client';

import React from 'react';

interface SpecificationItem {
  icon: string;
  label: string;
  value: string;
  isPositive: boolean;
  bgWhiteIcon?: boolean;
}

const SPEC_ITEMS: SpecificationItem[] = [
  {
    icon: '/assets/destination/icon-price.svg',
    label: 'Starting Price',
    value: 'From $3.40',
    isPositive: true,
  },
  {
    icon: '/assets/destination/icon-coverage.svg',
    label: 'Coverage Area',
    value: 'Nationwide coverage in Turkey',
    isPositive: true,
    bgWhiteIcon: true,
  },
  {
    icon: '/assets/destination/icon-tower.svg',
    label: 'Network Coverage',
    value: 'Vodafone / Turkcell',
    isPositive: true,
  },
  {
    icon: '/assets/destination/icon-speed.svg',
    label: 'Network Speed',
    value: '4G LTE / 5G',
    isPositive: true,
    bgWhiteIcon: true,
  },
  {
    icon: '/assets/destination/icon-power.svg',
    label: 'Activation Type',
    value: 'First Network Connection',
    isPositive: true,
  },
  {
    icon: '/assets/destination/icon-validity.svg',
    label: 'Validity',
    value: '7 – 180 Days',
    isPositive: true,
    bgWhiteIcon: true,
  },
  {
    icon: '/assets/destination/icon-autorenew.svg',
    label: 'Top-Up Support',
    value: 'Supported — extend data anytime (standard plans)',
    isPositive: true,
  },
  {
    icon: '/assets/destination/icon-phone-disabled.svg',
    label: 'Phone Calls',
    value: 'Data only — not supported',
    isPositive: false,
    bgWhiteIcon: true,
  },
  {
    icon: '/assets/destination/icon-sms-failed.svg',
    label: 'SMS Messages',
    value: 'Data only — not supported',
    isPositive: false,
  },
];

const GLOBAL_COUNTRIES_LIST =
  'Albania, Algeria, Argentina, Armenia, Australia, Austria, Azerbaijan, Bahrain, Bangladesh, Belarus, Belgium, Bolivia, Bosnia and Herzegovina, Brazil, Brunei, Bulgaria, Cambodia, Canada, Chile, China, Colombia, Costa Rica, Croatia, Cyprus, Czech Republic, Democratic Republic of the Congo, Denmark, Dominican Republic, Ecuador, Egypt, El Salvador, Estonia, Faroe Islands, Fiji, Finland, France, French Guiana, Georgia, Germany, Ghana, Gibraltar, Greece, Guadeloupe, Guam, Guatemala, Honduras, Hong Kong, Hungary, Iceland, India, Indonesia, Ireland, Isle of Man, Israel, Italy, Japan, Jersey, Jordan, Kazakhstan, Kenya, Kuwait, Kyrgyzstan, Laos, Latvia, Liechtenstein, Lithuania, Luxembourg, Macau, Madagascar, Malaysia, Malta, Martinique, Mauritius, Mexico, Moldova, Monaco, Montenegro, Morocco, Myanmar, Netherlands, New Zealand, Nicaragua, Nigeria, North Macedonia, Norway, Oman, Pakistan, Panama, Paraguay, Peru, Philippines, Poland, Portugal, Puerto Rico, Qatar, Réunion, Romania, Russia, Saudi Arabia, Serbia, Seychelles, Singapore, Slovakia, Slovenia, South Africa, South Korea, Spain, Sri Lanka, Sweden, Switzerland, Taiwan, Tanzania, Thailand, Tunisia, Turkey, Uganda, Ukraine, United Arab Emirates, United Kingdom, United States, Uruguay, Uzbekistan, Vatican City, Vietnam, Zambia';

const EUROPE_COUNTRIES_LIST =
  'Albania, Austria, Belgium, Bulgaria, Croatia, Cyprus, Czech Republic, Denmark, Estonia, Finland, France, Germany, Greece, Hungary, Iceland, Ireland, Italy, Latvia, Liechtenstein, Lithuania, Luxembourg, Malta, Netherlands, Norway, Poland, Portugal, Romania, Slovakia, Slovenia, Spain, Sweden, Switzerland, Turkey, United Kingdom...';

interface SpecificationsProps {
  countryName?: string;
  destinationName?: string;
  isGlobal?: boolean;
  isRegion?: boolean;
  isEurope?: boolean;
}

export const Specifications: React.FC<SpecificationsProps> = ({
  countryName,
  destinationName,
  isGlobal = false,
  isRegion = false,
  isEurope: isEuropeProp,
}) => {
  const name = destinationName || countryName || 'Turkey';
  const isEurope = isEuropeProp || name.toLowerCase() === 'europe';

  const items = SPEC_ITEMS.map((item) => {
    if (isGlobal && item.label === 'Coverage Area') {
      return { ...item, value: '140+ Countries Worldwide' };
    }
    if (isEurope && item.label === 'Coverage Area') {
      return { ...item, value: '44 Countries in Europe' };
    }
    if (isGlobal && item.label === 'Network Coverage') {
      return { ...item, value: GLOBAL_COUNTRIES_LIST };
    }
    if (isEurope && item.label === 'Network Coverage') {
      return { ...item, value: EUROPE_COUNTRIES_LIST };
    }
    return item;
  });

  const title = isGlobal
    ? 'Global eSIM Specifications'
    : `${name} eSIM Specifications`;

  const subtitle = isGlobal
    ? 'Key details about your cellular connectivity worldwide'
    : isEurope
    ? 'Key details about your cellular connectivity across Europe'
    : `Technical details and network compatibility for ${name}`;

  return (
    <div className="flex flex-col items-center gap-8 md:gap-11 w-full">
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-2 max-w-[650px]">
        <h2 className="text-2xl md:text-[36px] font-bold text-[#000000] tracking-tight leading-tight">
          {title}
        </h2>
        <p className="text-sm md:text-base font-medium text-[#4B5675]">
          {subtitle}
        </p>
      </div>

      {/* Specifications Table Card */}
      <div className="w-full border border-[#EDEDED] rounded-[16px] overflow-hidden divide-y divide-[#EDEDED] bg-white shadow-2xs">
        {items.map((item) => {
          const isNetworkCoverage =
            (isGlobal || isEurope) && item.label === 'Network Coverage';

          return (
            <div
              key={item.label}
              className={`flex items-start justify-between p-4 md:px-5 md:py-4.5 transition-colors ${
                item.bgWhiteIcon ? 'bg-white' : 'bg-[#F7F7F7]'
              }`}
            >
              {/* Left side details */}
              <div className="flex items-start gap-3 md:gap-4 flex-1 pr-4">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-2xs ${
                    item.bgWhiteIcon ? 'bg-[#F5F5F5]' : 'bg-white'
                  }`}
                >
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="w-[18px] h-[18px] object-contain"
                  />
                </div>

                <div className="flex flex-col gap-0.5 flex-1">
                  <span className="text-sm font-semibold text-[#252F4A]">
                    {item.label}
                  </span>
                  <span
                    className={
                      isNetworkCoverage
                        ? 'text-xs text-gray-500 leading-relaxed'
                        : 'text-xs font-normal text-[#4B5675]'
                    }
                  >
                    {item.value}
                  </span>
                </div>
              </div>

              {/* Right Status Icon */}
              <div className="shrink-0 mt-1">
                {item.isPositive ? (
                  <img
                    src="/assets/destination/icon-check.svg"
                    alt="Included"
                    className="w-6 h-6"
                  />
                ) : (
                  <img
                    src="/assets/destination/icon-cross.svg"
                    alt="Not included"
                    className="w-6 h-6"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Specifications;
