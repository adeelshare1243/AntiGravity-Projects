'use client';
import React from 'react';

interface InstallGuideModalProps {
  esim?: any;
  isOpen?: boolean;
  onClose?: () => void;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({ esim, isOpen = true, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full flex flex-col gap-4">
        <h3 className="text-lg font-bold text-[#000000]">eSIM Installation Guide</h3>
        <p className="text-sm text-[#4B5675]">Scan the QR code in your phone settings to activate your eSIM.</p>
        <button onClick={onClose} className="self-end px-4 py-2 bg-[#FD521B] text-white font-medium rounded-lg text-sm">
          Close
        </button>
      </div>
    </div>
  );
};

export default InstallGuideModal;
