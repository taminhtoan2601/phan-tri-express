'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';

interface RoutesTableProps<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
}

/**
 * Advanced data table for displaying routes with filtering, sorting, and pagination
 */
export function RoutesTable<TData, TValue>({
  data,
  totalItems,
  columns
}: RoutesTableProps<TData, TValue>) {
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

  // Debugging check

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
