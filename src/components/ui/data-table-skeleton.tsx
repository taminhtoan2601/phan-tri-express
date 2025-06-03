/**
 * DataTable Skeleton Component
 * Provides a loading skeleton for data tables while data is being fetched
 */
'use client';

import { Skeleton } from '@/components/ui/skeleton';

interface DataTableSkeletonProps {
  columnCount?: number;
  rowCount?: number;
  filterCount?: number;
}

/**
 * DataTable skeleton component for loading states
 */
export function DataTableSkeleton({
  columnCount = 5,
  rowCount = 10,
  filterCount = 2
}: DataTableSkeletonProps) {
  return (
    <div className='space-y-4'>
      {/* Header and Filters */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          {Array(filterCount)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} className='h-9 w-[150px] rounded-md' />
            ))}
        </div>
        <div className='flex space-x-2'>
          <Skeleton className='h-9 w-[80px] rounded-md' />
          <Skeleton className='h-9 w-[100px] rounded-md' />
        </div>
      </div>

      {/* Table */}
      <div className='rounded-md border'>
        <div className='border-b'>
          <div className='flex h-12 items-center px-4'>
            {Array(columnCount)
              .fill(0)
              .map((_, index) => (
                <div key={index} className='flex-1'>
                  <Skeleton className='h-4 w-[80%]' />
                </div>
              ))}
          </div>
        </div>
        <div>
          {Array(rowCount)
            .fill(0)
            .map((_, rowIndex) => (
              <div
                key={rowIndex}
                className='flex h-16 items-center border-b px-4 last:border-0'
              >
                {Array(columnCount)
                  .fill(0)
                  .map((_, colIndex) => (
                    <div key={colIndex} className='flex-1'>
                      <Skeleton className='h-4 w-[80%]' />
                    </div>
                  ))}
              </div>
            ))}
        </div>
      </div>

      {/* Pagination */}
      <div className='flex items-center justify-end space-x-2'>
        <Skeleton className='h-9 w-[80px] rounded-md' />
        <Skeleton className='h-9 w-[80px] rounded-md' />
      </div>
    </div>
  );
}
