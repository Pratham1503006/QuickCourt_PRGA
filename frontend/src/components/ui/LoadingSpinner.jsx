import React from 'react';
import { cn } from '../../utils/cn';

const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'default',
  className = '',
  text = '',
  centered = true
}) => {
  const sizeClasses = {
    xs: 'h-3 w-3 border-[1.5px]',
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-[3px]',
    xl: 'h-12 w-12 border-4'
  };

  const variants = {
    default: 'border-muted-foreground/30 border-t-primary',
    primary: 'border-primary/20 border-t-primary',
    secondary: 'border-secondary/30 border-t-secondary',
    success: 'border-emerald-200 border-t-emerald-600',
    warning: 'border-amber-200 border-t-amber-600',
    danger: 'border-red-200 border-t-red-600',
    white: 'border-white/30 border-t-white',
    ghost: 'border-transparent border-t-current'
  };

  const SpinnerElement = () => (
    <div 
      className={cn(
        'animate-spin rounded-full',
        sizeClasses[size],
        variants[variant],
        className
      )}
      aria-label="Loading..."
      role="status"
    />
  );

  if (!text && !centered) {
    return <SpinnerElement />;
  }

  return (
    <div className={cn(
      'flex items-center gap-3',
      centered && 'justify-center',
      text && 'flex-col gap-2'
    )}>
      <SpinnerElement />
      {text && (
        <span className="text-sm text-muted-foreground font-medium">
          {text}
        </span>
      )}
    </div>
  );
};

// Pulse Loading Component
export const PulseLoader = ({ 
  size = 'md',
  className = '',
  dots = 3
}) => {
  const sizeClasses = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-3 w-3'
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: dots }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'rounded-full bg-primary animate-pulse',
            sizeClasses[size]
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );
};

// Skeleton Loading Component
export const Skeleton = ({ 
  className = '',
  variant = 'rounded',
  ...props 
}) => {
  const variants = {
    rounded: 'rounded-md',
    circle: 'rounded-full',
    square: 'rounded-none',
    pill: 'rounded-full'
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-muted',
        variants[variant],
        className
      )}
      {...props}
    />
  );
};

export default LoadingSpinner;
