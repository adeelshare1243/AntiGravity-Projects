'use client';

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#000000] text-[#FFFFFF] mt-6 md:mt-8 py-[48px] pb-[28px] px-4 md:px-8 lg:px-[54px]">
      <div className="mx-auto max-w-[1062px] flex flex-col gap-[36px]">
        {/* Main Content Row - Single Row on Desktop, Responsive Grid on Mobile */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-8">
          {/* Brand Info Column */}
          <div className="w-full lg:w-[230px] shrink-0 flex flex-col gap-[16px]">
            <Link href="/" className="flex items-center gap-[8px]">
              <img src="/assets/globe.svg" alt="logo" className="w-[24px] h-[24px] invert" />
              <span className="text-[20px] font-[700] text-[#FFF9F5] leading-[1.4em]">Soovia</span>
            </Link>

            <p className="text-[14px] font-[400] text-[#F7F7F7] leading-[1.4em]">
              Stay connected wherever you travel. Instant, affordable eSIM plans without physical SIM constraints or roaming fees.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-[12px]">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="p-[8px] bg-[#4B5675] rounded-[10px] flex items-center justify-center hover:bg-gray-600 transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-[16px] h-[16px] fill-current text-white" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="p-[8px] bg-[#4B5675] rounded-[10px] flex items-center justify-center hover:bg-gray-600 transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-[16px] h-[16px] fill-current text-white" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-[8px] bg-[#4B5675] rounded-[10px] flex items-center justify-center hover:bg-gray-600 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-[16px] h-[16px] fill-current text-white" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* 5 Navigation Columns in a Single Row on Desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-row lg:justify-between w-full gap-6 lg:gap-[40px]">
            {/* Product */}
            <div className="flex flex-col gap-[12px] shrink-0">
              <h4 className="text-[14px] font-[700] text-[#FFF9F5] leading-[1.4em]">Product</h4>
              <Link href="/destinations" className="text-[14px] font-[400] text-[#F7F7F7] leading-[1.4em] hover:text-[#FD521B] transition-colors">eSIMs</Link>
              <Link href="/destinations" className="text-[14px] font-[400] text-[#F7F7F7] leading-[1.4em] hover:text-[#FD521B] transition-colors">Destinations</Link>
              <Link href="/partners" className="text-[14px] font-[400] text-[#F7F7F7] leading-[1.4em] hover:text-[#FD521B] transition-colors">Partners</Link>
            </div>

            {/* Company */}
            <div className="flex flex-col gap-[12px] shrink-0">
              <h4 className="text-[14px] font-[700] text-[#FFF9F5] leading-[1.4em]">Company</h4>
              <Link href="/about" className="text-[14px] font-[400] text-[#F7F7F7] leading-[1.4em] hover:text-[#FD521B] transition-colors">About Us</Link>
              <Link href="/careers" className="text-[14px] font-[400] text-[#F7F7F7] leading-[1.4em] hover:text-[#FD521B] transition-colors">Careers</Link>
              <Link href="/blog" className="text-[14px] font-[400] text-[#F7F7F7] leading-[1.4em] hover:text-[#FD521B] transition-colors">Blog</Link>
            </div>

            {/* Support */}
            <div className="flex flex-col gap-[12px] shrink-0">
              <h4 className="text-[14px] font-[700] text-[#FFF9F5] leading-[1.4em]">Support</h4>
              <Link href="/help" className="text-[14px] font-[400] text-[#F7F7F7] leading-[1.4em] hover:text-[#FD521B] transition-colors">Help Center</Link>
              <Link href="/support" className="text-[14px] font-[400] text-[#F7F7F7] leading-[1.4em] hover:text-[#FD521B] transition-colors">Contact Us</Link>
              <Link href="/faq" className="text-[14px] font-[400] text-[#F7F7F7] leading-[1.4em] hover:text-[#FD521B] transition-colors">FAQ</Link>
            </div>

            {/* Legal */}
            <div className="flex flex-col gap-[12px] shrink-0">
              <h4 className="text-[14px] font-[700] text-[#FFF9F5] leading-[1.4em]">Legal</h4>
              <Link href="/privacy" className="text-[14px] font-[400] text-[#F7F7F7] leading-[1.4em] hover:text-[#FD521B] transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-[14px] font-[400] text-[#F7F7F7] leading-[1.4em] hover:text-[#FD521B] transition-colors">Terms of Service</Link>
              <Link href="/refund" className="text-[14px] font-[400] text-[#F7F7F7] leading-[1.4em] hover:text-[#FD521B] transition-colors">Refund Policy</Link>
            </div>

            {/* Download eSIM App */}
            <div className="flex flex-col gap-[12px] shrink-0">
              <h4 className="text-sm md:text-base font-semibold text-[#FFF9F5] leading-[1.4em] whitespace-nowrap">
                Download eSIM App
              </h4>
              <div className="flex flex-col gap-[10px]">
                <a
                  href="https://play.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-[10px] px-[12px] py-[8px] bg-[#FFFFFF] rounded-[10px] text-[#252F4A] hover:bg-gray-100 transition-colors shrink-0 shadow-sm"
                >
                  <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 512 512">
                    <path fill="#41A5EE" d="M382.9 240.5l-275-161.4C90.3 68.9 76 77.2 76 96v320c0 18.8 14.3 27.1 31.9 16.9l275-161.4c16.1-9.5 16.1-21.5 0-31z"/>
                    <path fill="#00E676" d="M307.9 256l-195-195c-7-7-16.9-8.6-25-4.1l220 220 22-20.9z"/>
                    <path fill="#FF3D00" d="M307.9 256l-220 220c8.1 4.5 18 2.9 25-4.1l195-195-22-20.9z"/>
                    <path fill="#FFC107" d="M382.9 240.5l-75 44.1 22 20.9 53-53c16.1-9.5 16.1-21.5 0-32z"/>
                  </svg>
                  <div className="flex flex-col text-left leading-tight">
                    <span className="text-[8px] uppercase font-bold text-gray-500 tracking-wider">GET IT ON</span>
                    <span className="text-[13px] font-bold text-[#000000]">Google Play</span>
                  </div>
                </a>

                <a
                  href="https://apple.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-[10px] px-[12px] py-[8px] bg-[#FFFFFF] rounded-[10px] text-[#252F4A] hover:bg-gray-100 transition-colors shrink-0 shadow-sm"
                >
                  <svg className="w-[18px] h-[18px] shrink-0 fill-current text-[#000000]" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-5.03.13-9.89-1.92-14.58-6.15-3.04-2.64-6.93-7.26-11.67-13.86-5.87-8.17-10.47-17.15-13.8-26.96-3.33-9.8-5-19.16-5-28.08 0-13.06 3.23-24.08 9.7-33.06 6.46-8.98 14.77-13.57 24.91-13.78 4.48 0 9.47 1.15 14.97 3.44 5.5 2.3 9.29 3.45 11.37 3.45 1.83 0 5.72-1.2 11.67-3.6 5.95-2.4 10.87-3.52 14.76-3.35 11.03.49 19.82 4.67 26.37 12.54-9.76 5.88-14.5 13.97-14.23 24.28.27 7.95 3.28 14.65 9.03 20.1 5.76 5.45 12.7 8.44 20.83 8.97-2.45 7.18-5.77 14.37-9.97 21.57zm-26.68-101.44c0 6.09-2.22 11.95-6.66 17.58-5.18 6.44-11.45 10.05-18.8 10.83-.27-1.08-.41-2.18-.41-3.3 0-6.19 2.4-12.33 7.21-18.42 4.8-6.09 11.12-9.77 18.96-11.04.14.78.2 1.58.2 2.35z"/>
                  </svg>
                  <div className="flex flex-col text-left leading-tight">
                    <span className="text-[8px] uppercase font-bold text-gray-500 tracking-wider">DOWNLOAD ON THE</span>
                    <span className="text-[13px] font-bold text-[#000000]">App Store</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <div className="w-full h-[1px] bg-[#4B5675]" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[12px] font-[400] text-[#F7F7F7]">
          <span>© 2026 Soovia. All rights reserved.</span>
          <div className="flex items-center gap-[16px]">
            <Link href="/privacy" className="hover:text-[#FD521B] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#FD521B] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
