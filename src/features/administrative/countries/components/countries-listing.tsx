'use client';

import { Country } from '@/types/system-configuration';
import { fakeCountries } from '@/constants/mock-system-config';
import { useQuery } from '@tanstack/react-query';
import { CountriesTable } from './countries-table';
import { columns } from './columns';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams } from 'next/navigation';

/**
 * Helper function to safely access Country properties
 * @param country The country object
 * @param field The field name to access
 * @returns The value of the field or empty string if not found
 */
const getCountryProperty = (
  country: Country,
  field: string
): string | number => {
  switch (field) {
    case 'id':
      return country.id;
    case 'code2':
      return country.code2;
    case 'code3':
      return country.code3;
    case 'name':
      return country.name;
    case 'continent':
      return country.continent;
    case 'zoneId':
      return country.zoneId;
    default:
      return '';
  }
};

/**
 * Fetches countries with filtering, pagination, and sorting
 */
const getCountries = async (
  filters?: Record<string, any>
): Promise<{
  countries: Country[];
  total: number;
}> => {
  // Get all countries (in a real app this would have server-side filtering)
  const allCountries = await fakeCountries.getAll();

  // If no countries are returned, use some default data
  if (!allCountries || allCountries.length === 0) {
    // Reinitialize the mock data
    fakeCountries.initialize();
    // Try to get the data again
    const retryCountries = await fakeCountries.getAll();

    // If still no data, provide some default countries
    if (!retryCountries || retryCountries.length === 0) {
      return {
        countries: [
          {
            id: 1,
            code2: 'VN',
            code3: 'VNM',
            name: 'Vietnam',
            continent: 'Asia',
            zoneId: 1
          },
          {
            id: 2,
            code2: 'US',
            code3: 'USA',
            name: 'United States',
            continent: 'North America',
            zoneId: 2
          }
        ],
        total: 2
      };
    }
  }

  // Apply filtering
  let filteredCountries = [...allCountries];
  if (filters) {
    // Apply name search filter
    if (filters.name) {
      const searchTerm = filters.name.toLowerCase();
      filteredCountries = filteredCountries.filter(
        (country) =>
          country.name.toLowerCase().includes(searchTerm) ||
          country.code2.toLowerCase().includes(searchTerm) ||
          country.code3.toLowerCase().includes(searchTerm)
      );
    }

    // Apply continent filter
    if (filters.continent && filters.continent.length > 0) {
      filteredCountries = filteredCountries.filter((country) =>
        filters.continent.includes(country.continent)
      );
    }

    // Apply code2 filter
    if (filters.code2) {
      const searchTerm = filters.code2.toLowerCase();
      filteredCountries = filteredCountries.filter((country) =>
        country.code2.toLowerCase().includes(searchTerm)
      );
    }

    // Apply code3 filter
    if (filters.code3) {
      const searchTerm = filters.code3.toLowerCase();
      filteredCountries = filteredCountries.filter((country) =>
        country.code3.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    if (filters.sort && filters.sort.length > 0) {
      const [field, direction] = filters.sort[0].split('.');
      const multiplier = direction === 'desc' ? -1 : 1;

      filteredCountries.sort((a, b) => {
        // Safely access properties with type checking
        const aValue = getCountryProperty(a, field);
        const bValue = getCountryProperty(b, field);

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
  const paginatedCountries = filteredCountries.slice(startIndex, endIndex);

  return {
    countries: paginatedCountries,
    total: filteredCountries.length
  };
};

/**
 * Component that displays the countries listing with advanced table features
 */
export function CountriesListing() {
  const searchParams = useSearchParams();

  // Get filter values from URL search params
  const page = Number(searchParams.get('page') || 1);
  const perPage = Number(searchParams.get('perPage') || 10);
  const name = searchParams.get('name') || '';
  const code2 = searchParams.get('code2') || '';
  const code3 = searchParams.get('code3') || '';
  const continent = searchParams.get('continent')?.split(',') || [];
  const sort = searchParams.get('sort')?.split(',') || [];

  // Create filters object from search params
  const filters = {
    page,
    perPage,
    ...(name && { name }),
    ...(code2 && { code2 }),
    ...(code3 && { code3 }),
    ...(continent.length > 0 && { continent }),
    ...(sort.length > 0 && { sort })
  };

  // Fetch countries data with filters
  const { data: countriesData, isLoading: isLoadingCountries } = useQuery({
    queryKey: ['countries', filters],
    queryFn: () => getCountries(filters),
    staleTime: 0, // Don't cache the data
    refetchOnMount: true, // Always refetch when the component mounts
    refetchOnWindowFocus: true // Refetch when the window regains focus
  });

  // Display skeleton loader while data is loading
  if (isLoadingCountries) {
    return <CountriesTableSkeleton />;
  }

  // Display the countries table with data
  return (
    <CountriesTable
      data={countriesData?.countries || []}
      totalItems={countriesData?.total || 0}
      columns={columns}
    />
  );
}

/**
 * Skeleton loader for the countries table while data is loading
 */
function CountriesTableSkeleton() {
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
