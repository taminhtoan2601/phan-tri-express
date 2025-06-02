/**
 * Shipping Types Configuration Page
 * Manages shipping types and their configurations
 */
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DataTable,
  DataDrawer
} from '@/components/system-configuration/data-table';
import { ShippingType } from '@/types/system-configuration';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { fakeShippingTypes } from '@/constants/mock-system-config';
import { PencilIcon, TrashIcon } from 'lucide-react';

/**
 * Form data structure for shipping type form
 */
interface ShippingTypeFormData {
  id?: number;
  name: string;
  code: string;
}

/**
 * API functions for Shipping Types
 */
const getShippingTypes = async (): Promise<ShippingType[]> => {
  return fakeShippingTypes.getAll();
};

const createShippingType = async (
  data: Omit<ShippingType, 'id'>
): Promise<ShippingType> => {
  return fakeShippingTypes.create({
    ...data,
    code: data.code.toUpperCase()
  });
};

const updateShippingType = async (
  id: number,
  data: Partial<ShippingType>
): Promise<ShippingType> => {
  const updateData = { ...data };

  return fakeShippingTypes.update(id, updateData);
};

const deleteShippingType = async (id: number): Promise<void> => {
  return fakeShippingTypes.delete(id);
};

/**
 * Shipping Services configuration page component
 */
export default function ShippingTypePage() {
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState<ShippingTypeFormData>({
    name: '',
    code: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch shipping services data
  const { data: typesData, isPending } = useQuery({
    queryKey: ['shippingTypes'],
    queryFn: getShippingTypes
  });

  // Mutation for creating a new shipping service
  const createMutation = useMutation({
    mutationFn: createShippingType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shippingTypes'] });
      toast.success('Shipping type created successfully');
      closeDrawer();
    },
    onError: (error) => {
      toast.error(`Failed to create shipping type: ${error.message}`);
    }
  });

  // Mutation for updating a shipping service
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ShippingType> }) =>
      updateShippingType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shippingTypes'] });
      toast.success('Shipping type updated successfully');
      closeDrawer();
    },
    onError: (error) => {
      toast.error(`Failed to update shipping type: ${error.message}`);
    }
  });

  // Mutation for deleting a shipping service
  const deleteMutation = useMutation({
    mutationFn: deleteShippingType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shippingTypes'] });
      toast.success('Shipping type deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete shipping type: ${error.message}`);
    }
  });

  /**
   * Close the drawer and reset form data
   */
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setFormData({
      name: '',
      code: ''
    });
    setIsEditing(false);
  };

  /**
   * Handle adding a new shipping service
   */
  const handleAdd = () => {
    setIsEditing(false);
    setFormData({
      name: '',
      code: ''
    });
    setIsDrawerOpen(true);
  };

  /**
   * Handle editing an existing shipping service
   * @param service Shipping service to edit
   */
  const handleEdit = (service: ShippingType) => {
    setIsEditing(true);
    setFormData({
      id: service.id,
      name: service.name,
      code: service.code
    });
    setIsDrawerOpen(true);
  };

  /**
   * Handle deleting a shipping service
   * @param service Shipping service to delete
   */
  const handleDelete = (service: ShippingType) => {
    if (window.confirm('Are you sure you want to delete this shipping type?')) {
      deleteMutation.mutate(service.id);
    }
  };

  /**
   * Handle form submission
   * @param e Form event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Service name is required');
      return;
    }

    if (!formData.code.trim()) {
      toast.error('Code is required');
      return;
    }

    if (isEditing && formData.id) {
      updateMutation.mutate({
        id: formData.id,
        data: {
          name: formData.name,
          code: formData.code
        }
      });
    } else {
      createMutation.mutate({
        name: formData.name,
        code: formData.code
      });
    }
  };

  /**
   * Handle input change in the form
   * @param e Input change event
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Define columns for the data table
  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (type: ShippingType) => <span>{type.id}</span>
    },
    {
      key: 'name',
      header: 'Name',
      render: (type: ShippingType) => <span>{type.name}</span>
    },
    {
      key: 'code',
      header: 'Code',
      render: (type: ShippingType) => <span>{type.code}</span>
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (type: ShippingType) => (
        <div className='flex space-x-2'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => handleEdit(type)}
          >
            <PencilIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            onClick={() => handleDelete(type)}
          >
            <TrashIcon className='h-4 w-4' />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className='container mx-auto py-6'>
      <div className='mb-8'>
        <h1 className='mb-2 text-3xl font-bold'>Shipping Types</h1>
        <p className='text-muted-foreground'>Manage shipping types</p>
      </div>

      <DataTable
        columns={columns}
        data={typesData || []}
        onAdd={handleAdd}
        isLoading={isPending}
      />

      <DataDrawer
        title={isEditing ? 'Edit Shipping Type' : 'Add Shipping Type'}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
      >
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Name</Label>
            <Input
              id='name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              placeholder='e.g., Standard, Express, Same-Day'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='code'>Code</Label>
            <Input
              id='code'
              name='code'
              value={formData.code}
              onChange={handleInputChange}
              placeholder='e.g., STD, EXP, SAD'
            />
          </div>

          <div className='flex justify-end space-x-2'>
            <Button type='button' variant='outline' onClick={closeDrawer}>
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Saving...'
                : 'Save'}
            </Button>
          </div>
        </form>
      </DataDrawer>
    </div>
  );
}
