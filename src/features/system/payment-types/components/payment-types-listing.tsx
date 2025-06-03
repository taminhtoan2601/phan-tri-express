'use client';

import { useQuery } from '@tanstack/react-query';
import { PaymentType } from '@/types/system-configuration';
import { fakePaymentTypes } from '@/constants/mock-system-config';
import {
  PaymentTypesTable,
  PaymentTypesTableSkeleton
} from './payment-types-table';
import { columns } from './payment-types-columns';
import { useSearchParams } from 'next/navigation';

/**
 * Fetch and filter branches based on criteria
 */
const getPaymentTypes = async (
  filters?: Record<string, any>
): Promise<{
  paymentTypes: PaymentType[];
  total: number;
}> => {
  // In a real app, these parameters would be sent to the API
  // For now, we'll filter the mock data client-side

  // Get all branches
  let paymentTypesData = await fakePaymentTypes.getAll();
  if (!paymentTypesData || paymentTypesData.length === 0) {
    fakePaymentTypes.initialize();
    paymentTypesData = await fakePaymentTypes.getAll();
  }
  // Join cities with countries for display
  let enhancedPaymentTypes = paymentTypesData.map((paymentType) => {
    return {
      ...paymentType
    };
  });

  // Apply filtering
  let filteredPaymentTypes = [...enhancedPaymentTypes];
  // Apply filters if present
  if (filters) {
    // Apply search filter
    // Apply name search filter
    if (filters.code || filters.name) {
      const searchTerm = filters.code || filters.name;
      filteredPaymentTypes = filteredPaymentTypes.filter(
        (paymentType) =>
          paymentType.name.toLowerCase().includes(searchTerm) ||
          paymentType.code.toLowerCase().includes(searchTerm)
      );
    }

    // Apply code2 filter
    if (filters.code) {
      const searchTerm = filters.code.toLowerCase();
      filteredPaymentTypes = filteredPaymentTypes.filter((paymentType) =>
        paymentType.code.toLowerCase().includes(searchTerm)
      );
    }

    // Helper function to safely get branch property values
    const getPaymentTypeProperty = (
      paymentType: PaymentType,
      field: string
    ): string | number => {
      switch (field) {
        case 'id':
          return paymentType.id;
        case 'code':
          return paymentType.code;
        case 'name':
          return paymentType.name;
        default:
          return '';
      }
    };

    // Apply sorting
    if (filters.sort && filters.sort.length > 0) {
      const [field, direction] = filters.sort[0].split('.');
      const multiplier = direction === 'desc' ? -1 : 1;

      filteredPaymentTypes.sort((a, b) => {
        // Safely access properties with type checking
        const aValue = getPaymentTypeProperty(a, field);
        const bValue = getPaymentTypeProperty(b, field);

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
  const paginatedPaymentTypes = filteredPaymentTypes.slice(
    startIndex,
    endIndex
  );

  return {
    paymentTypes: paginatedPaymentTypes,
    total: filteredPaymentTypes.length
  };
};

/**
 * Component for fetching and displaying branches data
 * Handles data fetching, filtering, pagination and state management
 */
export function PaymentTypesListing() {
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
  const { data: paymentTypesData, isLoading: isLoadingPaymentTypes } = useQuery(
    {
      queryKey: ['payment-types', filters],
      queryFn: () => getPaymentTypes(filters),
      staleTime: 0, // Don't cache the data
      refetchOnMount: true, // Always refetch when the component mounts
      refetchOnWindowFocus: true // Refetch when the window regains focus
    }
  );

  // Show skeleton while data is loading
  if (isLoadingPaymentTypes) {
    return <PaymentTypesTableSkeleton />;
  }

  // Render data table with fetched data
  return (
    <PaymentTypesTable
      data={paymentTypesData?.paymentTypes || []}
      totalItems={paymentTypesData?.total || 0}
      columns={columns}
    />
  );
}

/**
 * Skeleton loader for branches listing
 */
export function PaymentTypesListingSkeleton() {
  return <PaymentTypesTableSkeleton />;
}
