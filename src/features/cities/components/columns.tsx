'use client';

import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { City } from '@/types/system-configuration';
import { IconBuilding, IconMap } from '@tabler/icons-react';
import { ColumnDef, Column } from '@tanstack/react-table';
import { CellAction } from './cell-action';

/**
 * Định nghĩa các cột cho CitiesTable
 */
export const columns: ColumnDef<City>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: ({ column }: { column: Column<City, unknown> }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => <div className='font-medium'>{row.getValue('id')}</div>,
    enableSorting: true,
    enableColumnFilter: false
  },

  {
    id: 'countryId',
    accessorKey: 'countryId',
    header: ({ column }: { column: Column<City, unknown> }) => (
      <DataTableColumnHeader column={column} title='Country ID' />
    ),
    cell: ({ row }) => {
      const country = row.original;

      return <div>{country.name}</div>;
    },
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: 'countryId',
      placeholder: 'Filter by country...'
    }
  },
  {
    id: 'code',
    accessorKey: 'code',
    header: ({ column }: { column: Column<City, unknown> }) => (
      <DataTableColumnHeader column={column} title='City Code' />
    ),
    cell: ({ row }) => <div>{row.getValue<string>('code')}</div>,
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: 'code',
      placeholder: 'Search by code...'
    }
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<City, unknown> }) => (
      <DataTableColumnHeader column={column} title='City Name' />
    ),
    cell: ({ row }) => <div>{row.getValue<string>('name')}</div>,
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: 'name',
      placeholder: 'Search by name...'
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
