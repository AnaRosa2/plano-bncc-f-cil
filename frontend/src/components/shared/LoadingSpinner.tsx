import React from 'react';
import { Sparkles } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Gerando com IA...',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div className="relative">
        <div className={`loading-spinner ${sizeClasses[size]} text-primary`} />
        <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-bncc animate-pulse" />
      </div>
      <p className="text-sm text-muted-foreground animate-pulse-soft">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
