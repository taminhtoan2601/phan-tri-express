'use client';

// Sử dụng Next.js useSearchParams thay vì next-usequerystate
import { useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { ColumnDef } from '@tanstack/react-table';
import { City } from '@/types/system-configuration';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

interface CitiesTableProps<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
}

/**
 * Cities table component with advanced features
 */
export function CitiesTable<TData, TValue>({
  data,
  totalItems,
  columns
}: CitiesTableProps<TData, TValue>) {
  // Get page size from URL query parameter
  const searchParams = useSearchParams();
  const pageSize = Number(searchParams.get('perPage') || 10);

  // Calculate page count for pagination
  const pageCount = Math.ceil(totalItems / pageSize);

  // Initialize table with the useDataTable hook
  const { table } = useDataTable({
    data,
    columns,
    pageCount
    // Các option khác như filtering sẽ được xử lý bởi columns definition
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}

/**
 * Skeleton component for the cities table
 */
export function CitiesTableSkeleton() {
  return <DataTableSkeleton columnCount={3} rowCount={8} filterCount={1} />;
}
