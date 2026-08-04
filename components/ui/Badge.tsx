'use client';
import React from 'react';

export interface BadgeProps {
  children?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, className = '' }) => {
  return <div className={`ui-badge ${className}`}>{children || 'Badge Stub'}</div>;
};

export default Badge;
