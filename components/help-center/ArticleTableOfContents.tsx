'use client';

import React, { useEffect, useState } from 'react';
import { AlignLeft } from 'lucide-react';

export interface TocItem {
  id: string;
  title: string;
  subItems?: { id: string; title: string }[];
}

interface Props {
  items?: TocItem[];
  defaultActiveId?: string;
}

const DEFAULT_ITEMS: TocItem[] = [
  { id: 'apn-overview', title: 'APN Configuration Overview' },
  { id: 'step-1', title: 'Step 1: Get Your APN' },
  { id: 'step-2', title: 'Step 2: Open Android Settings' },
  { id: 'step-3', title: 'Step 3: Add New APN' },
  { id: 'step-4', title: 'Step 4: Select and Restart' },
  { id: 'troubleshooting', title: 'Still Not Working?' },
];

export default function ArticleTableOfContents({ items = DEFAULT_ITEMS, defaultActiveId }: Props) {
  const [activeId, setActiveId] = useState<string>(defaultActiveId || items[0]?.id || 'apn-overview');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;

      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollPosition >= top) {
            setActiveId(item.id);
            return;
          }
        }
      }
      if (items.length > 0) {
        setActiveId(items[0].id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setActiveId(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <aside className="hidden lg:block relative">
      <div className="sticky top-28 bg-[#F7F7F7] rounded-[24px] p-6 border border-gray-100 shadow-xs">
        <div className="flex items-center gap-2 mb-6">
          <AlignLeft className="w-3.5 h-3.5 text-gray-400" />
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            TABLE OF CONTENT
          </h3>
        </div>

        <nav className="flex flex-col gap-4" aria-label="Table of contents">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <div key={item.id} className="flex flex-col gap-2">
                <a
                  href={`#${item.id}`}
                  onClick={(e) => scrollToSection(e, item.id)}
                  className={`text-sm transition-colors cursor-pointer select-none ${
                    isActive
                      ? 'text-[#F88B35] font-bold'
                      : 'text-gray-600 hover:text-gray-900 font-medium'
                  }`}
                >
                  {item.title}
                </a>

                {item.subItems && item.subItems.length > 0 && (
                  <div className="flex flex-col gap-2 pl-4 border-l border-gray-200 ml-1 mt-1">
                    {item.subItems.map((sub) => {
                      const isSubActive = activeId === sub.id;
                      return (
                        <a
                          key={sub.id}
                          href={`#${sub.id}`}
                          onClick={(e) => scrollToSection(e, sub.id)}
                          className={`text-xs transition-colors cursor-pointer select-none ${
                            isSubActive
                              ? 'text-[#F88B35] font-bold'
                              : 'text-gray-500 hover:text-gray-800 font-medium'
                          }`}
                        >
                          {sub.title}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
