/**
 * Commodity Types Configuration Page
 * Manages the commodity types used in the shipping system
 */
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCommodityTypes,
  createCommodityType,
  updateCommodityType,
  deleteCommodityType
} from '@/lib/api/system-configuration-api';
import {
  DataTable,
  DataDrawer
} from '@/components/system-configuration/data-table';
import { CommodityType } from '@/types/system-configuration';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { PencilIcon, TrashIcon } from 'lucide-react';

/**
 * Form data structure for commodity type form
 */
interface CommodityTypeFormData {
  id?: number;
  code: string;
  name: string;
}

// API functions are imported from system-configuration-api.ts

/**
 * Commodity Types configuration page component
 */
export default function CommodityTypesPage() {
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState<CommodityTypeFormData>({
    code: '',
    name: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch commodity types data
  const { data: commodityTypes, isPending } = useQuery<CommodityType[]>({
    queryKey: ['commodity-types'],
    queryFn: getCommodityTypes
  });

  // Mutation for creating a new commodity type
  const createMutation = useMutation({
    mutationFn: createCommodityType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commodity-types'] });
      toast.success('Commodity type created successfully');
      closeDrawer();
    },
    onError: (error: Error) => {
      toast.error(`Failed to create commodity type: ${error.message}`);
    }
  });

  // Mutation for updating a commodity type
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CommodityType> }) =>
      updateCommodityType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commodity-types'] });
      toast.success('Commodity type updated successfully');
      closeDrawer();
    },
    onError: (error: Error) => {
      toast.error(`Failed to update commodity type: ${error.message}`);
    }
  });

  // Mutation for deleting a commodity type
  const deleteMutation = useMutation({
    mutationFn: deleteCommodityType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commodity-types'] });
      toast.success('Commodity type deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete commodity type: ${error.message}`);
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
   * Opens the drawer for adding a new commodity type
   */
  const handleAdd = () => {
    setFormData({ code: '', name: '' });
    setIsEditing(false);
    setIsDrawerOpen(true);
  };

  /**
   * Opens the drawer for editing an existing commodity type
   */
  const handleEdit = (commodityType: CommodityType) => {
    setFormData({
      id: commodityType.id,
      code: commodityType.code,
      name: commodityType.name
    });
    setIsEditing(true);
    setIsDrawerOpen(true);
  };

  /**
   * Handles commodity type deletion
   */
  const handleDelete = (commodityType: CommodityType) => {
    if (
      window.confirm(`Are you sure you want to delete ${commodityType.name}?`)
    ) {
      deleteMutation.mutate(commodityType.id);
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
      render: (commodityType: CommodityType) => (
        <div className='flex space-x-2'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => handleEdit(commodityType)}
          >
            <PencilIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            onClick={() => handleDelete(commodityType)}
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
        <h1 className='text-2xl font-bold'>Commodity Types</h1>
        <p className='text-muted-foreground'>
          Manage commodity types that are used in shipping orders
        </p>
      </div>

      <DataTable
        data={commodityTypes || []}
        columns={columns}
        onAdd={handleAdd}
        isLoading={isPending}
      />

      <DataDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        title={isEditing ? 'Edit Commodity Type' : 'Add New Commodity Type'}
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
              placeholder='e.g. ELEC, FASH'
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
              placeholder='e.g. Electronics, Fashion'
              required
            />
          </div>

          <div className='flex justify-end space-x-2 pt-4'>
            <Button type='button' variant='outline' onClick={closeDrawer}>
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Saving...'
                : isEditing
                  ? 'Update'
                  : 'Create'}
            </Button>
          </div>
        </form>
      </DataDrawer>
    </div>
  );
}
