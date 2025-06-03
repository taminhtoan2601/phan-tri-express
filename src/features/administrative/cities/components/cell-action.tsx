'use client';

import { Button } from '@/components/ui/button';
import { City } from '@/types/system-configuration';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fakeCities } from '@/constants/mock-system-config';
import { useDrawer } from '../context/drawer-context';

interface CellActionProps {
  data: City;
}

/**
 * Cell action component for the cities table
 * Provides edit and delete actions for each city row
 */
export function CellAction({ data }: CellActionProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { openDrawer } = useDrawer();

  // Mutation for deleting a city
  const deleteMutation = useMutation({
    mutationFn: (id: number) => fakeCities.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities'] });
      toast.success('City deleted successfully');
    },
    onError: (error) => {
      toast.error(
        `Failed to delete city: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  });

  /**
   * Handle editing a city
   */
  const handleEdit = () => {
    // Open drawer with city data for editing
    openDrawer(data);
  };

  /**
   * Handle deleting a city
   */
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this city?')) {
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
