'use client';
import React from 'react';

export interface InputProps {
  children?: React.ReactNode;
  className?: string;
}

export const Input: React.FC<InputProps> = ({ children, className = '' }) => {
  return <div className={`ui-input ${className}`}>{children || 'Input Stub'}</div>;
};

export default Input;
