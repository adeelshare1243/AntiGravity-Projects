'use client';

import React, { useState } from 'react';
import { X, Search, CheckCircle2, Smartphone, HelpCircle } from 'lucide-react';

interface DeviceCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUPPORTED_DEVICES = [
  { brand: 'Apple iPhone', models: ['iPhone 16 Pro Max / 16 Pro / 16', 'iPhone 15 / 15 Plus / 15 Pro Max', 'iPhone 14 / 14 Plus / 14 Pro Max', 'iPhone 13 / 13 mini / 13 Pro', 'iPhone 12 / 12 Pro / 12 mini', 'iPhone 11 / 11 Pro', 'iPhone XS / XS Max / XR', 'iPhone SE (2nd & 3rd gen)'] },
  { brand: 'Samsung Galaxy', models: ['Galaxy S24 / S24+ / S24 Ultra', 'Galaxy S23 / S23+ / S23 Ultra', 'Galaxy S22 / S22+ / S22 Ultra', 'Galaxy S21 / S21+ 5G', 'Galaxy Z Fold5 / Z Flip5', 'Galaxy Z Fold4 / Z Flip4', 'Galaxy Note 20 / Note 20 Ultra'] },
  { brand: 'Google Pixel', models: ['Pixel 9 / 9 Pro / 9 Fold', 'Pixel 8 / 8 Pro / 8a', 'Pixel 7 / 7 Pro / 7a', 'Pixel 6 / 6 Pro / 6a', 'Pixel 5 / 4 / 4a 5G'] },
  { brand: 'Others (Xiaomi, Motorola, iPad)', models: ['Xiaomi 13T Pro / 14', 'Motorola Razr 40 / Edge 40', 'iPad Pro 11" (1st gen+)', 'iPad Air (3rd gen+)'] },
];

export const DeviceCheckerModal: React.FC<DeviceCheckerModalProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-modal border border-grey-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-grey-100 bg-brand-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-md shadow-brand-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-dark-800">eSIM Device Compatibility Checker</h3>
              <p className="text-xs text-dark-400">Over 200+ smartphones and tablets support digital eSIM</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-dark-300 hover:text-dark-800 hover:bg-grey-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-grey-100 bg-white">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-dark-300" />
            <input
              type="text"
              placeholder="Search your phone model (e.g. iPhone 15, Galaxy S23)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-grey-100 rounded-xl border border-grey-200 focus:border-brand-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* List of Supported Devices */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {SUPPORTED_DEVICES.map((group) => {
            const filteredModels = group.models.filter((m) =>
              m.toLowerCase().includes(search.toLowerCase())
            );

            if (search && filteredModels.length === 0) return null;

            return (
              <div key={group.brand} className="space-y-2.5">
                <h4 className="text-sm font-bold text-dark-700 flex items-center gap-2">
                  <span>{group.brand}</span>
                  <span className="text-xs font-normal text-dark-300">({filteredModels.length} models)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredModels.map((model) => (
                    <div
                      key={model}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-grey-50 border border-grey-100 hover:border-brand-300 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4 text-status-success flex-shrink-0" />
                      <span className="text-xs font-medium text-dark-600">{model}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="mt-4 p-4 rounded-2xl bg-brand-50/70 border border-brand-100 text-xs text-brand-900 flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Quick Check Code:</span> Dial <code className="font-mono bg-white px-1.5 py-0.5 rounded text-brand-600 font-bold">*#06#</code> on your phone dialer. If you see an <strong>EID number</strong> listed, your phone is 100% eSIM ready!
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-grey-100 bg-grey-50 flex items-center justify-between">
          <span className="text-xs text-dark-400">Need help verifying? Chat with our 24/7 support.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-dark-800 hover:bg-dark-900 text-white rounded-xl transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceCheckerModal;
