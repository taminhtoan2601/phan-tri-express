/**
 * Zones Configuration Page
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
import { ShippingTypesListing } from '@/features/system/shipping-types/components/shipping-types-listing';
import {
  DrawerProvider,
  useDrawer
} from '@/features/system/shipping-types/context/drawer-context';
import { ShippingTypeForm } from '@/features/system/shipping-types/components/shipping-types-form';

/**
 * Commodity Types page component with drawer context
 */
function ShippingTypesPageContent() {
  const { isOpen, shippingType, openDrawer, closeDrawer } = useDrawer();

  return (
    <PageContainer scrollable={false}>
      <div
        className='flex flex-1 flex-col space-y-4'
        style={{ minHeight: 'calc(100vh - 10rem)' }}
      >
        <div className='flex items-start justify-between'>
          <Heading
            title='Shipping Types'
            description='Manage shipping types used in shipping orders'
          />
          <Button onClick={() => openDrawer()}>
            <IconPlus className='mr-2 h-4 w-4' />
            Add Shipping Type
          </Button>
        </div>
        <Separator />

        <Suspense
          fallback={
            <DataTableSkeleton columnCount={3} rowCount={8} filterCount={1} />
          }
        >
          <ShippingTypesListing />
        </Suspense>
      </div>

      <DataDrawer
        title={shippingType ? 'Edit Shipping Type' : 'Add Shipping Type'}
        isOpen={isOpen}
        onClose={closeDrawer}
      >
        <ShippingTypeForm initialData={shippingType} onClose={closeDrawer} />
      </DataDrawer>
    </PageContainer>
  );
}

/**
 * Commodity Types configuration page component
 */
export default function ShippingTypesPage() {
  return (
    <DrawerProvider>
      <ShippingTypesPageContent />
    </DrawerProvider>
  );
}
