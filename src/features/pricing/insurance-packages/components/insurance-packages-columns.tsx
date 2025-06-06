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
    id: 'rate',
    accessorKey: 'rate',
    header: ({ column }: { column: Column<InsurancePackage, unknown> }) => (
      <DataTableColumnHeader column={column} title='Tỉ Giá' />
    ),
    cell: ({ row }) => <div>{row.getValue<number>('rate')}</div>,
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: 'Tỉ Giá',
      placeholder: 'Tìm kiếm theo tỉ giá...',
      variant: 'number',
      icon: Text
    }
  },
  {
    id: 'activeDate',
    accessorKey: 'activeDate',
    header: ({ column }: { column: Column<InsurancePackage, unknown> }) => (
      <DataTableColumnHeader column={column} title='Ngày Hiệu Lực' />
    ),
    cell: ({ row }) => <div>{row.getValue<string>('activeDate')}</div>,
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: 'Ngày Hiệu Lực',
      placeholder: 'Tìm kiếm theo ngày hiệu lực...',
      variant: 'date',
      icon: Calendar
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
