'use client';

import { useQuery } from '@tanstack/react-query';
import { Carrier } from '@/types/system-configuration';
import { fakeCarriers } from '@/constants/mock-system-config';
import { CarriersTable, CarriersTableSkeleton } from './carriers-table';
import { columns } from './carriers-columns';
import { useSearchParams } from 'next/navigation';

/**
 * Fetch and filter insurance packages based on criteria
 */
const getCarriers = async (
  filters?: Record<string, any>
): Promise<{
  carriers: Carrier[];
  total: number;
}> => {
  // In a real app, these parameters would be sent to the API
  // For now, we'll filter the mock data client-side

  // Get all branches
  let carriersData = await fakeCarriers.getAll();
  if (!carriersData || carriersData.length === 0) {
    fakeCarriers.initialize();
    carriersData = await fakeCarriers.getAll();
  }
  // Join cities with countries for display
  let enhancedCarriers = carriersData.map((carrier) => {
    return {
      ...carrier
    };
  });

  // Apply filtering
  let filteredCarriers = [...enhancedCarriers];
  // Apply filters if present
  if (filters) {
    // Apply search filter
    // Apply name search filter
    if (filters.name) {
      const searchTerm = filters.code || filters.name;
      filteredCarriers = filteredCarriers.filter((carrier) =>
        carrier.name.toLowerCase().includes(searchTerm)
      );
    }

    // Apply routeIds filter
    if (filters.routeIds && filters.routeIds.length > 0) {
      const searchTerm = filters.routeIds.map(Number);
      filteredCarriers = filteredCarriers.filter((carrier) =>
        carrier.routeIds.some((routeId) => searchTerm.includes(routeId))
      );
    }

    // Helper function to safely get carrier property values
    const getCarrierProperty = (
      carrier: Carrier,
      field: string
    ): string | number => {
      switch (field) {
        case 'id':
          return carrier.id;
        case 'name':
          return carrier.name;
        default:
          return '';
      }
    };

    // Apply sorting
    if (filters.sort && filters.sort.length > 0) {
      const [field, direction] = filters.sort[0].split('.');
      const multiplier = direction === 'desc' ? -1 : 1;

      filteredCarriers.sort((a, b) => {
        // Safely access properties with type checking
        const aValue = getCarrierProperty(a, field);
        const bValue = getCarrierProperty(b, field);

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
  const paginatedCarriers = filteredCarriers.slice(startIndex, endIndex);

  return {
    carriers: paginatedCarriers,
    total: filteredCarriers.length
  };
};

/**
 * Component for fetching and displaying branches data
 * Handles data fetching, filtering, pagination and state management
 */
export function CarriersListing() {
  // Get filter parameters from URL query params
  const searchParams = useSearchParams();

  // Get filter values from URL search params
  const page = Number(searchParams.get('page') || 1);
  const perPage = Number(searchParams.get('perPage') || 10);
  const name = searchParams.get('name') || '';
  const routeIds = searchParams.get('routeIds')?.split(',') || [];
  const sort = searchParams.get('sort')?.split(',') || [];

  // Create filters object from search params
  const filters = {
    page,
    perPage,
    ...(name && { name }),
    ...(routeIds.length > 0 && { routeIds }),
    ...(sort.length > 0 && { sort })
  };

  // Fetch insurance packages data with current filters
  const { data: carriersData, isLoading: isLoadingCarriers } = useQuery({
    queryKey: ['carriers', filters],
    queryFn: () => getCarriers(filters),
    staleTime: 0, // Don't cache the data
    refetchOnMount: true, // Always refetch when the component mounts
    refetchOnWindowFocus: true // Refetch when the window regains focus
  });

  // Show skeleton while data is loading
  if (isLoadingCarriers) {
    return <CarriersTableSkeleton />;
  }

  // Render data table with fetched data
  return (
    <CarriersTable
      data={carriersData?.carriers || []}
      totalItems={carriersData?.total || 0}
      columns={columns}
    />
  );
}

/**
 * Skeleton loader for insurance packages listing
 */
export function CarriersListingSkeleton() {
  return <CarriersTableSkeleton />;
}
