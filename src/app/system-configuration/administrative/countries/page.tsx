/**
 * Countries Configuration Page
 * Manages the countries used in the shipping system with advanced table features
 */
'use client';

import { Suspense } from 'react';
import { CountriesListing } from '@/features/administrative/countries/components';
import { DataDrawer } from '@/components/system-configuration/data-table';
import { CountryForm } from '@/features/administrative/countries/components/country-form';
import PageContainer from '@/components/layout/page-container';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { Separator } from '@/components/ui/separator';

import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import { Heading } from '@/components/ui/heading';

import {
  DrawerProvider,
  useDrawer
} from '@/features/administrative/countries/context/drawer-context';

/**
 * CountriesContent component - content inside the DrawerProvider
 */
function CountriesContent() {
  const { isOpen, country, openDrawer, closeDrawer } = useDrawer();

  /**
   * Handle opening the drawer to add a new country
   */
  const handleAddNewCountry = () => {
    openDrawer(); // Open drawer without country data = add new
  };

  return (
    <PageContainer scrollable={false}>
      <div
        className='flex flex-1 flex-col space-y-4'
        style={{ minHeight: 'calc(100vh - 10rem)' }}
      >
        <div className='flex items-start justify-between'>
          <Heading
            title='Quốc Gia'
            description='Quản lý quốc gia cho các tuyến giao hàng'
          />
          <Button onClick={handleAddNewCountry}>
            <IconPlus className='mr-2 h-4 w-4' />
            Thêm Quốc Gia
          </Button>
        </div>
        <Separator />

        <Suspense
          fallback={
            <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
          }
        >
          <CountriesListing />
        </Suspense>

        <DataDrawer
          title={country ? 'Sửa Quốc Gia' : 'Thêm Quốc Gia'}
          isOpen={isOpen}
          onClose={closeDrawer}
        >
          <CountryForm initialData={country} onClose={closeDrawer} />
        </DataDrawer>
      </div>
    </PageContainer>
  );
}

/**
 * Countries page component
 * Provides a list of countries with filtering, sorting, and pagination
 * Allows adding, editing, and deleting countries²
 */
export default function CountriesPage() {
  return (
    <DrawerProvider>
      <CountriesContent />
    </DrawerProvider>
  );
}
