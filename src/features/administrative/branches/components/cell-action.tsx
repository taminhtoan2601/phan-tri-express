'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Branch } from '@/types/system-configuration';
import { useDrawer } from '../context/drawer-context';
import { fakeBranches } from '@/constants/mock-system-config';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { AlertModal } from '@/components/modal/alert-modal';

/**
 * Props for CellAction component
 */
interface CellActionProps {
  data: Branch;
}

/**
 * Component for row action buttons (edit/delete)
 */
export function CellAction({ data }: CellActionProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { openDrawer } = useDrawer();

  /**
   * Mutation for deleting a branch
   */
  const deleteMutation = useMutation({
    mutationFn: () => fakeBranches.delete(data.id),
    onSuccess: () => {
      toast.success('Branch deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['branches'] });
    },
    onError: (error) => {
      toast.error(
        `Error deleting branch: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  });

  /**
   * Handle delete confirmation
   */
  const onConfirmDelete = () => {
    deleteMutation.mutate();
    setOpen(false);
  };

  /**
   * Handle edit button click
   */
  const onEdit = () => {
    openDrawer(data);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirmDelete}
        loading={deleteMutation.isPending}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className='mr-2 h-4 w-4' />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className='text-red-600'
          >
            <Trash className='mr-2 h-4 w-4' />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
