/**
 * Payment Types Configuration Page
 * Manages the payment types used in the shipping system
 */
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPaymentTypes,
  createPaymentType,
  updatePaymentType,
  deletePaymentType
} from '@/lib/api/system-configuration-api';
import {
  DataTable,
  DataDrawer
} from '@/components/system-configuration/data-table';
import { PaymentType } from '@/types/system-configuration';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { PencilIcon, TrashIcon } from 'lucide-react';

/**
 * Form data structure for payment type form
 */
interface PaymentTypeFormData {
  id?: number;
  code: string;
  name: string;
}

// API functions are imported from system-configuration-api.ts

/**
 * Payment Types configuration page component
 */
export default function PaymentTypesPage() {
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState<PaymentTypeFormData>({
    code: '',
    name: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch payment types data
  const { data: paymentTypes, isPending } = useQuery<PaymentType[]>({
    queryKey: ['payment-types'],
    queryFn: getPaymentTypes
  });

  // Mutation for creating a new payment type
  const createMutation = useMutation({
    mutationFn: createPaymentType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-types'] });
      toast.success('Payment type created successfully');
      closeDrawer();
    },
    onError: (error: Error) => {
      toast.error(`Failed to create payment type: ${error.message}`);
    }
  });

  // Mutation for updating a payment type
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PaymentType> }) =>
      updatePaymentType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-types'] });
      toast.success('Payment type updated successfully');
      closeDrawer();
    },
    onError: (error: Error) => {
      toast.error(`Failed to update payment type: ${error.message}`);
    }
  });

  // Mutation for deleting a payment type
  const deleteMutation = useMutation({
    mutationFn: deletePaymentType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-types'] });
      toast.success('Payment type deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete payment type: ${error.message}`);
    }
  });

  /**
   * Handles form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code || !formData.name) {
      toast.error('Please fill all required fields');
      return;
    }

    if (isEditing && formData.id) {
      updateMutation.mutate({
        id: formData.id,
        data: {
          code: formData.code,
          name: formData.name
        }
      });
    } else {
      createMutation.mutate({
        code: formData.code,
        name: formData.name
      });
    }
  };

  /**
   * Opens the drawer for adding a new payment type
   */
  const handleAdd = () => {
    setFormData({ code: '', name: '' });
    setIsEditing(false);
    setIsDrawerOpen(true);
  };

  /**
   * Opens the drawer for editing an existing payment type
   */
  const handleEdit = (paymentType: PaymentType) => {
    setFormData({
      id: paymentType.id,
      code: paymentType.code,
      name: paymentType.name
    });
    setIsEditing(true);
    setIsDrawerOpen(true);
  };

  /**
   * Handles payment type deletion
   */
  const handleDelete = (paymentType: PaymentType) => {
    if (
      window.confirm(`Are you sure you want to delete ${paymentType.name}?`)
    ) {
      deleteMutation.mutate(paymentType.id);
    }
  };

  /**
   * Closes the drawer and resets form
   */
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setFormData({ code: '', name: '' });
  };

  // Column configuration for the data table
  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'code', header: 'Code' },
    { key: 'name', header: 'Name' },
    {
      key: 'actions',
      header: 'Actions',
      render: (paymentType: PaymentType) => (
        <div className='flex space-x-2'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => handleEdit(paymentType)}
          >
            <PencilIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            onClick={() => handleDelete(paymentType)}
          >
            <TrashIcon className='h-4 w-4' />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className='container mx-auto py-6'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold'>Payment Types</h1>
        <p className='text-muted-foreground'>
          Manage payment types that are used in shipping orders
        </p>
      </div>

      <DataTable
        data={paymentTypes || []}
        columns={columns}
        onAdd={handleAdd}
        isLoading={isPending}
      />

      <DataDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        title={isEditing ? 'Edit Payment Type' : 'Add New Payment Type'}
      >
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='code'>Code</Label>
            <Input
              id='code'
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              placeholder='e.g. COD, PREP'
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='name'>Name</Label>
            <Input
              id='name'
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder='e.g. Cash on Delivery, Prepaid'
              required
            />
          </div>

          <div className='flex justify-end gap-2'>
            <Button type='button' variant='outline' onClick={closeDrawer}>
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DataDrawer>
    </div>
  );
}
