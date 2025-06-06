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
      <DataTableColumnHeader column={column} title='Tên' />
    ),
    cell: ({ row }) => (
      <div className='font-medium uppercase'>{row.getValue('name')}</div>
    ),
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: 'Tên',
      placeholder: 'Tìm kiếm theo tên...',
      variant: 'text',
      icon: Text
    }
  },
  {
    id: 'transitTimeDays',
    accessorKey: 'transitTimeDays',
    header: ({ column }: { column: Column<ShippingService, unknown> }) => (
      <DataTableColumnHeader
        column={column}
        title='Thời Gian Vận Chuyển (Ngày)'
      />
    ),
    cell: ({ row }) => <div>{row.getValue<number>('transitTimeDays')}</div>,
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: 'Thời Gian Vận Chuyển (Ngày)',
      placeholder: 'Tìm kiếm theo thời gian vận chuyển...',
      variant: 'number',
      icon: Globe
    }
  },

  {
    id: 'multiplier',
    accessorKey: 'multiplier',
    header: ({ column }: { column: Column<ShippingService, unknown> }) => (
      <DataTableColumnHeader column={column} title='Hệ Số Nhân' />
    ),
    cell: ({ row }) => <div>{row.getValue<number>('multiplier')}</div>,
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: 'Hệ Số Nhân',
      placeholder: 'Tìm kiếm theo hệ số nhân...',
      variant: 'number',
      icon: Globe
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
