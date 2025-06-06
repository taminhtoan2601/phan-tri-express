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
import { RoutesListing } from '@/features/pricing/routes/components/routes-listing';
import {
  DrawerProvider,
  useDrawer
} from '@/features/pricing/routes/context/drawer-context';
import { RouteForm } from '@/features/pricing/routes/components';

/**
 * Routes page component with drawer context
 */
function RoutesPageContent() {
  const { isOpen, route, openDrawer, closeDrawer } = useDrawer();

  return (
    <PageContainer scrollable={false}>
      <div
        className='flex flex-1 flex-col space-y-4'
        style={{ minHeight: 'calc(100vh - 10rem)' }}
      >
        <div className='flex items-start justify-between'>
          <Heading
            title='Tuyến Vận Chuyển'
            description='Quản lý các tuyến vận chuyển'
          />
          <Button onClick={() => openDrawer()}>
            <IconPlus className='mr-2 h-4 w-4' />
            Thêm Tuyến Vận Chuyển
          </Button>
        </div>
        <Separator />

        <Suspense
          fallback={
            <DataTableSkeleton columnCount={3} rowCount={8} filterCount={1} />
          }
        >
          <RoutesListing />
        </Suspense>
      </div>

      <DataDrawer
        title={route ? 'Chỉnh Sửa Tuyến Vận Chuyển' : 'Thêm Tuyến Vận Chuyển'}
        isOpen={isOpen}
        onClose={closeDrawer}
      >
        <RouteForm initialData={route} onClose={closeDrawer} />
      </DataDrawer>
    </PageContainer>
  );
}

/**
 * Insurance Packages configuration page component
 */
export default function RoutesPage() {
  return (
    <DrawerProvider>
      <RoutesPageContent />
    </DrawerProvider>
  );
}
