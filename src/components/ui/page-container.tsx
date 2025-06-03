/**
 * Page Container Component
 * A consistent container for page content with optional scrolling behavior
 */
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  scrollable?: boolean;
  className?: string;
}

/**
 * Page container component with consistent padding and optional scrolling
 */
export function PageContainer({
  children,
  title,
  description,
  scrollable = true,
  className
}: PageContainerProps) {
  return (
    <div
      className={cn(
        'container mx-auto py-6',
        scrollable ? 'overflow-auto' : 'overflow-hidden',
        className
      )}
    >
      {(title || description) && (
        <div className='mb-6'>
          {title && <h1 className='text-2xl font-bold'>{title}</h1>}
          {description && (
            <p className='text-muted-foreground'>{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
