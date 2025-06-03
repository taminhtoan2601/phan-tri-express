'use client';

import { useQuery } from '@tanstack/react-query';
import { CommodityType } from '@/types/system-configuration';
import { fakeCommodityTypes } from '@/constants/mock-system-config';
import {
  CommodityTypesTable,
  CommodityTypesTableSkeleton
} from './commodity-types-table';
import { columns } from './commodity-types-columns';
import { useSearchParams } from 'next/navigation';

/**
 * Fetch and filter branches based on criteria
 */
const getCommodityTypes = async (
  filters?: Record<string, any>
): Promise<{
  commodityTypes: CommodityType[];
  total: number;
}> => {
  // In a real app, these parameters would be sent to the API
  // For now, we'll filter the mock data client-side

  // Get all branches
  let commodityTypesData = await fakeCommodityTypes.getAll();
  if (!commodityTypesData || commodityTypesData.length === 0) {
    fakeCommodityTypes.initialize();
    commodityTypesData = await fakeCommodityTypes.getAll();
  }
  // Join cities with countries for display
  let enhancedCommodityTypes = commodityTypesData.map((commodityType) => {
    return {
      ...commodityType
    };
  });

  // Apply filtering
  let filteredCommodityTypes = [...enhancedCommodityTypes];
  // Apply filters if present
  if (filters) {
    // Apply search filter
    // Apply name search filter
    if (filters.code || filters.name) {
      const searchTerm = filters.code || filters.name;
      filteredCommodityTypes = filteredCommodityTypes.filter(
        (commodityType) =>
          commodityType.name.toLowerCase().includes(searchTerm) ||
          commodityType.code.toLowerCase().includes(searchTerm)
      );
    }

    // Apply code2 filter
    if (filters.code) {
      const searchTerm = filters.code.toLowerCase();
      filteredCommodityTypes = filteredCommodityTypes.filter((commodityType) =>
        commodityType.code.toLowerCase().includes(searchTerm)
      );
    }

    // Helper function to safely get branch property values
    const getCommodityTypeProperty = (
      commodityType: CommodityType,
      field: string
    ): string | number => {
      switch (field) {
        case 'id':
          return commodityType.id;
        case 'code':
          return commodityType.code;
        case 'name':
          return commodityType.name;
        default:
          return '';
      }
    };

    // Apply sorting
    if (filters.sort && filters.sort.length > 0) {
      const [field, direction] = filters.sort[0].split('.');
      const multiplier = direction === 'desc' ? -1 : 1;

      filteredCommodityTypes.sort((a, b) => {
        // Safely access properties with type checking
        const aValue = getCommodityTypeProperty(a, field);
        const bValue = getCommodityTypeProperty(b, field);

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
  const paginatedCommodityTypes = filteredCommodityTypes.slice(
    startIndex,
    endIndex
  );

  return {
    commodityTypes: paginatedCommodityTypes,
    total: filteredCommodityTypes.length
  };
};

/**
 * Component for fetching and displaying branches data
 * Handles data fetching, filtering, pagination and state management
 */
export function CommodityTypesListing() {
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
  const { data: commodityTypesData, isLoading: isLoadingCommodityTypes } =
    useQuery({
      queryKey: ['commodity-types', filters],
      queryFn: () => getCommodityTypes(filters),
      staleTime: 0, // Don't cache the data
      refetchOnMount: true, // Always refetch when the component mounts
      refetchOnWindowFocus: true // Refetch when the window regains focus
    });

  // Show skeleton while data is loading
  if (isLoadingCommodityTypes) {
    return <CommodityTypesTableSkeleton />;
  }

  // Render data table with fetched data
  return (
    <CommodityTypesTable
      data={commodityTypesData?.commodityTypes || []}
      totalItems={commodityTypesData?.total || 0}
      columns={columns}
    />
  );
}

/**
 * Skeleton loader for branches listing
 */
export function CommodityTypesListingSkeleton() {
  return <CommodityTypesTableSkeleton />;
}
