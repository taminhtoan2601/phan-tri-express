'use client';

import { useQuery } from '@tanstack/react-query';
import { ShippingType } from '@/types/system-configuration';
import { fakeShippingTypes } from '@/constants/mock-system-config';
import {
  ShippingTypesTable,
  ShippingTypesTableSkeleton
} from './shipping-types-table';
import { columns } from './shipping-types-columns';
import { useSearchParams } from 'next/navigation';

/**
 * Fetch and filter branches based on criteria
 */
const getShippingTypes = async (
  filters?: Record<string, any>
): Promise<{
  shippingTypes: ShippingType[];
  total: number;
}> => {
  // In a real app, these parameters would be sent to the API
  // For now, we'll filter the mock data client-side

  // Get all branches
  let shippingTypesData = await fakeShippingTypes.getAll();
  if (!shippingTypesData || shippingTypesData.length === 0) {
    fakeShippingTypes.initialize();
    shippingTypesData = await fakeShippingTypes.getAll();
  }
  // Join cities with countries for display
  let enhancedShippingTypes = shippingTypesData.map((shippingType) => {
    return {
      ...shippingType
    };
  });

  // Apply filtering
  let filteredShippingTypes = [...enhancedShippingTypes];
  // Apply filters if present
  if (filters) {
    // Apply search filter
    // Apply name search filter
    if (filters.code || filters.name) {
      const searchTerm = filters.code || filters.name;
      filteredShippingTypes = filteredShippingTypes.filter(
        (shippingType) =>
          shippingType.name.toLowerCase().includes(searchTerm) ||
          shippingType.code.toLowerCase().includes(searchTerm)
      );
    }

    // Apply code2 filter
    if (filters.code) {
      const searchTerm = filters.code.toLowerCase();
      filteredShippingTypes = filteredShippingTypes.filter((shippingType) =>
        shippingType.code.toLowerCase().includes(searchTerm)
      );
    }

    // Helper function to safely get branch property values
    const getShippingTypeProperty = (
      shippingType: ShippingType,
      field: string
    ): string | number => {
      switch (field) {
        case 'id':
          return shippingType.id;
        case 'code':
          return shippingType.code;
        case 'name':
          return shippingType.name;
        default:
          return '';
      }
    };

    // Apply sorting
    if (filters.sort && filters.sort.length > 0) {
      const [field, direction] = filters.sort[0].split('.');
      const multiplier = direction === 'desc' ? -1 : 1;

      filteredShippingTypes.sort((a, b) => {
        // Safely access properties with type checking
        const aValue = getShippingTypeProperty(a, field);
        const bValue = getShippingTypeProperty(b, field);

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
  const paginatedShippingTypes = filteredShippingTypes.slice(
    startIndex,
    endIndex
  );

  return {
    shippingTypes: paginatedShippingTypes,
    total: filteredShippingTypes.length
  };
};

/**
 * Component for fetching and displaying branches data
 * Handles data fetching, filtering, pagination and state management
 */
export function ShippingTypesListing() {
  // Get filter parameters from URL query params
  const searchParams = useSearchParams();

  // Get filter values from URL search params
  const page = Number(searchParams.get('page') || 1);
  const perPage = Number(searchParams.get('perPage') || 10);
  const name = searchParams.get('name') || '';
  const code = searchParams.get('code') || '';
  const sort = searchParams.get('sort')?.split(',') || [];

  // Create filters object from search params
  const filters = {
    page,
    perPage,
    ...(name && { name }),
    ...(code && { code }),
    ...(sort.length > 0 && { sort })
  };

  // Fetch commodity types data with current filters
  const { data: shippingTypesData, isLoading: isLoadingShippingTypes } =
    useQuery({
      queryKey: ['shipping-types', filters],
      queryFn: () => getShippingTypes(filters),
      staleTime: 0, // Don't cache the data
      refetchOnMount: true, // Always refetch when the component mounts
      refetchOnWindowFocus: true // Refetch when the window regains focus
    });

  // Show skeleton while data is loading
  if (isLoadingShippingTypes) {
    return <ShippingTypesTableSkeleton />;
  }

  // Render data table with fetched data
  return (
    <ShippingTypesTable
      data={shippingTypesData?.shippingTypes || []}
      totalItems={shippingTypesData?.total || 0}
      columns={columns}
    />
  );
}

/**
 * Skeleton loader for branches listing
 */
export function ShippingTypesListingSkeleton() {
  return <ShippingTypesTableSkeleton />;
}
