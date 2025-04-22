import React, { ReactNode } from 'react';
import BaseLayout from '../layouts/BaseLayout';

interface PageTemplateProps {
  children: ReactNode;
  title?: string;
  description?: string;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

const PageTemplate: React.FC<PageTemplateProps> = ({
  children,
  title,
  description,
  header,
  footer,
  className = '',
}) => {
  return (
    <BaseLayout title={title} description={description}>
      {header && <header>{header}</header>}
      <div className={`container mx-auto px-4 py-8 ${className}`}>
        {children}
      </div>
      {footer && <footer>{footer}</footer>}
    </BaseLayout>
  );
};

export default PageTemplate; 