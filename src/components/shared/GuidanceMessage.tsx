import React, { ReactNode } from 'react';
import { Info, Lightbulb, BookOpen } from 'lucide-react';

interface GuidanceMessageProps {
  children: ReactNode;
  variant?: 'info' | 'tip' | 'bncc';
  className?: string;
}

const GuidanceMessage: React.FC<GuidanceMessageProps> = ({
  children,
  variant = 'info',
  className = '',
}) => {
  // Não renderizar variantes BNCC por padrão — removido conforme solicitação do usuário
  if (variant === 'bncc') return null;
  const icons = {
    info: Info,
    tip: Lightbulb,
    bncc: BookOpen,
  };

  const styles = {
    info: 'bg-primary/5 border-l-primary',
    tip: 'bg-warning/10 border-l-warning',
    bncc: 'bg-bncc/5 border-l-bncc',
  };

  const iconStyles = {
    info: 'text-primary',
    tip: 'text-warning',
    bncc: 'text-bncc',
  };

  const Icon = icons[variant];

  return (
    <div className={`guidance-message ${styles[variant]} flex gap-3 ${className}`}>
      <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${iconStyles[variant]}`} />
      <div className="text-sm text-muted-foreground">{children}</div>
    </div>
  );
};

export default GuidanceMessage;
