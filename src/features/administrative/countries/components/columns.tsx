'use client';

import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Country } from '@/types/system-configuration';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Globe, MapPin, Text } from 'lucide-react';
import { CellAction } from './cell-action';

// Define continent options for filtering
export const CONTINENT_OPTIONS = [
  { label: 'Asia', value: 'Asia' },
  { label: 'Europe', value: 'Europe' },
  { label: 'North America', value: 'North America' },
  { label: 'South America', value: 'South America' },
  { label: 'Africa', value: 'Africa' },
  { label: 'Oceania', value: 'Oceania' },
  { label: 'Antarctica', value: 'Antarctica' }
];

/**
 * Column definitions for the countries table
 * Each column can have filtering, sorting, and custom rendering capabilities
 */
export const columns: ColumnDef<Country>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: ({ column }: { column: Column<Country, unknown> }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => <div className='font-medium'>{row.getValue('id')}</div>,
    enableSorting: true,
    enableColumnFilter: false
  },

  {
    id: 'zoneId',
    accessorKey: 'zoneId',
    header: ({ column }: { column: Column<Country, unknown> }) => (
      <DataTableColumnHeader column={column} title='Khu Vực' />
    ),
    cell: ({ row }) => {
      // Truy cập thuộc tính zone đã được join sẵn
      const country = row.original;
      const zoneId = row.getValue<number>('zoneId');

      return <div>{country.zone?.name || `Zone ${zoneId}`}</div>;
    },
    enableSorting: true,
    enableColumnFilter: false
  },
  {
    id: 'continent',
    accessorKey: 'continent',
    header: ({ column }: { column: Column<Country, unknown> }) => (
      <DataTableColumnHeader column={column} title='Lục địa' />
    ),
    cell: ({ row }) => (
      <Badge variant='outline' className='capitalize'>
        {row.getValue<string>('continent')}
      </Badge>
    ),
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: 'continent',
      variant: 'multiSelect',
      options: CONTINENT_OPTIONS,
      icon: MapPin
    }
  },
  {
    id: 'code2',
    accessorKey: 'code2',
    header: ({ column }: { column: Column<Country, unknown> }) => (
      <DataTableColumnHeader column={column} title='ISO Code (2)' />
    ),
    cell: ({ row }) => (
      <div className='font-medium uppercase'>{row.getValue('code2')}</div>
    ),
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: 'ISO Code (2)',
      placeholder: 'Search by ISO code...',
      variant: 'text',
      icon: Text
    }
  },
  {
    id: 'code3',
    accessorKey: 'code3',
    header: ({ column }: { column: Column<Country, unknown> }) => (
      <DataTableColumnHeader column={column} title='ISO Code (3)' />
    ),
    cell: ({ row }) => (
      <div className='font-medium uppercase'>{row.getValue('code3')}</div>
    ),
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: 'ISO Code (3)',
      placeholder: 'Search by ISO code...',
      variant: 'text',
      icon: Text
    }
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<Country, unknown> }) => (
      <DataTableColumnHeader column={column} title='Tên Quốc Gia' />
    ),
    cell: ({ row }) => <div>{row.getValue<string>('name')}</div>,
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: 'Tên Quốc Gia',
      placeholder: 'Tìm kiếm quốc gia...',
      variant: 'text',
      icon: Globe
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
