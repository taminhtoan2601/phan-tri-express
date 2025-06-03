'use client';

import { Price } from '@/types/system-configuration';
import { fakePrices } from '@/constants/mock-system-config';
import { useQuery } from '@tanstack/react-query';
import { PricesTable } from './prices-table';
import { columns } from './prices-columns';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams } from 'next/navigation';

/**
 * Helper function to safely access Country properties
 * @param country The country object
 * @param field The field name to access
 * @returns The value of the field or empty string if not found
 */
const getPriceProperty = (price: Price, field: string): string | number => {
  switch (field) {
    case 'id':
      return price.id;
    case 'routeId':
      return price.routeId;
    case 'shippingServiceId':
      return price.shippingServiceId;
    case 'baseRatePerKg':
      return price.baseRatePerKg;
    case 'effectiveDate':
      return price.effectiveDate;
    case 'deletionDate':
      return price.deletionDate || '';
    default:
      return '';
  }
};

/**
 * Fetches routes with filtering, pagination, and sorting
 */
const getPrices = async (
  filters?: Record<string, any>
): Promise<{
  prices: Price[];
  total: number;
}> => {
  // Get all routes (in a real app this would have server-side filtering)
  const allPrices = await fakePrices.getAll();

  // If no routes are returned, use some default data
  if (!allPrices || allPrices.length === 0) {
    // Reinitialize the mock data
    fakePrices.initialize();
  }
  // Apply filtering
  let filteredPrices = [...allPrices];
  if (filters) {
    // Apply name search filter
    if (filters.routeId) {
      const searchTerm = filters.routeId.toString();
      filteredPrices = filteredPrices.filter((price) =>
        price.routeId.toString().includes(searchTerm)
      );
    }

    // Apply continent filter
    if (filters.shippingServiceId && filters.shippingServiceId.length > 0) {
      filteredPrices = filteredPrices.filter((price) =>
        filters.shippingServiceId.includes(price.shippingServiceId)
      );
    }

    // Apply code2 filter
    if (filters.baseRatePerKg) {
      const searchTerm = filters.baseRatePerKg.toString();
      filteredPrices = filteredPrices.filter((price) =>
        price.baseRatePerKg.toString().includes(searchTerm)
      );
    }

    // Apply code3 filter
    if (filters.effectiveDate) {
      const searchTerm = filters.effectiveDate.toString();
      filteredPrices = filteredPrices.filter((price) =>
        price.effectiveDate.toString().includes(searchTerm)
      );
    }

    if (filters.deletionDate) {
      const searchTerm = filters.deletionDate.toString();
      filteredPrices = filteredPrices.filter((price) =>
        price.deletionDate?.toString().includes(searchTerm)
      );
    }
    // Apply sorting
    if (filters.sort && filters.sort.length > 0) {
      const [field, direction] = filters.sort[0].split('.');
      const multiplier = direction === 'desc' ? -1 : 1;

      filteredPrices.sort((a, b) => {
        // Safely access properties with type checking
        const aValue = getPriceProperty(a, field);
        const bValue = getPriceProperty(b, field);

        if (aValue < bValue) return -1 * multiplier;
        if (aValue > bValue) return 1 * multiplier;
        return 0;
      });
    }
  }
  // Apply pagination
  const page = filters?.page || 1;
  const limit = filters?.perPage || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPrices = filteredPrices.slice(startIndex, endIndex);

  return {
    prices: paginatedPrices,
    total: filteredPrices.length
  };
};

/**
 * Component that displays the routes listing with advanced table features
 */
export function PricesListing() {
  const searchParams = useSearchParams();

  // Get filter values from URL search params
  const page = Number(searchParams.get('page') || 1);
  const perPage = Number(searchParams.get('perPage') || 10);
  const routeId = searchParams.get('routeId') || '';
  const shippingServiceId = searchParams.get('shippingServiceId') || '';
  const baseRatePerKg = searchParams.get('baseRatePerKg') || '';
  const effectiveDate = searchParams.get('effectiveDate') || '';
  const deletionDate = searchParams.get('deletionDate') || '';
  const sort = searchParams.get('sort')?.split(',') || [];

  // Create filters object from search params
  const filters = {
    page,
    perPage,
    ...(routeId && { routeId }),
    ...(shippingServiceId && { shippingServiceId }),
    ...(baseRatePerKg && { baseRatePerKg }),
    ...(effectiveDate && { effectiveDate }),
    ...(deletionDate && { deletionDate }),
    ...(sort.length > 0 && { sort })
  };

  // Fetch countries data with filters
  const { data: pricesData, isLoading: isLoadingPrices } = useQuery({
    queryKey: ['prices', filters],
    queryFn: () => getPrices(filters),
    staleTime: 0, // Don't cache the data
    refetchOnMount: true, // Always refetch when the component mounts
    refetchOnWindowFocus: true // Refetch when the window regains focus
  });

  // Display skeleton loader while data is loading
  if (isLoadingPrices) {
    return <PricesTableSkeleton />;
  }
  // Display  the prices table with data
  return (
    <PricesTable
      data={pricesData?.prices || []}
      totalItems={pricesData?.total || 0}
      columns={columns}
    />
  );
}

/**
 * Skeleton loader for the prices table while data is loading
 */
function PricesTableSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='flex justify-end'>
        <Skeleton className='h-10 w-32' />
      </div>
      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <Skeleton className='h-10 w-full max-w-md' />
          <Skeleton className='h-10 w-32' />
        </div>
        <div className='rounded-md border'>
          <div className='bg-muted/50 h-10 border-b px-4' />
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className='flex items-center space-x-4 border-b px-4 py-2'
            >
              <Skeleton className='h-6 w-6' />
              <Skeleton className='h-6 w-24' />
              <Skeleton className='h-6 w-32' />
              <Skeleton className='h-6 w-40' />
              <Skeleton className='h-6 w-24' />
              <Skeleton className='h-6 w-24' />
              <div className='ml-auto flex space-x-2'>
                <Skeleton className='h-8 w-8' />
                <Skeleton className='h-8 w-8' />
              </div>
            </div>
          ))}
        </div>
        <div className='flex items-center justify-end space-x-2'>
          <Skeleton className='h-8 w-24' />
          <Skeleton className='h-8 w-20' />
        </div>
      </div>
    </div>
  );
}
