'use client';
import React from 'react';

interface TopUpModalProps {
  esim?: any;
  isOpen?: boolean;
  onClose?: () => void;
}

export const TopUpModal: React.FC<TopUpModalProps> = ({ esim, isOpen = true, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full flex flex-col gap-4">
        <h3 className="text-lg font-bold text-[#000000]">Top Up Data</h3>
        <p className="text-sm text-[#4B5675]">Add additional data to your active eSIM ({esim?.country || 'eSIM'}).</p>
        <button onClick={onClose} className="self-end px-4 py-2 bg-[#FD521B] text-white font-medium rounded-lg text-sm">
          Close
        </button>
      </div>
    </div>
  );
};

export default TopUpModal;
