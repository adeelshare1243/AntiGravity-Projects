'use client';
import React from 'react';

export interface SelectProps {
  children?: React.ReactNode;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({ children, className = '' }) => {
  return <div className={`ui-select ${className}`}>{children || 'Select Stub'}</div>;
};

export default Select;
