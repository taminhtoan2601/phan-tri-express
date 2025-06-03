'use client';

import { useQuery } from '@tanstack/react-query';
import { ShippingService } from '@/types/system-configuration';
import { fakeShippingServices } from '@/constants/mock-system-config';
import {
  ShippingServicesTable,
  ShippingServicesTableSkeleton
} from './shipping-services-table';
import { columns } from './shipping-services-columns';
import { useSearchParams } from 'next/navigation';

/**
 * Fetch and filter branches based on criteria
 */
const getShippingServices = async (
  filters?: Record<string, any>
): Promise<{
  shippingServices: ShippingService[];
  total: number;
}> => {
  // In a real app, these parameters would be sent to the API
  // For now, we'll filter the mock data client-side

  // Get all shipping services
  let shippingServicesData = await fakeShippingServices.getAll();
  if (!shippingServicesData || shippingServicesData.length === 0) {
    fakeShippingServices.initialize();
    shippingServicesData = await fakeShippingServices.getAll();
  }
  // Join cities with countries for display
  let enhancedShippingServices = shippingServicesData.map((shippingService) => {
    return {
      ...shippingService
    };
  });

  // Apply filtering
  let filteredShippingServices = [...enhancedShippingServices];
  // Apply filters if present
  if (filters) {
    // Apply search filter
    // Apply name search filter
    if (filters.name) {
      const searchTerm = filters.name;
      filteredShippingServices = filteredShippingServices.filter(
        (shippingService) =>
          shippingService.name.toLowerCase().includes(searchTerm)
      );
    }

    // Apply multiplier filter
    if (filters.multiplier) {
      const searchTerm = filters.multiplier;
      filteredShippingServices = filteredShippingServices.filter(
        (shippingService) => shippingService.multiplier === Number(searchTerm)
      );
    }

    // Apply multiplier filter
    if (filters.transitTimeDays) {
      const searchTerm = filters.transitTimeDays;
      filteredShippingServices = filteredShippingServices.filter(
        (shippingService) =>
          shippingService.transitTimeDays === Number(searchTerm)
      );
    }
    // Helper function to safely get shipping service property values
    const getShippingServiceProperty = (
      shippingService: ShippingService,
      field: string
    ): string | number => {
      switch (field) {
        case 'id':
          return shippingService.id;
        case 'name':
          return shippingService.name;
        case 'multiplier':
          return shippingService.multiplier;
        case 'transitTimeDays':
          return shippingService.transitTimeDays;
        default:
          return '';
      }
    };

    // Apply sorting
    if (filters.sort && filters.sort.length > 0) {
      const [field, direction] = filters.sort[0].split('.');
      const multiplier = direction === 'desc' ? -1 : 1;

      filteredShippingServices.sort((a, b) => {
        // Safely access properties with type checking
        const aValue = getShippingServiceProperty(a, field);
        const bValue = getShippingServiceProperty(b, field);

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
  const paginatedShippingServices = filteredShippingServices.slice(
    startIndex,
    endIndex
  );

  return {
    shippingServices: paginatedShippingServices,
    total: filteredShippingServices.length
  };
};

/**
 * Component for fetching and displaying branches data
 * Handles data fetching, filtering, pagination and state management
 */
export function ShippingServicesListing() {
  // Get filter parameters from URL query params
  const searchParams = useSearchParams();

  // Get filter values from URL search params
  const page = Number(searchParams.get('page') || 1);
  const perPage = Number(searchParams.get('perPage') || 10);
  const name = searchParams.get('name') || '';
  const multiplier = searchParams.get('multiplier') || '';
  const transitTimeDays = searchParams.get('transitTimeDays') || '';
  const sort = searchParams.get('sort')?.split(',') || [];

  // Create filters object from search params
  const filters = {
    page,
    perPage,
    ...(name && { name }),
    ...(multiplier && { multiplier }),
    ...(transitTimeDays && { transitTimeDays }),
    ...(sort.length > 0 && { sort })
  };

  // Fetch commodity types data with current filters
  const { data: shippingServicesData, isLoading: isLoadingShippingServices } =
    useQuery({
      queryKey: ['shipping-services', filters],
      queryFn: () => getShippingServices(filters),
      staleTime: 0, // Don't cache the data
      refetchOnMount: true, // Always refetch when the component mounts
      refetchOnWindowFocus: true // Refetch when the window regains focus
    });

  // Show skeleton while data is loading
  if (isLoadingShippingServices) {
    return <ShippingServicesTableSkeleton />;
  }

  // Render data table with fetched data
  return (
    <ShippingServicesTable
      data={shippingServicesData?.shippingServices || []}
      totalItems={shippingServicesData?.total || 0}
      columns={columns}
    />
  );
}

/**
 * Skeleton loader for branches listing
 */
export function ShippingServicesListingSkeleton() {
  return <ShippingServicesTableSkeleton />;
}
