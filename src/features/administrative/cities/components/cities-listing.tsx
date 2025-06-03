'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { City, Country } from '@/types/system-configuration';
import { fakeCities, fakeCountries } from '@/constants/mock-system-config';
import { CitiesTable, CitiesTableSkeleton } from './cities-table';
import { columns } from './columns';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Get property value from a city based on field name
 * @param city The city object
 * @param field The field name to access
 * @returns The value of the field or empty string if not found
 */
const getCityProperty = (city: City, field: string): string | number => {
  switch (field) {
    case 'id':
      return city.id;
    case 'name':
      return city.name;
    case 'countryId':
      return city.countryId;
    default:
      return '';
  }
};

/**
 * Fetches cities with filtering, pagination, and sorting
 * Joins with country data for more complete information
 */
const getCities = async (
  filters?: Record<string, any>
): Promise<{
  cities: City[];
  total: number;
}> => {
  // Get all cities from API
  let allCities = await fakeCities.getAll();

  if (!allCities || allCities.length === 0) {
    fakeCities.initialize();
    allCities = await fakeCities.getAll();
  }
  // Get all countries for joining
  let allCountries = await fakeCountries.getAll();

  if (!allCountries || allCountries.length === 0) {
    fakeCountries.initialize();
    allCountries = await fakeCountries.getAll();
  }

  // Join cities with countries for display
  let enhancedCities = allCities.map((city) => {
    const country = allCountries.find((c) => c.id === city.countryId);
    return {
      ...city,
      country
    };
  });

  // Apply filtering
  let filteredCities = [...enhancedCities];

  if (filters) {
    // Apply name search filter
    if (filters.name) {
      const searchTerm = filters.name.toLowerCase();
      filteredCities = filteredCities.filter((city) =>
        city.name.toLowerCase().includes(searchTerm)
      );
    }

    // Apply country filter
    if (filters.countryId) {
      filteredCities = filteredCities.filter(
        (city) => city.countryId === Number(filters.countryId)
      );
    }

    // Apply sorting
    if (filters.sort && filters.sort.length > 0) {
      const [field, direction] = filters.sort[0].split('.');
      const multiplier = direction === 'desc' ? -1 : 1;

      filteredCities.sort((a, b) => {
        // Safely access properties with type checking
        const aValue = getCityProperty(a, field);
        const bValue = getCityProperty(b, field);

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
  const paginatedCities = filteredCities.slice(startIndex, endIndex);

  return {
    cities: paginatedCities,
    total: filteredCities.length
  };
};

/**
 * Cities listing component - fetches and displays cities with filtering
 */
export function CitiesListing() {
  const searchParams = useSearchParams();

  // Get filter values from URL search params
  const page = Number(searchParams.get('page') || 1);
  const perPage = Number(searchParams.get('perPage') || 10);
  const name = searchParams.get('name') || '';
  const countryId = searchParams.get('countryId') || '';
  const sort = searchParams.get('sort')?.split(',') || [];

  // Create filters object from search params
  const filters = {
    page,
    perPage,
    ...(name && { name }),
    ...(countryId && { countryId }),
    ...(sort.length > 0 && { sort })
  };

  // Fetch cities data with filters
  const { data: citiesData, isLoading: isLoadingCities } = useQuery({
    queryKey: ['cities', filters],
    queryFn: () => getCities(filters),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  // Display skeleton loader while data is loading
  if (isLoadingCities) {
    return <CitiesTableSkeleton />;
  }

  // Display the cities table with data
  return (
    <CitiesTable
      data={citiesData?.cities || []}
      totalItems={citiesData?.total || 0}
      columns={columns}
    />
  );
}

/**
 * Skeleton component for cities table
 */
export function CitiesListingSkeleton() {
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
