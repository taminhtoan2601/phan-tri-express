'use client';

import { parseAsInteger, useQueryState } from 'nuqs';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { ColumnDef } from '@tanstack/react-table';

interface ZonesTableProps<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
}

/**
 * Zones table component with advanced features
 */
export function ZonesTable<TData, TValue>({
  data,
  totalItems,
  columns
}: ZonesTableProps<TData, TValue>) {
  // Get page size from URL query parameter
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

  // Calculate page count for pagination
  const pageCount = Math.ceil(totalItems / pageSize);

  // Initialize table with the useDataTable hook
  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    shallow: false, // Setting to false triggers a network request with the updated querystring
    debounceMs: 500 // Match the debounce timing in ProductTable
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
