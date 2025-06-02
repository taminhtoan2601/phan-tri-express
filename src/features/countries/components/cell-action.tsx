'use client';

import { Button } from '@/components/ui/button';
import { Country } from '@/types/system-configuration';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fakeCountries } from '@/constants/mock-system-config';
import { useDrawer } from '../context/drawer-context';

interface CellActionProps {
  data: Country;
}

/**
 * Cell action component for the countries table
 * Provides edit and delete actions for each country row
 */
export function CellAction({ data }: CellActionProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Mutation for deleting a country
  const deleteMutation = useMutation({
    mutationFn: (id: number) => fakeCountries.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
      toast.success('Country deleted successfully');
    },
    onError: (error) => {
      toast.error(
        `Failed to delete country: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  });

  const { openDrawer } = useDrawer();

  /**
   * Handle editing a country
   */
  const handleEdit = () => {
    // Open drawer with country data for editing
    openDrawer(data);
  };

  /**
   * Handle deleting a country
   */
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this country?')) {
      deleteMutation.mutate(data.id);
    }
  };

  return (
    <div className='flex items-center space-x-2'>
      <Button
        variant='outline'
        size='sm'
        onClick={handleEdit}
        className='h-8 w-8 p-0'
      >
        <PencilIcon className='h-4 w-4' />
      </Button>
      <Button
        variant='destructive'
        size='sm'
        onClick={handleDelete}
        className='h-8 w-8 p-0'
      >
        <TrashIcon className='h-4 w-4' />
      </Button>
    </div>
  );
}
