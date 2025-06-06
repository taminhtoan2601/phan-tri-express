/**
 * Column definitions for Commodity Types DataTable
 */
'use client';

import { Column, ColumnDef } from '@tanstack/react-table';
import { CommodityType } from '@/types/system-configuration';
import { CellAction } from './commodity-types-cell-action';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Globe, Text } from 'lucide-react';

/**
 * Column definitions for the commodity types table
 */
export const columns: ColumnDef<CommodityType>[] = [
  {
    accessorKey: 'id',
    header: ({ column }: { column: Column<CommodityType, unknown> }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => <div className='font-medium'>{row.getValue('id')}</div>,
    enableSorting: true,
    enableColumnFilter: false
  },
  {
    id: 'code',
    accessorKey: 'code',
    header: ({ column }: { column: Column<CommodityType, unknown> }) => (
      <DataTableColumnHeader column={column} title='Mã' />
    ),
    cell: ({ row }) => (
      <div className='font-medium uppercase'>{row.getValue('code')}</div>
    ),
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: 'Mã',
      placeholder: 'Tìm kiếm theo mã...',
      variant: 'text',
      icon: Text
    }
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<CommodityType, unknown> }) => (
      <DataTableColumnHeader column={column} title='Tên' />
    ),
    cell: ({ row }) => <div>{row.getValue<string>('name')}</div>,
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: 'Tên',
      placeholder: 'Tìm kiếm theo tên...',
      variant: 'text',
      icon: Globe
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
