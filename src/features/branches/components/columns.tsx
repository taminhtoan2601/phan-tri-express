'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Branch } from '@/types/system-configuration';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { CellAction } from './cell-action';

/**
 * Defines columns for the Branches DataTable
 * Includes sorting and filtering metadata
 */
export const columns: ColumnDef<Branch>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => <div className='w-[80px]'>{row.getValue('id')}</div>,
    enableSorting: true,
    enableHiding: true
  },
  {
    accessorKey: 'city',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='City' />
    ),
    cell: ({ row }) => {
      const city = row.original;
      return <div>{city?.name}</div>;
    },
    enableSorting: true,
    enableHiding: true
  },
  {
    accessorKey: 'code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Code' />
    ),
    cell: ({ row }) => <div>{row.getValue('code')}</div>,
    enableSorting: true,
    enableHiding: false,
    filterFn: 'includesString'
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => (
      <div className='max-w-[200px] truncate'>{row.getValue('name')}</div>
    ),
    enableSorting: true,
    enableHiding: false,
    filterFn: 'includesString'
  },
  {
    accessorKey: 'address',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Address' />
    ),
    cell: ({ row }) => (
      <div className='max-w-[300px] truncate'>{row.getValue('address')}</div>
    ),
    enableSorting: true,
    enableHiding: true,
    filterFn: 'includesString'
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone' />
    ),
    cell: ({ row }) => <div>{row.getValue('phone')}</div>,
    enableSorting: true,
    enableHiding: true
  },
  {
    accessorKey: 'discount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Discount %' />
    ),
    cell: ({ row }) => {
      const discount = parseFloat(row.getValue('discount'));

      // Format as percentage with 2 decimal places
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(discount / 100);

      return <div className='text-right font-medium'>{formatted}</div>;
    },
    enableSorting: true,
    enableHiding: true
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
    enableHiding: false
  }
];
