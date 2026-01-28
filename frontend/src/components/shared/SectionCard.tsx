import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionCardProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  icon: Icon,
  children,
  className = '',
  headerAction,
}) => {
  return (
    <div className={`content-section ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-primary" />}
          <h3 className="font-medium text-foreground">{title}</h3>
        </div>
        {headerAction}
      </div>
      <div className="text-base leading-relaxed text-muted-foreground whitespace-pre-line antialiased">
        {children}
      </div>
    </div>
  );
};

export default SectionCard;
