import React, { ReactNode } from 'react';

interface BaseLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({
  children,
  title = 'Default Title',
  description = 'Default Description',
  className = '',
}) => {
  return (
    <main className={`min-h-screen ${className}`}>
      {children}
    </main>
  );
};

export default BaseLayout; 