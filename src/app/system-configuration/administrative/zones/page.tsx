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
import { ZonesListing } from '@/features/zones/components/zones-listing';
import { ZoneForm } from '@/features/zones/components/zone-form';
import {
  DrawerProvider,
  useDrawer
} from '@/features/zones/context/drawer-context';

/**
 * Zones page component with drawer context
 */
function ZonesPageContent() {
  const { isOpen, zone, openDrawer, closeDrawer } = useDrawer();

  return (
    <PageContainer scrollable={false}>
      <div
        className='flex flex-1 flex-col space-y-4'
        style={{ minHeight: 'calc(100vh - 10rem)' }}
      >
        <div className='flex items-start justify-between'>
          <Heading
            title='Shipping Zones'
            description='Manage shipping zones for pricing calculations'
          />
          <Button onClick={() => openDrawer()}>
            <IconPlus className='mr-2 h-4 w-4' />
            Add Zone
          </Button>
        </div>
        <Separator />

        <Suspense
          fallback={
            <DataTableSkeleton columnCount={3} rowCount={8} filterCount={1} />
          }
        >
          <ZonesListing />
        </Suspense>
      </div>

      <DataDrawer
        title={zone ? 'Edit Zone' : 'Add Zone'}
        isOpen={isOpen}
        onClose={closeDrawer}
      >
        <ZoneForm />
      </DataDrawer>
    </PageContainer>
  );
}

/**
 * Default export with DrawerProvider wrapper
 */
export default function ZonesPage() {
  return (
    <DrawerProvider>
      <ZonesPageContent />
    </DrawerProvider>
  );
}
