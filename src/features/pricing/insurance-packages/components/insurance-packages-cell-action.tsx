/**
 * Cell Actions for Commodity Types DataTable
 * Contains the dropdown menu with actions for each commodity type row
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { InsurancePackage } from '@/types/system-configuration';
import { useDrawer } from '../context/drawer-context';
import { deleteInsurancePackage } from '@/lib/api/system-configuration-api';

interface CellActionProps {
  data: InsurancePackage;
}

/**
 * Cell action component for commodity types table
 */
export function CellAction({ data }: CellActionProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { openDrawer } = useDrawer();
  const [open, setOpen] = useState(false);

  // Delete mutation for commodity types
  const deleteMutation = useMutation({
    mutationFn: deleteInsurancePackage,
    onSuccess: () => {
      toast.success('Insurance package deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['insurance-packages'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete insurance package: ${error.message}`);
    }
  });

  const onDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${data.name}?`
    );
    if (confirmed) {
      deleteMutation.mutate(data.id);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => {
            openDrawer(data);
            setOpen(false);
          }}
        >
          <Pencil className='mr-2 h-4 w-4' />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            onDelete();
            setOpen(false);
          }}
        >
          <Trash2 className='mr-2 h-4 w-4' />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
