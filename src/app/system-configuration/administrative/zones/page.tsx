/**
 * Zones Configuration Page
 * Manages shipping zones used in the pricing system
 */
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DataTable,
  DataDrawer
} from '@/components/system-configuration/data-table';
import { Zone } from '@/types/system-configuration';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { fakeZones } from '@/constants/mock-system-config';
import { PencilIcon, TrashIcon } from 'lucide-react';

/**
 * Form data structure for zone form
 */
interface ZoneFormData {
  id?: number;
  name: string;
}

/**
 * API functions for Zones
 */
const getZones = async (): Promise<Zone[]> => {
  return fakeZones.getAll();
};

const createZone = async (data: Omit<Zone, 'id'>): Promise<Zone> => {
  return fakeZones.create(data);
};

const updateZone = async (id: number, data: Partial<Zone>): Promise<Zone> => {
  return fakeZones.update(id, data);
};

const deleteZone = async (id: number): Promise<void> => {
  return fakeZones.delete(id);
};

/**
 * Zones configuration page component
 */
export default function ZonesPage() {
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState<ZoneFormData>({
    name: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch zones data
  const { data: zonesData, isPending } = useQuery({
    queryKey: ['zones'],
    queryFn: getZones
  });

  // Mutation for creating a new zone
  const createMutation = useMutation({
    mutationFn: createZone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zones'] });
      toast.success('Zone created successfully');
      closeDrawer();
    },
    onError: (error) => {
      toast.error(`Failed to create zone: ${error.message}`);
    }
  });

  // Mutation for updating a zone
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Zone> }) =>
      updateZone(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zones'] });
      toast.success('Zone updated successfully');
      closeDrawer();
    },
    onError: (error) => {
      toast.error(`Failed to update zone: ${error.message}`);
    }
  });

  // Mutation for deleting a zone
  const deleteMutation = useMutation({
    mutationFn: deleteZone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zones'] });
      toast.success('Zone deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete zone: ${error.message}`);
    }
  });

  /**
   * Close the drawer and reset form data
   */
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setFormData({ name: '' });
    setIsEditing(false);
  };

  /**
   * Handle adding a new zone
   */
  const handleAdd = () => {
    setIsEditing(false);
    setFormData({ name: '' });
    setIsDrawerOpen(true);
  };

  /**
   * Handle editing an existing zone
   * @param zone Zone to edit
   */
  const handleEdit = (zone: Zone) => {
    setIsEditing(true);
    setFormData({
      id: zone.id,
      name: zone.name
    });
    setIsDrawerOpen(true);
  };

  /**
   * Handle deleting a zone
   * @param zone Zone to delete
   */
  const handleDelete = (zone: Zone) => {
    if (window.confirm('Are you sure you want to delete this zone?')) {
      deleteMutation.mutate(zone.id);
    }
  };

  /**
   * Handle form submission
   * @param e Form event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Zone name is required');
      return;
    }

    if (isEditing && formData.id) {
      updateMutation.mutate({
        id: formData.id,
        data: {
          name: formData.name
        }
      });
    } else {
      createMutation.mutate({
        name: formData.name
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
      render: (zone: Zone) => <span>{zone.id}</span>
    },
    {
      key: 'name',
      header: 'Name',
      render: (zone: Zone) => <span>{zone.name}</span>
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (zone: Zone) => (
        <div className='flex space-x-2'>
          <Button variant='outline' size='sm' onClick={() => handleEdit(zone)}>
            <PencilIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='destructive'
            size='sm'
            onClick={() => handleDelete(zone)}
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
        <h1 className='mb-2 text-3xl font-bold'>Shipping Zones</h1>
        <p className='text-muted-foreground'>
          Manage shipping zones for pricing calculations
        </p>
      </div>

      <DataTable
        columns={columns}
        data={zonesData || []}
        onAdd={handleAdd}
        isLoading={isPending}
      />

      <DataDrawer
        title={isEditing ? 'Edit Zone' : 'Add Zone'}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
      >
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Zone Name</Label>
            <Input
              id='name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              placeholder='e.g., Asia, Europe, North America'
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
