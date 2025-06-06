/**
 * Giá Configuration Page
 * Manages shipping zones used in the pricing system
 */
'use client';

import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { DataDrawer } from '@/components/system-configuration/data-table';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { IconPlus } from '@tabler/icons-react';
import {
  DrawerProvider,
  useDrawer
} from '@/features/pricing/prices/context/drawer-context';
import { PricesForm } from '@/features/pricing/prices/components/prices-form';
import { PricesListing } from '@/features/pricing/prices/components/prices-listing';

/**
 * Insurance Packages page component with drawer context
 */
function PricesPageContent() {
  const { isOpen, price, openDrawer, closeDrawer } = useDrawer();

  return (
    <PageContainer scrollable={false}>
      <div
        className='flex flex-1 flex-col space-y-4'
        style={{ minHeight: 'calc(100vh - 10rem)' }}
      >
        <div className='flex items-start justify-between'>
          <Heading title='Giá' description='Quản lý giá trong hệ thống' />
          <Button onClick={() => openDrawer()}>
            <IconPlus className='mr-2 h-4 w-4' />
            Thêm giá
          </Button>
        </div>
        <Separator />

        <Suspense
          fallback={
            <DataTableSkeleton columnCount={3} rowCount={8} filterCount={1} />
          }
        >
          <PricesListing />
        </Suspense>
      </div>

      <DataDrawer
        title={price ? 'Sửa Giá' : 'Thêm Giá'}
        isOpen={isOpen}
        onClose={closeDrawer}
      >
        <PricesForm initialData={price || null} onClose={closeDrawer} />
      </DataDrawer>
    </PageContainer>
  );
}

/**
 * Insurance Packages configuration page component
 */
export default function PricesPage() {
  return (
    <DrawerProvider>
      <PricesPageContent />
    </DrawerProvider>
  );
}
