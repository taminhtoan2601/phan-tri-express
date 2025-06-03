'use client';

import { useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { Carrier } from '@/types/system-configuration';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { columns } from './carriers-columns';
import { useQueryState, parseAsInteger } from 'nuqs';

/**
 * Props for CommodityTypesTable component
 */
interface CarriersTableProps<TData, TValue> {
  data: Carrier[];
  totalItems: number;
  columns: typeof columns;
}

/**
 * Component for displaying branches in a data table
 * Uses shadcn UI DataTable with advanced features
 */
export function CarriersTable<TData, TValue>({
  data,
  totalItems,
  columns
}: CarriersTableProps<TData, TValue>) {
  // Get page size from URL query parameter
  // Get page size from URL query parameter
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

  // Calculate page count for pagination
  const pageCount = Math.ceil(totalItems / pageSize);

  // Initialize table with the useDataTable hook - simplified to match ProductTable pattern
  // Không cần truyền zonesData nữa vì dữ liệu countries đã bao gồm zone
  const { table } = useDataTable({
    data,
    columns,
    pageCount: pageCount,
    shallow: false, // Setting to false triggers a network request with the updated querystring
    debounceMs: 500 // Match the debounce timing in ProductTable
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}

/**
 * Skeleton loader for branches table while data is loading
 */
export function CarriersTableSkeleton() {
  return <DataTableSkeleton columnCount={7} rowCount={10} filterCount={2} />;
}
