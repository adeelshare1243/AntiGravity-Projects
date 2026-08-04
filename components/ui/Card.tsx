'use client';
import React from 'react';

export interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return <div className={`ui-card ${className}`}>{children || 'Card Stub'}</div>;
};

export default Card;
