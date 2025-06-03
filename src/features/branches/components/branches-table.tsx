'use client';

import { useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { Branch } from '@/types/system-configuration';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { DataTableViewOptions } from '@/components/ui/table/data-table-view-options';
import { DataTablePagination } from '@/components/ui/table/data-table-pagination';
import { columns } from './columns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

/**
 * Props for BranchesTable component
 */
interface BranchesTableProps<TData, TValue> {
  data: Branch[];
  totalItems: number;
  columns: typeof columns;
}

/**
 * Component for displaying branches in a data table
 * Uses shadcn UI DataTable with advanced features
 */
export function BranchesTable<TData, TValue>({
  data,
  totalItems,
  columns
}: BranchesTableProps<TData, TValue>) {
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
export function BranchesTableSkeleton() {
  return <DataTableSkeleton columnCount={7} rowCount={10} filterCount={2} />;
}
