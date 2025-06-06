'use client';

import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Price } from '@/types/system-configuration';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CellAction } from './prices-cell-action';
import { cities, countries, routes, shippingServices, zones } from '@/data';

/**
 * Column definitions for the countries table
 * Each column can have filtering, sorting, and custom rendering capabilities
 */
export const columns: ColumnDef<Price>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: ({ column }: { column: Column<Price, unknown> }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => <div className='font-medium'>{row.getValue('id')}</div>,
    enableSorting: true,
    enableColumnFilter: false
  },

  {
    id: 'routeId',
    accessorKey: 'routeId',
    header: ({ column }: { column: Column<Price, unknown> }) => (
      <DataTableColumnHeader column={column} title='Tuyến Vận Chuyển' />
    ),
    cell: ({ row }) => {
      // Truy cập thuộc tính zone đã được join sẵn
      const route = row.original;

      return <div>{route.route?.name || `Route ${route.routeId}`}</div>;
    },
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: 'Tuyến Vận Chuyển',
      variant: 'multiSelect',
      options: routes.map((route) => ({
        label: route.name,
        value: route.id.toString()
      }))
    }
  },
  {
    id: 'shippingServiceId',
    accessorKey: 'shippingServiceId',
    header: ({ column }: { column: Column<Price, unknown> }) => (
      <DataTableColumnHeader column={column} title='Dịch vụ' />
    ),
    cell: ({ row }) => {
      // Truy cập thuộc tính zone đã được join sẵn
      const price = row.original;

      return (
        <div>
          {price.shippingService?.name || `Service ${price.shippingServiceId}`}
        </div>
      );
    },
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: 'Dịch vụ',
      variant: 'multiSelect',
      options: shippingServices.map((service) => ({
        label: service.name,
        value: service.id.toString()
      }))
    }
  },
  {
    id: 'baseRatePerKg  ',
    accessorKey: 'baseRatePerKg',
    header: ({ column }: { column: Column<Price, unknown> }) => (
      <DataTableColumnHeader column={column} title='Giá Cân Trung Bình' />
    ),
    cell: ({ row }) => {
      // Truy cập thuộc tính zone đã được join sẵn
      const price = row.original;

      return <div>{price.baseRatePerKg}</div>;
    },
    enableSorting: true,
    enableColumnFilter: true
  },
  {
    id: 'effectiveDate',
    accessorKey: 'effectiveDate',
    header: ({ column }: { column: Column<Price, unknown> }) => (
      <DataTableColumnHeader column={column} title='Ngày Hiệu Lực' />
    ),
    cell: ({ row }) => {
      // Truy cập thuộc tính zone đã được join sẵn
      const price = row.original;

      return <div>{price.effectiveDate}</div>;
    },
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: 'Ngày Hiệu Lực',
      variant: 'multiSelect',
      options: countries.map((country) => ({
        label: country.name,
        value: country.id.toString()
      }))
    }
  },
  {
    id: 'deletionDate',
    accessorKey: 'deletionDate',
    header: ({ column }: { column: Column<Price, unknown> }) => (
      <DataTableColumnHeader column={column} title='Ngày Hủy' />
    ),
    cell: ({ row }) => {
      // Truy cập thuộc tính zone đã được join sẵn
      const price = row.original;

      return <div>{price.deletionDate}</div>;
    },
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: 'Ngày Hủy',
      variant: 'multiSelect',
      options: countries.map((country) => ({
        label: country.name,
        value: country.id.toString()
      }))
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
