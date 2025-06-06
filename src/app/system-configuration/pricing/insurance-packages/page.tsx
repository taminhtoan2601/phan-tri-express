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
import { InsurancePackagesListing } from '@/features/pricing/insurance-packages/components/insurance-packages-listing';
import {
  DrawerProvider,
  useDrawer
} from '@/features/pricing/insurance-packages/context/drawer-context';
import { InsurancePackageForm } from '@/features/pricing/insurance-packages/components/insurance-packages-form';

/**
 * Insurance Packages page component with drawer context
 */
function InsurancePackagesPageContent() {
  const { isOpen, insurancePackage, openDrawer, closeDrawer } = useDrawer();

  return (
    <PageContainer scrollable={false}>
      <div
        className='flex flex-1 flex-col space-y-4'
        style={{ minHeight: 'calc(100vh - 10rem)' }}
      >
        <div className='flex items-start justify-between'>
          <Heading title='Gói Bảo Hiểm' description='Quản lý gói bảo hiểm' />
          <Button onClick={() => openDrawer()}>
            <IconPlus className='mr-2 h-4 w-4' />
            Thêm Gói Bảo Hiểm
          </Button>
        </div>
        <Separator />

        <Suspense
          fallback={
            <DataTableSkeleton columnCount={3} rowCount={8} filterCount={1} />
          }
        >
          <InsurancePackagesListing />
        </Suspense>
      </div>

      <DataDrawer
        title={
          insurancePackage ? 'Chỉnh Sửa Gói Bảo Hiểm' : 'Thêm Gói Bảo Hiểm'
        }
        isOpen={isOpen}
        onClose={closeDrawer}
      >
        <InsurancePackageForm
          initialData={insurancePackage}
          onClose={closeDrawer}
        />
      </DataDrawer>
    </PageContainer>
  );
}

/**
 * Insurance Packages configuration page component
 */
export default function InsurancePackagesPage() {
  return (
    <DrawerProvider>
      <InsurancePackagesPageContent />
    </DrawerProvider>
  );
}
