'use client';

import { Button } from '@/components/ui/button';
import { Zone } from '@/types/system-configuration';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fakeZones } from '@/constants/mock-system-config';
import { useDrawer } from '../context/drawer-context';

interface CellActionProps {
  data: Zone;
}

/**
 * Cell action component for the zones table
 * Provides edit and delete actions for each zone row
 */
export function CellAction({ data }: CellActionProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { openDrawer } = useDrawer();

  // Mutation for deleting a zone
  const deleteMutation = useMutation({
    mutationFn: (id: number) => fakeZones.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zones'] });
      toast.success('Zone deleted successfully');
    },
    onError: (error) => {
      toast.error(
        `Failed to delete zone: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  });

  /**
   * Handle editing a zone
   */
  const handleEdit = () => {
    // Open drawer with zone data for editing
    openDrawer(data);
  };

  /**
   * Handle deleting a zone
   */
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this zone?')) {
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
