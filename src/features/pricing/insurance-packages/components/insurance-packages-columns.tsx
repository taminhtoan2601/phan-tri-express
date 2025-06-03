/**
 * Column definitions for Commodity Types DataTable
 */
'use client';

import { Column, ColumnDef } from '@tanstack/react-table';
import { InsurancePackage } from '@/types/system-configuration';
import { CellAction } from './insurance-packages-cell-action';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Calendar, Globe, Text } from 'lucide-react';

/**
 * Column definitions for the commodity types table
 */
export const columns: ColumnDef<InsurancePackage>[] = [
  {
    accessorKey: 'id',
    header: ({ column }: { column: Column<InsurancePackage, unknown> }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => <div className='font-medium'>{row.getValue('id')}</div>,
    enableSorting: true,
    enableColumnFilter: false
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<InsurancePackage, unknown> }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => <div>{row.getValue<string>('name')}</div>,
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: 'Name',
      placeholder: 'Search by name...',
      variant: 'text',
      icon: Globe
    }
  },
  {
    id: 'rate',
    accessorKey: 'rate',
    header: ({ column }: { column: Column<InsurancePackage, unknown> }) => (
      <DataTableColumnHeader column={column} title='Rate' />
    ),
    cell: ({ row }) => <div>{row.getValue<number>('rate')}</div>,
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: 'Rate',
      placeholder: 'Search by rate...',
      variant: 'number',
      icon: Text
    }
  },
  {
    id: 'activeDate',
    accessorKey: 'activeDate',
    header: ({ column }: { column: Column<InsurancePackage, unknown> }) => (
      <DataTableColumnHeader column={column} title='Active Date' />
    ),
    cell: ({ row }) => <div>{row.getValue<string>('activeDate')}</div>,
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: 'Active Date',
      placeholder: 'Search by active date...',
      variant: 'date',
      icon: Calendar
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
