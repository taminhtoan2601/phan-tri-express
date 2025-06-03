'use client';

import { Country, Route } from '@/types/system-configuration';
import {
  fakeCities,
  fakeCountries,
  fakeRoutes,
  fakeZones
} from '@/constants/mock-system-config';
import { useQuery } from '@tanstack/react-query';
import { RoutesTable } from './routes-table';
import { columns } from './routes-columns';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams } from 'next/navigation';

/**
 * Helper function to safely access Country properties
 * @param country The country object
 * @param field The field name to access
 * @returns The value of the field or empty string if not found
 */
const getRouteProperty = (route: Route, field: string): string | number => {
  switch (field) {
    case 'id':
      return route.id;
    case 'zoneId':
      return route.zoneId;
    case 'originCountryId':
      return route.originCountryId;
    case 'originCityId':
      return route.originCityId;
    case 'destinationCountryId':
      return route.destinationCountryId;
    case 'destinationCityId':
      return route.destinationCityId;
    default:
      return '';
  }
};

/**
 * Fetches routes with filtering, pagination, and sorting
 */
const getRoutes = async (
  filters?: Record<string, any>
): Promise<{
  routes: Route[];
  total: number;
}> => {
  // Get all routes (in a real app this would have server-side filtering)
  const allRoutes = await fakeRoutes.getAll();

  // If no routes are returned, use some default data
  if (!allRoutes || allRoutes.length === 0) {
    // Reinitialize the mock data
    fakeRoutes.initialize();
  }
  // Apply filtering
  let filteredRoutes = [...allRoutes];
  if (filters) {
    // Apply name search filter
    if (filters.zoneId) {
      const searchTerm = filters.zoneId.toString();
      filteredRoutes = filteredRoutes.filter((route) =>
        route.zoneId.toString().includes(searchTerm)
      );
    }

    // Apply continent filter
    if (filters.originCountryId && filters.originCountryId.length > 0) {
      filteredRoutes = filteredRoutes.filter((route) =>
        filters.originCountryId.includes(route.originCountryId)
      );
    }

    // Apply code2 filter
    if (filters.originCityId) {
      const searchTerm = filters.originCityId.toString();
      filteredRoutes = filteredRoutes.filter((route) =>
        route.originCityId.toString().includes(searchTerm)
      );
    }

    // Apply code3 filter
    if (filters.destinationCountryId) {
      const searchTerm = filters.destinationCountryId.toString();
      filteredRoutes = filteredRoutes.filter((route) =>
        route.destinationCountryId.toString().includes(searchTerm)
      );
    }

    if (filters.destinationCityId) {
      const searchTerm = filters.destinationCityId.toString();
      filteredRoutes = filteredRoutes.filter((route) =>
        route.destinationCityId.toString().includes(searchTerm)
      );
    }
    // Apply sorting
    if (filters.sort && filters.sort.length > 0) {
      const [field, direction] = filters.sort[0].split('.');
      const multiplier = direction === 'desc' ? -1 : 1;

      filteredRoutes.sort((a, b) => {
        // Safely access properties with type checking
        const aValue = getRouteProperty(a, field);
        const bValue = getRouteProperty(b, field);

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
  const paginatedRoutes = filteredRoutes.slice(startIndex, endIndex);

  return {
    routes: paginatedRoutes,
    total: filteredRoutes.length
  };
};

/**
 * Component that displays the routes listing with advanced table features
 */
export function RoutesListing() {
  const searchParams = useSearchParams();

  // Get filter values from URL search params
  const page = Number(searchParams.get('page') || 1);
  const perPage = Number(searchParams.get('perPage') || 10);
  const zoneId = searchParams.get('zoneId') || '';
  const originCountryId = searchParams.get('originCountryId') || '';
  const originCityId = searchParams.get('originCityId') || '';
  const destinationCountryId = searchParams.get('destinationCountryId') || '';
  const destinationCityId = searchParams.get('destinationCityId') || '';
  const sort = searchParams.get('sort')?.split(',') || [];

  // Create filters object from search params
  const filters = {
    page,
    perPage,
    ...(zoneId && { zoneId }),
    ...(originCountryId && { originCountryId }),
    ...(originCityId && { originCityId }),
    ...(destinationCountryId && { destinationCountryId }),
    ...(destinationCityId && { destinationCityId }),
    ...(sort.length > 0 && { sort })
  };

  // Fetch countries data with filters
  const { data: routesData, isLoading: isLoadingRoutes } = useQuery({
    queryKey: ['routes', filters],
    queryFn: () => getRoutes(filters),
    staleTime: 0, // Don't cache the data
    refetchOnMount: true, // Always refetch when the component mounts
    refetchOnWindowFocus: true // Refetch when the window regains focus
  });

  // Display skeleton loader while data is loading
  if (isLoadingRoutes) {
    return <RoutesTableSkeleton />;
  }

  // Display the routes table with data
  return (
    <RoutesTable
      data={routesData?.routes || []}
      totalItems={routesData?.total || 0}
      columns={columns}
    />
  );
}

/**
 * Skeleton loader for the routes table while data is loading
 */
function RoutesTableSkeleton() {
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
