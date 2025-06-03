'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { Branch } from '@/types/system-configuration';
import { fakeBranches, fakeCities } from '@/constants/mock-system-config';
import { BranchesTable, BranchesTableSkeleton } from './branches-table';
import { columns } from './columns';
import { al } from '@faker-js/faker/dist/airline-CBNP41sR';

/**
 * Fetch and filter branches based on criteria
 */
const getBranches = async (filters: {
  search?: string;
  sort?: string[];
  page: number;
  perPage: number;
}) => {
  // In a real app, these parameters would be sent to the API
  // For now, we'll filter the mock data client-side

  // Simulate API fetch delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Get all branches
  let branchesData = await fakeBranches.getAll();
  if (!branchesData || branchesData.length === 0) {
    fakeBranches.initialize();
    branchesData = await fakeBranches.getAll();
  }

  let allCities = await fakeCities.getAll();
  if (!allCities || allCities.length === 0) {
    fakeCities.initialize();
    allCities = await fakeCities.getAll();
  }
  // Join cities with countries for display
  let enhancedBranches = branchesData.map((branch) => {
    const city = allCities.find((c) => c.id === branch.cityId);
    return {
      ...branch,
      city
    };
  });

  // Apply filtering
  let filteredBranches = [...enhancedBranches];

  // Apply filters if present
  if (filters) {
    // Apply search filter
    const searchTerm = filters.search?.toLowerCase() || '';
    if (searchTerm) {
      filteredBranches = filteredBranches.filter(
        (branch) =>
          branch.name.toLowerCase().includes(searchTerm) ||
          branch.code.toLowerCase().includes(searchTerm) ||
          branch.address.toLowerCase().includes(searchTerm) ||
          branch.phone.toLowerCase().includes(searchTerm) ||
          branch.cityId.toString().includes(searchTerm)
      );
    }

    // Helper function to safely get branch property values
    const getBranchProperty = (
      branch: Branch,
      field: string
    ): string | number => {
      switch (field) {
        case 'id':
          return branch.id;
        case 'code':
          return branch.code;
        case 'name':
          return branch.name;
        case 'address':
          return branch.address;
        case 'phone':
          return branch.phone;
        case 'discount':
          return branch.discount;
        case 'cityId':
          return branch.cityId;
        default:
          return '';
      }
    };

    // Apply sorting
    if (filters.sort && filters.sort.length > 0) {
      const [field, direction] = filters.sort[0].split('.');
      const multiplier = direction === 'desc' ? -1 : 1;

      filteredBranches.sort((a, b) => {
        // Safely access properties with type checking
        const aValue = getBranchProperty(a, field);
        const bValue = getBranchProperty(b, field);

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
  const paginatedBranches = filteredBranches.slice(startIndex, endIndex);

  return {
    branches: paginatedBranches,
    total: filteredBranches.length
  };
};

/**
 * Component for fetching and displaying branches data
 * Handles data fetching, filtering, pagination and state management
 */
export function BranchesListing() {
  // Get filter parameters from URL query params
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [perPage, setPerPage] = useQueryState(
    'perPage',
    parseAsInteger.withDefault(10)
  );
  const [sort, setSort] = useQueryState('sort', parseAsString.withDefault(''));
  const [search, setSearch] = useQueryState(
    'search',
    parseAsString.withDefault('')
  );

  // Create filters object for data fetching
  const [filters, setFilters] = useState({
    search: search || undefined,
    sort: sort ? [sort] : undefined,
    page,
    perPage
  });

  // Update filters when URL parameters change
  useEffect(() => {
    setFilters({
      search: search || undefined,
      sort: sort ? [sort] : undefined,
      page,
      perPage
    });
  }, [search, sort, page, perPage]);

  // Fetch branches data with current filters
  const { data, isPending } = useQuery({
    queryKey: ['branches', filters],
    queryFn: () => getBranches(filters)
  });

  // Show skeleton while data is loading
  if (isPending) {
    return <BranchesTableSkeleton />;
  }

  // Render data table with fetched data
  return (
    <BranchesTable
      data={data?.branches || []}
      totalItems={data?.total || 0}
      columns={columns}
    />
  );
}

/**
 * Skeleton loader for branches listing
 */
export function BranchesListingSkeleton() {
  return <BranchesTableSkeleton />;
}
