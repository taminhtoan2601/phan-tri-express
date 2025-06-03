'use client';

import { useQuery } from '@tanstack/react-query';
import { InsurancePackage } from '@/types/system-configuration';
import { fakeInsurancePackages } from '@/constants/mock-system-config';
import {
  InsurancePackagesTable,
  InsurancePackagesTableSkeleton
} from './insurance-packages-table';
import { columns } from './insurance-packages-columns';
import { useSearchParams } from 'next/navigation';

/**
 * Fetch and filter insurance packages based on criteria
 */
const getInsurancePackages = async (
  filters?: Record<string, any>
): Promise<{
  insurancePackages: InsurancePackage[];
  total: number;
}> => {
  // In a real app, these parameters would be sent to the API
  // For now, we'll filter the mock data client-side

  // Get all branches
  let insurancePackagesData = await fakeInsurancePackages.getAll();
  if (!insurancePackagesData || insurancePackagesData.length === 0) {
    fakeInsurancePackages.initialize();
    insurancePackagesData = await fakeInsurancePackages.getAll();
  }
  // Join cities with countries for display
  let enhancedInsurancePackages = insurancePackagesData.map(
    (insurancePackage) => {
      return {
        ...insurancePackage
      };
    }
  );

  // Apply filtering
  let filteredInsurancePackages = [...enhancedInsurancePackages];
  // Apply filters if present
  if (filters) {
    // Apply search filter
    // Apply name search filter
    if (filters.name) {
      const searchTerm = filters.code || filters.name;
      filteredInsurancePackages = filteredInsurancePackages.filter(
        (insurancePackage) =>
          insurancePackage.name.toLowerCase().includes(searchTerm)
      );
    }

    // Apply rate filter
    if (filters.rate) {
      const searchTerm = Number(filters.rate);
      filteredInsurancePackages = filteredInsurancePackages.filter(
        (insurancePackage) => insurancePackage.rate === searchTerm
      );
    }

    // Apply active date filter
    if (filters.activeDate) {
      const searchTerm = Date.parse(filters.activeDate);
      filteredInsurancePackages = filteredInsurancePackages.filter(
        (insurancePackage) =>
          Date.parse(insurancePackage.activeDate) >= searchTerm
      );
    }
    // Helper function to safely get insurance package property values
    const getInsurancePackageProperty = (
      insurancePackage: InsurancePackage,
      field: string
    ): string | number => {
      switch (field) {
        case 'id':
          return insurancePackage.id;
        case 'name':
          return insurancePackage.name;
        case 'rate':
          return insurancePackage.rate;
        case 'activeDate':
          return insurancePackage.activeDate;
        default:
          return '';
      }
    };

    // Apply sorting
    if (filters.sort && filters.sort.length > 0) {
      const [field, direction] = filters.sort[0].split('.');
      const multiplier = direction === 'desc' ? -1 : 1;

      filteredInsurancePackages.sort((a, b) => {
        // Safely access properties with type checking
        const aValue = getInsurancePackageProperty(a, field);
        const bValue = getInsurancePackageProperty(b, field);

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
  const paginatedInsurancePackages = filteredInsurancePackages.slice(
    startIndex,
    endIndex
  );

  return {
    insurancePackages: paginatedInsurancePackages,
    total: filteredInsurancePackages.length
  };
};

/**
 * Component for fetching and displaying branches data
 * Handles data fetching, filtering, pagination and state management
 */
export function InsurancePackagesListing() {
  // Get filter parameters from URL query params
  const searchParams = useSearchParams();

  // Get filter values from URL search params
  const page = Number(searchParams.get('page') || 1);
  const perPage = Number(searchParams.get('perPage') || 10);
  const name = searchParams.get('name') || '';
  const rate = searchParams.get('rate') || '';
  const activeDate = searchParams.get('activeDate') || '';
  const sort = searchParams.get('sort')?.split(',') || [];

  // Create filters object from search params
  const filters = {
    page,
    perPage,
    ...(name && { name }),
    ...(rate && { rate }),
    ...(activeDate && { activeDate }),
    ...(sort.length > 0 && { sort })
  };

  // Fetch insurance packages data with current filters
  const { data: insurancePackagesData, isLoading: isLoadingInsurancePackages } =
    useQuery({
      queryKey: ['insurance-packages', filters],
      queryFn: () => getInsurancePackages(filters),
      staleTime: 0, // Don't cache the data
      refetchOnMount: true, // Always refetch when the component mounts
      refetchOnWindowFocus: true // Refetch when the window regains focus
    });

  // Show skeleton while data is loading
  if (isLoadingInsurancePackages) {
    return <InsurancePackagesTableSkeleton />;
  }

  // Render data table with fetched data
  return (
    <InsurancePackagesTable
      data={insurancePackagesData?.insurancePackages || []}
      totalItems={insurancePackagesData?.total || 0}
      columns={columns}
    />
  );
}

/**
 * Skeleton loader for insurance packages listing
 */
export function InsurancePackagesListingSkeleton() {
  return <InsurancePackagesTableSkeleton />;
}
