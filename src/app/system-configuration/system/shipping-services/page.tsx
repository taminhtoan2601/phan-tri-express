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
import { ShippingServicesListing } from '@/features/system/shipping-services/components/shipping-services-listing';
import {
  DrawerProvider,
  useDrawer
} from '@/features/system/shipping-services/context/drawer-context';
import { ShippingServiceForm } from '@/features/system/shipping-services/components/shipping-services-form';

/**
 * Payment Types page component with drawer context
 */
function PaymentTypesPageContent() {
  const { isOpen, shippingService, openDrawer, closeDrawer } = useDrawer();

  return (
    <PageContainer scrollable={false}>
      <div
        className='flex flex-1 flex-col space-y-4'
        style={{ minHeight: 'calc(100vh - 10rem)' }}
      >
        <div className='flex items-start justify-between'>
          <Heading
            title='Shipping Services'
            description='Manage shipping services used in shipping orders'
          />
          <Button onClick={() => openDrawer()}>
            <IconPlus className='mr-2 h-4 w-4' />
            Add Shipping Service
          </Button>
        </div>
        <Separator />

        <Suspense
          fallback={
            <DataTableSkeleton columnCount={3} rowCount={8} filterCount={1} />
          }
        >
          <ShippingServicesListing />
        </Suspense>
      </div>

      <DataDrawer
        title={
          shippingService ? 'Edit Shipping Service' : 'Add Shipping Service'
        }
        isOpen={isOpen}
        onClose={closeDrawer}
      >
        <ShippingServiceForm
          initialData={shippingService}
          onClose={closeDrawer}
        />
      </DataDrawer>
    </PageContainer>
  );
}

/**
 * Payment Types configuration page component
 */
export default function PaymentTypesPage() {
  return (
    <DrawerProvider>
      <PaymentTypesPageContent />
    </DrawerProvider>
  );
}
