'use client';
import React from 'react';

export interface DropdownProps {
  children?: React.ReactNode;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ children, className = '' }) => {
  return <div className={`ui-dropdown ${className}`}>{children || 'Dropdown Stub'}</div>;
};

export default Dropdown;
