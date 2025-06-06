'use client';

import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Zone } from '@/types/system-configuration';
import { IconBuildingArch } from '@tabler/icons-react';
import { ColumnDef, Column } from '@tanstack/react-table';

import { CellAction } from './cell-action';

/**
 * Định nghĩa các cột cho ZonesTable
 */
export const columns: ColumnDef<Zone>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: ({ column }: { column: Column<Zone, unknown> }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => <div className='font-medium'>{row.getValue('id')}</div>,
    enableSorting: true,
    enableColumnFilter: false
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<Zone, unknown> }) => (
      <DataTableColumnHeader column={column} title='Tên Khu Vực' />
    ),
    cell: ({ row }) => <div>{row.getValue<string>('name')}</div>,
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: 'Tên Khu Vực',
      placeholder: 'Tìm kiếm theo tên...'
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
