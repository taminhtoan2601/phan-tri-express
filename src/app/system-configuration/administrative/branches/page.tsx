'use client';

/**
 * Branches Configuration Page
 * Manages branch offices and locations using the DataTable architecture
 */

import { DrawerProvider } from '@/features/administrative/branches/context/drawer-context';
import { useDrawer } from '@/features/administrative/branches/context/drawer-context';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { BranchForm } from '@/features/administrative/branches/components/branch-form';
import { DataDrawer } from '@/components/system-configuration/data-table';
import { BranchesListing } from '@/features/administrative/branches/components/branches-listing';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';

import { Suspense } from 'react';
import PageContainer from '@/components/layout/page-container';

export function BranchesContent() {
  const { isOpen, branch, openDrawer, closeDrawer } = useDrawer();

  const handleAddNewBranch = () => {
    openDrawer(); // Open drawer without branch data = add new
  };

  return (
    <PageContainer scrollable={false}>
      <div
        className='flex flex-1 flex-col space-y-4'
        style={{ minHeight: 'calc(100vh - 10rem)' }}
      >
        <div className='flex items-start justify-between'>
          <Heading
            title='Branches'
            description='Manage branch offices and locations'
          />
          <Button onClick={handleAddNewBranch}>
            <IconPlus className='mr-2 h-4 w-4' />
            Add Branch
          </Button>
        </div>
        <Separator />

        <Suspense
          fallback={
            <DataTableSkeleton columnCount={3} rowCount={8} filterCount={1} />
          }
        >
          <BranchesListing />
        </Suspense>
      </div>

      <DataDrawer
        title={branch ? 'Edit Branch' : 'Add Branch'}
        isOpen={isOpen}
        onClose={closeDrawer}
      >
        <BranchForm />
      </DataDrawer>
    </PageContainer>
  );
}

/**
 * Branches configuration page component
 */
export default function BranchesPage() {
  return (
    <DrawerProvider>
      <BranchesContent />
    </DrawerProvider>
  );
}
