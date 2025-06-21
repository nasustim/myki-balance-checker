import type React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  className = '',
  onClick,
}: CardProps) {
  const baseClasses = 'rounded-lg transition-all-smooth';

  const variantClasses = {
    default: 'bg-white border border-gray-200 shadow-sm',
    elevated: 'bg-white shadow-md border-0',
    outlined: 'bg-white border-2 border-gray-200 shadow-none',
    glass: 'glass-effect text-white',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  const hoverClasses = hover ? 'card-hover cursor-pointer' : '';

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick();
    }
  };

  const Component = onClick ? 'button' : 'div';
  const interactiveProps = onClick
    ? {
        onClick,
        onKeyDown: handleKeyDown,
        role: 'button',
        tabIndex: 0,
        'aria-pressed': false,
      }
    : {};

  return (
    <Component
      className={`
        ${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${className} `}
      {...interactiveProps}
    >
      {children}
    </Component>
  );
}

// Specialized card components
export function MykiCard({ children, className = '', ...props }: Omit<CardProps, 'variant'>) {
  return (
    <Card
      variant="elevated"
      className={`bg-gradient-to-br from-blue-500 to-green-500 text-white shadow-xl ${className} `}
      {...props}
    >
      {children}
    </Card>
  );
}

export function InfoCard({ children, className = '', ...props }: Omit<CardProps, 'variant'>) {
  return (
    <Card variant="outlined" className={`border-blue-200 bg-blue-50 ${className} `} {...props}>
      {children}
    </Card>
  );
}

export function SuccessCard({ children, className = '', ...props }: Omit<CardProps, 'variant'>) {
  return (
    <Card variant="outlined" className={`border-green-200 bg-green-50 ${className} `} {...props}>
      {children}
    </Card>
  );
}

export function ErrorCard({ children, className = '', ...props }: Omit<CardProps, 'variant'>) {
  return (
    <Card variant="outlined" className={`border-red-200 bg-red-50 ${className} `} {...props}>
      {children}
    </Card>
  );
}
