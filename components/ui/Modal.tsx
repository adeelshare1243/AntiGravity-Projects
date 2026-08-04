'use client';
import React from 'react';

export interface ModalProps {
  children?: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({ children, className = '' }) => {
  return <div className={`ui-modal ${className}`}>{children || 'Modal Stub'}</div>;
};

export default Modal;
