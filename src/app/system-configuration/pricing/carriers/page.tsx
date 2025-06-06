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
import { CarriersListing } from '@/features/pricing/carriers/components/carriers-listing';
import {
  DrawerProvider,
  useDrawer
} from '@/features/pricing/carriers/context/drawer-context';
import { CarrierForm } from '@/features/pricing/carriers/components/carriers-form';

/**
 * Insurance Packages page component with drawer context
 */
function CarriersPageContent() {
  const { isOpen, carrier, openDrawer, closeDrawer } = useDrawer();

  return (
    <PageContainer scrollable={false}>
      <div
        className='flex flex-1 flex-col space-y-4'
        style={{ minHeight: 'calc(100vh - 10rem)' }}
      >
        <div className='flex items-start justify-between'>
          <Heading
            title='Đơn Vị Vận Chuyển'
            description='Quản lý đơn vị vận chuyển'
          />
          <Button onClick={() => openDrawer()}>
            <IconPlus className='mr-2 h-4 w-4' />
            Thêm Đơn Vị Vận Chuyển
          </Button>
        </div>
        <Separator />

        <Suspense
          fallback={
            <DataTableSkeleton columnCount={3} rowCount={8} filterCount={1} />
          }
        >
          <CarriersListing />
        </Suspense>
      </div>

      <DataDrawer
        title={
          carrier ? 'Chỉnh Sửa Đơn Vị Vận Chuyển' : 'Thêm Đơn Vị Vận Chuyển'
        }
        isOpen={isOpen}
        onClose={closeDrawer}
      >
        <CarrierForm initialData={carrier} onClose={closeDrawer} />
      </DataDrawer>
    </PageContainer>
  );
}

/**
 * Insurance Packages configuration page component
 */
export default function CarriersPage() {
  return (
    <DrawerProvider>
      <CarriersPageContent />
    </DrawerProvider>
  );
}
