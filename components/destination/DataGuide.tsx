'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  MapPin,
  MessageSquare,
  Mail,
  Music,
  Video,
  Camera,
  Laptop,
  Film,
  HardDrive,
  Wifi,
  Cloud,
  CheckCircle2,
} from 'lucide-react';

interface TierFeature {
  text: string;
  icon?: React.ReactNode;
}

interface TierItem {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  features: string[];
}

interface DataGuideProps {
  destinationName?: string;
  countryName?: string;
}

export const DataGuide: React.FC<DataGuideProps> = ({
  destinationName,
  countryName,
}) => {
  const destName = destinationName || countryName || 'Turkey';
  const [openTier, setOpenTier] = useState<string>('10GB');

  const tiers: TierItem[] = [
    {
      id: '1GB',
      title: `Short Trip to ${destName}`,
      subtitle: '2-3 days • Light usage',
      desc: `Heading to ${destName} for a short getaway? 1GB covers essential maps, messaging, and occasional emails.`,
      features: ['Navigate with Google Maps', 'WhatsApp messages', 'Check emails'],
    },
    {
      id: '3GB',
      title: 'Week-Long Vacation',
      subtitle: '5-7 days • Balanced usage',
      desc: `A week-long adventure in ${destName}? 3GB ensures you stay connected with daily social media posts and calls.`,
      features: ['Daily Stories & Reels', '3 hours of video calls', 'Stream Spotify freely'],
    },
    {
      id: '5GB',
      title: 'Cross-Country Tour',
      subtitle: '7-10 days • Content creator friendly',
      desc: `Exploring multiple cities in ${destName}? 5GB keeps you fully connected with capacity for HD uploads.`,
      features: ['Instagram Live sessions', 'Upload HD travel videos', 'Multi-city navigation'],
    },
    {
      id: '10GB',
      title: 'Work & Travel',
      subtitle: '2+ weeks • Remote work ready',
      desc: `Working remotely in ${destName}? 10GB supports video meetings, cloud collaboration, and entertainment.`,
      features: ['Work from anywhere', 'Video conferences', 'Access cloud files', 'Stream Netflix'],
    },
    {
      id: '20GB',
      title: 'Data Intensive',
      subtitle: '1+ month • Heavy usage',
      desc: `Extended trip to ${destName}? 20GB means unlimited streaming, heavy file uploads, and mobile hotspotting.`,
      features: ['Unlimited streaming', 'Hotspot for laptop', 'Upload large files'],
    },
    {
      id: '50GB',
      title: 'Unrestricted Access',
      subtitle: 'Multiple months • Maximum capacity',
      desc: `Settling in ${destName} for the long haul? 50GB gives you complete data independence.`,
      features: ['Full-time remote work', '4K video streaming', 'Share with family'],
    },
  ];

  const getFeatureIcon = (feature: string) => {
    const f = feature.toLowerCase();
    if (f.includes('map') || f.includes('navigation')) {
      return <MapPin className="w-4 h-4 text-[#F88B35]" />;
    }
    if (f.includes('whatsapp') || f.includes('message')) {
      return <MessageSquare className="w-4 h-4 text-[#00B67A]" />;
    }
    if (f.includes('email')) {
      return <Mail className="w-4 h-4 text-blue-500" />;
    }
    if (f.includes('instagram') || f.includes('stories')) {
      return <Camera className="w-4 h-4 text-pink-500" />;
    }
    if (f.includes('video') || f.includes('call') || f.includes('conference')) {
      return <Video className="w-4 h-4 text-purple-500" />;
    }
    if (f.includes('spotify') || f.includes('music') || f.includes('stream')) {
      return <Music className="w-4 h-4 text-green-500" />;
    }
    if (f.includes('netflix') || f.includes('4k')) {
      return <Film className="w-4 h-4 text-red-500" />;
    }
    if (f.includes('work') || f.includes('laptop') || f.includes('remote')) {
      return <Laptop className="w-4 h-4 text-indigo-500" />;
    }
    if (f.includes('cloud') || f.includes('file')) {
      return <Cloud className="w-4 h-4 text-cyan-500" />;
    }
    if (f.includes('hotspot')) {
      return <Wifi className="w-4 h-4 text-[#F88B35]" />;
    }
    return <CheckCircle2 className="w-4 h-4 text-[#F88B35]" />;
  };

  return (
    <div className="flex flex-col items-center gap-8 md:gap-11 w-full">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center gap-2 max-w-[650px]">
        <span className="text-xs font-semibold text-[#4B5675] uppercase tracking-wider bg-[#F7F7F7] px-3 py-1.5 rounded-full">
          Travel Smart
        </span>
        <h2 className="text-2xl md:text-[36px] font-bold text-[#000000] tracking-tight leading-tight">
          How Much Data Do I Need for {destName}?
        </h2>
      </div>

      {/* Accordion List */}
      <div className="flex flex-col w-full">
        {tiers.map((tier) => {
          const isOpen = openTier === tier.id;

          return (
            <div
              key={tier.id}
              onClick={() => setOpenTier(isOpen ? '' : tier.id)}
              className={`bg-white rounded-[16px] overflow-hidden transition-all duration-300 border-2 mb-3 cursor-pointer ${
                isOpen
                  ? 'border-[#F88B35] shadow-sm'
                  : 'border-transparent hover:border-gray-200'
              }`}
            >
              {/* Header Layout (Always Visible) */}
              <div className="p-5 md:p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Tier ID */}
                  <span className="w-14 font-black text-xl text-gray-900 shrink-0">
                    {tier.id}
                  </span>

                  {/* Title & Subtitle */}
                  <div className="flex flex-col text-left">
                    <div className="flex items-center flex-wrap">
                      <span className="font-bold text-gray-900 text-base md:text-lg">
                        {tier.title}
                      </span>
                      {tier.id === '10GB' && (
                        <span className="ml-3 bg-[#F88B35] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                          MOST CHOSEN
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500 mt-0.5">
                      {tier.subtitle}
                    </span>
                  </div>
                </div>

                {/* Rotating Chevron Icon */}
                <div className="text-gray-500 ml-4 shrink-0">
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#F88B35]' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Expanded Body Layout */}
              {isOpen && (
                <div className="px-5 md:px-6 pb-6 pt-2 flex flex-col border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    {tier.desc}
                  </p>

                  <span className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-4">
                    WHAT YOU CAN DO
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {tier.features.map((feat) => (
                      <div
                        key={feat}
                        className="bg-[#F7F7F7] rounded-xl p-3 flex items-center gap-3 text-sm font-medium text-gray-800"
                      >
                        <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-2xs">
                          {getFeatureIcon(feat)}
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DataGuide;
