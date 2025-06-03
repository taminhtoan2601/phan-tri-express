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
import { PaymentTypesListing } from '@/features/system/payment-types/components/payment-types-listing';
import { PaymentTypeForm } from '@/features/system/payment-types/components/payment-type-form';
import {
  DrawerProvider,
  useDrawer
} from '@/features/system/payment-types/context/drawer-context';

/**
 * Payment Types page component with drawer context
 */
function PaymentTypesPageContent() {
  const { isOpen, paymentType, openDrawer, closeDrawer } = useDrawer();

  return (
    <PageContainer scrollable={false}>
      <div
        className='flex flex-1 flex-col space-y-4'
        style={{ minHeight: 'calc(100vh - 10rem)' }}
      >
        <div className='flex items-start justify-between'>
          <Heading
            title='Payment Types'
            description='Manage payment types used in shipping orders'
          />
          <Button onClick={() => openDrawer()}>
            <IconPlus className='mr-2 h-4 w-4' />
            Add Payment Type
          </Button>
        </div>
        <Separator />

        <Suspense
          fallback={
            <DataTableSkeleton columnCount={3} rowCount={8} filterCount={1} />
          }
        >
          <PaymentTypesListing />
        </Suspense>
      </div>

      <DataDrawer
        title={paymentType ? 'Edit Payment Type' : 'Add Payment Type'}
        isOpen={isOpen}
        onClose={closeDrawer}
      >
        <PaymentTypeForm initialData={paymentType} onClose={closeDrawer} />
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
