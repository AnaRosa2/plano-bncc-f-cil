import React, { ReactNode } from 'react';
import Header from './Header';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageContainerProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  breadcrumbs = [],
  className = '',
}) => {
  return (
    <div className="min-h-screen bg-background">
      <Header breadcrumbs={breadcrumbs} />
      <main className={`container py-6 md:py-8 animate-fade-in ${className}`}>
        {children}
      </main>
    </div>
  );
};

export default PageContainer;
