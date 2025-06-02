/**
 * Carriers Configuration Page
 * Manages the shipping carriers used in the system
 */
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCarriers,
  createCarrier,
  updateCarrier,
  deleteCarrier
} from '@/lib/api/system-configuration-api';
import {
  DataTable,
  DataDrawer
} from '@/components/system-configuration/data-table';
import { Carrier } from '@/types/system-configuration';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { PencilIcon, TrashIcon } from 'lucide-react';

/**
 * Form data structure for carrier form
 */
interface CarrierFormData {
  id?: number;
  name: string;
  routeIds: number[];
}

// API functions are imported from system-configuration-api.ts

/**
 * Carriers configuration page component
 */
export default function CarriersPage() {
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState<CarrierFormData>({
    name: '',
    routeIds: []
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch carriers data
  const { data: carriers, isPending } = useQuery<Carrier[]>({
    queryKey: ['carriers'],
    queryFn: getCarriers
  });

  // Mutation for creating a new carrier
  const createMutation = useMutation({
    mutationFn: createCarrier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carriers'] });
      toast.success('Carrier created successfully');
      closeDrawer();
    },
    onError: (error: Error) => {
      toast.error(`Failed to create carrier: ${error.message}`);
    }
  });

  // Mutation for updating a carrier
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Carrier> }) =>
      updateCarrier(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carriers'] });
      toast.success('Carrier updated successfully');
      closeDrawer();
    },
    onError: (error: Error) => {
      toast.error(`Failed to update carrier: ${error.message}`);
    }
  });

  // Mutation for deleting a carrier
  const deleteMutation = useMutation({
    mutationFn: deleteCarrier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carriers'] });
      toast.success('Carrier deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete carrier: ${error.message}`);
    }
  });

  /**
   * Handles form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.routeIds ||
      formData.routeIds.length === 0
    ) {
      toast.error('Please fill all required fields');
      return;
    }

    if (isEditing && formData.id) {
      updateMutation.mutate({
        id: formData.id,
        data: {
          name: formData.name,
          routeIds: formData.routeIds
        }
      });
    } else {
      createMutation.mutate(formData as Omit<Carrier, 'id'>);
    }
  };

  /**
   * Opens the drawer for adding a new carrier
   */
  const handleAdd = () => {
    setFormData({
      name: '',
      routeIds: []
    });
    setIsEditing(false);
    setIsDrawerOpen(true);
  };

  /**
   * Opens the drawer for editing an existing carrier
   */
  const handleEdit = (carrier: Carrier) => {
    setFormData({
      id: carrier.id,
      name: carrier.name,
      routeIds: carrier.routeIds
    });
    setIsEditing(true);
    setIsDrawerOpen(true);
  };

  /**
   * Handles carrier deletion
   */
  const handleDelete = (carrier: Carrier) => {
    if (window.confirm(`Are you sure you want to delete ${carrier.name}?`)) {
      deleteMutation.mutate(carrier.id);
    }
  };

  /**
   * Closes the drawer and resets form
   */
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setFormData({
      name: '',
      routeIds: []
    });
  };

  // Column configuration for the data table
  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    {
      key: 'routeCount',
      header: 'Route Count',
      cell: (carrier: Carrier) => carrier.routeIds.length
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (carrier: Carrier) => (
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => handleEdit(carrier)}
          >
            <PencilIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            onClick={() => handleDelete(carrier)}
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
        <h1 className='text-2xl font-bold'>Carriers</h1>
        <p className='text-muted-foreground'>
          Manage shipping carriers and their contact information
        </p>
      </div>

      <DataTable
        data={carriers || []}
        columns={columns}
        onAdd={handleAdd}
        isLoading={isPending}
      />

      <DataDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        title={isEditing ? 'Edit Carrier' : 'Add New Carrier'}
      >
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Carrier Name</Label>
            <Input
              id='name'
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder='e.g. DHL Express, FedEx'
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='routeIds'>Routes (Comma separated IDs)</Label>
            <Textarea
              id='routeIds'
              value={formData.routeIds.join(', ')}
              onChange={(e) => {
                const routeIdStr = e.target.value;
                const routeIds = routeIdStr
                  .split(',')
                  .map((id) => parseInt(id.trim()))
                  .filter((id) => !isNaN(id));
                setFormData({ ...formData, routeIds });
              }}
              placeholder='e.g. 1, 2, 3'
              required
            />
            <p className='text-muted-foreground text-sm'>
              Enter route IDs separated by commas
            </p>
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
