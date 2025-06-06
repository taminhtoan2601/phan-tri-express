/**
 * Cities Configuration Page
 * Manages cities used in the system with advanced table features
 */
'use client';

import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { DataDrawer } from '@/components/system-configuration/data-table';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { IconPlus } from '@tabler/icons-react';
import { CitiesListing } from '@/features/administrative/cities/components/cities-listing';
import { CityForm } from '@/features/administrative/cities/components/city-form';
import {
  DrawerProvider,
  useDrawer
} from '@/features/administrative/cities/context/drawer-context';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

/**
 * Cities page component with drawer context
 */
function CitiesPageContent() {
  const { isOpen, city, openDrawer, closeDrawer } = useDrawer();

  /**
   * Handle opening the drawer to add a new city
   */
  const handleAddNewCity = () => {
    openDrawer(); // Open drawer without city data = add new
  };
  return (
    <PageContainer scrollable={false}>
      <div
        className='flex flex-1 flex-col space-y-4'
        style={{ minHeight: 'calc(100vh - 10rem)' }}
      >
        <div className='flex items-start justify-between'>
          <Heading
            title='Thành Phố'
            description='Quản lý thành phố cho các tuyến giao hàng'
          />
          <Button onClick={handleAddNewCity}>
            <IconPlus className='mr-2 h-4 w-4' />
            Thêm Thành Phố
          </Button>
        </div>
        <Separator />

        <Suspense
          fallback={
            <DataTableSkeleton columnCount={3} rowCount={8} filterCount={1} />
          }
        >
          <CitiesListing />
        </Suspense>
      </div>

      <DataDrawer
        title={city ? 'Sửa Thành Phố' : 'Thêm Thành Phố'}
        isOpen={isOpen}
        onClose={closeDrawer}
      >
        <CityForm />
      </DataDrawer>
    </PageContainer>
  );
}

/**
 * Default export - Cities page with DrawerProvider wrapper
 */
export default function CitiesPage() {
  return (
    <DrawerProvider>
      <CitiesPageContent />
    </DrawerProvider>
  );
}
