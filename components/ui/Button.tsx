'use client';

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'light';
  size?: 'lg' | 'md' | 'sm' | 'xs';
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      iconLeft,
      iconRight,
      children,
      className = '',
      type = 'button',
      disabled,
      ...props
    },
    ref
  ) => {
    // 1. Base Styles
    const baseStyles =
      'inline-flex items-center justify-center rounded-[10px] font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

    // 2. Color Variants
    const variantStyles = {
      primary: 'bg-brand-secondary text-white hover:shadow-md active:scale-[0.99]',
      secondary:
        'bg-brand-offWhite text-darkScale-800 hover:shadow-[0px_4px_12px_rgba(244,236,229,0.3)] active:scale-[0.99]',
      light:
        'bg-white border border-[#E8E5DD] text-darkScale-800 hover:bg-brand-light hover:shadow-[0px_4px_12px_rgba(0,0,0,0.07)] active:scale-[0.99]',
    };

    // 3. Size Variants
    const sizeStyles = {
      lg: 'h-[50px] px-[16px] py-[14px] text-body-lg gap-[6px]',
      md: 'h-[42px] px-[12px] py-[11px] text-body-md gap-[5px]',
      sm: 'h-[33px] px-[10px] py-[9px] text-body-sm gap-[4px]',
      xs: 'h-[29px] px-[8px] py-[8px] text-body-xs gap-[3px]',
    };

    const combinedClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim();

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={combinedClasses}
        {...props}
      >
        {iconLeft && <span className="inline-flex shrink-0 items-center">{iconLeft}</span>}
        {children && <span>{children}</span>}
        {iconRight && <span className="inline-flex shrink-0 items-center">{iconRight}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
