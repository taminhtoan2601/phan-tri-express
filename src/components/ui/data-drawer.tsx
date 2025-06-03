/**
 * Data Drawer Component
 * A slide-out drawer for displaying forms and detailed content
 */
'use client';

import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface DataDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * DataDrawer component that slides in from the right side of the screen
 */
export function DataDrawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  className
}: DataDrawerProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'bg-background/80 fixed inset-0 z-40 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          'bg-background fixed top-0 right-0 z-50 h-full w-full max-w-md transform p-6 shadow-lg transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
          className
        )}
      >
        {/* Header */}
        <div className='mb-6 flex items-start justify-between'>
          <div>
            <h2 className='text-xl font-semibold'>{title}</h2>
            {description && (
              <p className='text-muted-foreground mt-1 text-sm'>
                {description}
              </p>
            )}
          </div>
          <Button
            variant='ghost'
            size='icon'
            className='rounded-full'
            onClick={onClose}
          >
            <X className='h-4 w-4' />
            <span className='sr-only'>Close</span>
          </Button>
        </div>

        {/* Content */}
        <div className='max-h-[calc(100vh-8rem)] overflow-y-auto'>
          {children}
        </div>
      </div>
    </>
  );
}
