'use client';

import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Route } from '@/types/system-configuration';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CellAction } from './routes-cell-action';
import { cities, countries, zones } from '@/data';

/**
 * Column definitions for the countries table
 * Each column can have filtering, sorting, and custom rendering capabilities
 */
export const columns: ColumnDef<Route>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: ({ column }: { column: Column<Route, unknown> }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => <div className='font-medium'>{row.getValue('id')}</div>,
    enableSorting: true,
    enableColumnFilter: false
  },

  {
    id: 'zoneId',
    accessorKey: 'zoneId',
    header: ({ column }: { column: Column<Route, unknown> }) => (
      <DataTableColumnHeader column={column} title='Zone' />
    ),
    cell: ({ row }) => {
      // Truy cập thuộc tính zone đã được join sẵn
      const route = row.original;

      return <div>{route.zone?.name || `Zone ${route.zoneId}`}</div>;
    },
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: 'Zone',
      variant: 'multiSelect',
      options: zones.map((zone) => ({
        label: zone.name,
        value: zone.id.toString()
      }))
    }
  },
  {
    id: 'originCountryId',
    accessorKey: 'originCountryId',
    header: ({ column }: { column: Column<Route, unknown> }) => (
      <DataTableColumnHeader column={column} title='Origin Country' />
    ),
    cell: ({ row }) => {
      // Truy cập thuộc tính zone đã được join sẵn
      const route = row.original;

      return (
        <div>
          {route.originCountry?.name || `Zone ${route.originCountryId}`}
        </div>
      );
    },
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: 'Origin Country',
      variant: 'multiSelect',
      options: countries.map((country) => ({
        label: country.name,
        value: country.id.toString()
      }))
    }
  },
  {
    id: 'originCityId',
    accessorKey: 'originCityId',
    header: ({ column }: { column: Column<Route, unknown> }) => (
      <DataTableColumnHeader column={column} title='Origin City' />
    ),
    cell: ({ row }) => {
      // Truy cập thuộc tính zone đã được join sẵn
      const route = row.original;

      return (
        <div>{route.originCity?.name || `Zone ${route.originCityId}`}</div>
      );
    },
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: 'Origin City',
      variant: 'multiSelect',
      options: cities.map((city) => ({
        label: city.name,
        value: city.id.toString()
      }))
    }
  },
  {
    id: 'destinationCountryId',
    accessorKey: 'destinationCountryId',
    header: ({ column }: { column: Column<Route, unknown> }) => (
      <DataTableColumnHeader column={column} title='Destination Country' />
    ),
    cell: ({ row }) => {
      // Truy cập thuộc tính zone đã được join sẵn
      const route = row.original;

      return (
        <div>
          {route.destinationCountry?.name ||
            `Zone ${route.destinationCountryId}`}
        </div>
      );
    },
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: 'Destination Country',
      variant: 'multiSelect',
      options: countries.map((country) => ({
        label: country.name,
        value: country.id.toString()
      }))
    }
  },
  {
    id: 'destinationCityId',
    accessorKey: 'destinationCityId',
    header: ({ column }: { column: Column<Route, unknown> }) => (
      <DataTableColumnHeader column={column} title='Destination City' />
    ),
    cell: ({ row }) => {
      // Truy cập thuộc tính zone đã được join sẵn
      const route = row.original;

      return (
        <div>
          {route.destinationCity?.name || `Zone ${route.destinationCityId}`}
        </div>
      );
    },
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: 'Destination City',
      variant: 'multiSelect',
      options: cities.map((city) => ({
        label: city.name,
        value: city.id.toString()
      }))
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
