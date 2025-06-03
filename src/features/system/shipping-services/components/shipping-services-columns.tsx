/**
 * Column definitions for Commodity Types DataTable
 */
'use client';

import { Column, ColumnDef } from '@tanstack/react-table';
import { ShippingService } from '@/types/system-configuration';
import { CellAction } from './shipping-services-cell-action';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Globe, Text } from 'lucide-react';

/**
 * Column definitions for the payment types table
 */
export const columns: ColumnDef<ShippingService>[] = [
  {
    accessorKey: 'id',
    header: ({ column }: { column: Column<ShippingService, unknown> }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => <div className='font-medium'>{row.getValue('id')}</div>,
    enableSorting: true,
    enableColumnFilter: false
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<ShippingService, unknown> }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => (
      <div className='font-medium uppercase'>{row.getValue('name')}</div>
    ),
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: 'Name',
      placeholder: 'Search by name...',
      variant: 'text',
      icon: Text
    }
  },
  {
    id: 'transitTimeDays',
    accessorKey: 'transitTimeDays',
    header: ({ column }: { column: Column<ShippingService, unknown> }) => (
      <DataTableColumnHeader column={column} title='Transit Time (Days)' />
    ),
    cell: ({ row }) => <div>{row.getValue<number>('transitTimeDays')}</div>,
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: 'Transit Time (Days)',
      placeholder: 'Search by transit time...',
      variant: 'number',
      icon: Globe
    }
  },

  {
    id: 'multiplier',
    accessorKey: 'multiplier',
    header: ({ column }: { column: Column<ShippingService, unknown> }) => (
      <DataTableColumnHeader column={column} title='Multiplier' />
    ),
    cell: ({ row }) => <div>{row.getValue<number>('multiplier')}</div>,
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: 'Multiplier',
      placeholder: 'Search by multiplier...',
      variant: 'number',
      icon: Globe
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
