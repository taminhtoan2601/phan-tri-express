'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Zone } from '@/types/system-configuration';
import { fakeZones } from '@/constants/mock-system-config';
import { ZonesTable } from './zones-table';
import { columns } from './columns';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Get property value from a zone based on field name
 * @param zone The zone object
 * @param field The field name to access
 * @returns The value of the field or empty string if not found
 */
const getZoneProperty = (zone: Zone, field: string): string | number => {
  switch (field) {
    case 'id':
      return zone.id;
    case 'name':
      return zone.name;
    default:
      return '';
  }
};

/**
 * Fetches zones with filtering, pagination, and sorting
 */
const getZones = async (
  filters?: Record<string, any>
): Promise<{
  zones: Zone[];
  total: number;
}> => {
  // Get all zones from API
  let allZones = await fakeZones.getAll();
  // If no zones are returned, use some default data
  if (!allZones || allZones.length === 0) {
    fakeZones.initialize();
    allZones = await fakeZones.getAll();
  }
  // Apply filtering
  let filteredZones = [...allZones];

  if (filters) {
    // Apply name search filter
    if (filters.name) {
      const searchTerm = filters.name.toLowerCase();
      filteredZones = filteredZones.filter((zone) =>
        zone.name.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    if (filters.sort && filters.sort.length > 0) {
      const [field, direction] = filters.sort[0].split('.');
      const multiplier = direction === 'desc' ? -1 : 1;

      filteredZones.sort((a, b) => {
        // Safely access properties with type checking
        const aValue = getZoneProperty(a, field);
        const bValue = getZoneProperty(b, field);

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
  const paginatedZones = filteredZones.slice(startIndex, endIndex);

  return {
    zones: paginatedZones,
    total: filteredZones.length
  };
};

/**
 * Zones listing component - fetches and displays zones with filtering
 */
export function ZonesListing() {
  const searchParams = useSearchParams();

  // Get filter values from URL search params
  const page = Number(searchParams.get('page') || 1);
  const perPage = Number(searchParams.get('perPage') || 10);
  const name = searchParams.get('name') || '';
  const sort = searchParams.get('sort')?.split(',') || [];

  // Create filters object from search params
  const filters = {
    page,
    perPage,
    ...(name && { name }),
    ...(sort.length > 0 && { sort })
  };

  // Fetch zones data with filters
  const { data: zonesData, isLoading: isLoadingZones } = useQuery({
    queryKey: ['zones', filters],
    queryFn: () => getZones(filters),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });
  console.log(zonesData);
  // Display skeleton loader while data is loading
  if (isLoadingZones) {
    return <ZonesTableSkeleton />;
  }

  // Display the zones table with data
  return (
    <ZonesTable
      data={zonesData?.zones || []}
      totalItems={zonesData?.total || 0}
      columns={columns}
    />
  );
}

/**
 * Skeleton component for zones table
 */
function ZonesTableSkeleton() {
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
              <Skeleton className='h-6 w-40' />
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
