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
import { CommodityTypesListing } from '@/features/system/commodity-types/components/commodity-types-listing';
import { CommodityTypeForm } from '@/features/system/commodity-types/components/commodity-type-form';
import {
  DrawerProvider,
  useDrawer
} from '@/features/system/commodity-types/context/drawer-context';

/**
 * Commodity Types page component with drawer context
 */
function CommodityTypesPageContent() {
  const { isOpen, commodityType, openDrawer, closeDrawer } = useDrawer();

  return (
    <PageContainer scrollable={false}>
      <div
        className='flex flex-1 flex-col space-y-4'
        style={{ minHeight: 'calc(100vh - 10rem)' }}
      >
        <div className='flex items-start justify-between'>
          <Heading
            title='Commodity Types'
            description='Manage commodity types used in shipping orders'
          />
          <Button onClick={() => openDrawer()}>
            <IconPlus className='mr-2 h-4 w-4' />
            Add Commodity Type
          </Button>
        </div>
        <Separator />

        <Suspense
          fallback={
            <DataTableSkeleton columnCount={3} rowCount={8} filterCount={1} />
          }
        >
          <CommodityTypesListing />
        </Suspense>
      </div>

      <DataDrawer
        title={commodityType ? 'Edit Commodity Type' : 'Add Commodity Type'}
        isOpen={isOpen}
        onClose={closeDrawer}
      >
        <CommodityTypeForm initialData={commodityType} onClose={closeDrawer} />
      </DataDrawer>
    </PageContainer>
  );
}

/**
 * Commodity Types configuration page component
 */
export default function CommodityTypesPage() {
  return (
    <DrawerProvider>
      <CommodityTypesPageContent />
    </DrawerProvider>
  );
}
