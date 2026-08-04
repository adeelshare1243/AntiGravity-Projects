'use client';
import React from 'react';

export interface TabsProps {
  children?: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ children, className = '' }) => {
  return <div className={`ui-tabs ${className}`}>{children || 'Tabs Stub'}</div>;
};

export default Tabs;
