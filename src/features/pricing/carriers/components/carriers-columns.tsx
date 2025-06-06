/**
 * Column definitions for Commodity Types DataTable
 */
'use client';

import { Column, ColumnDef } from '@tanstack/react-table';
import { Carrier, Route } from '@/types/system-configuration';
import { CellAction } from './carriers-cell-action';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Calendar, Globe, Text } from 'lucide-react';
import { routes } from '@/data';

/**
 * Column definitions for the commodity types table
 */
export const columns: ColumnDef<Carrier>[] = [
  {
    accessorKey: 'id',
    header: ({ column }: { column: Column<Carrier, unknown> }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => <div className='font-medium'>{row.getValue('id')}</div>,
    enableSorting: true,
    enableColumnFilter: false
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<Carrier, unknown> }) => (
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
    id: 'routeIds',
    accessorKey: 'routeIds',
    header: ({ column }: { column: Column<Carrier, unknown> }) => (
      <DataTableColumnHeader column={column} title='Các Tuyến Vận Chuyển' />
    ),
    cell: ({ row }) => {
      const routes = row.original.routes;
      return <div>{routes?.map((route: Route) => route.name).join(', ')}</div>;
    },
    enableSorting: false,
    enableColumnFilter: true,
    meta: {
      label: 'Tên Tuyến',
      placeholder: 'Tìm kiếm theo tên tuyến...',
      variant: 'multiSelect',
      options: routes.map((route) => ({
        label: route.name,
        value: route.id.toString()
      })),
      icon: Text
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
