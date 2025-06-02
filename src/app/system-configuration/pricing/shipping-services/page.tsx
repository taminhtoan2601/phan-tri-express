/**
 * Shipping Services Configuration Page
 * Manages shipping service levels and their configurations
 */
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DataTable,
  DataDrawer
} from '@/components/system-configuration/data-table';
import { ShippingService } from '@/types/system-configuration';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { fakeShippingServices } from '@/constants/mock-system-config';
import { PencilIcon, TrashIcon } from 'lucide-react';

/**
 * Form data structure for shipping service form
 */
interface ShippingServiceFormData {
  id?: number;
  name: string;
  multiplier: string;
  transitTimeDays: string;
}

/**
 * API functions for Shipping Services
 */
const getShippingServices = async (): Promise<ShippingService[]> => {
  return fakeShippingServices.getAll();
};

const createShippingService = async (
  data: Omit<ShippingService, 'id'>
): Promise<ShippingService> => {
  return fakeShippingServices.create({
    ...data,
    multiplier: Number(data.multiplier),
    transitTimeDays: Number(data.transitTimeDays)
  });
};

const updateShippingService = async (
  id: number,
  data: Partial<ShippingService>
): Promise<ShippingService> => {
  const updateData = { ...data };

  if (typeof data.multiplier === 'string') {
    updateData.multiplier = Number(data.multiplier);
  }

  if (typeof data.transitTimeDays === 'string') {
    updateData.transitTimeDays = Number(data.transitTimeDays);
  }

  return fakeShippingServices.update(id, updateData);
};

const deleteShippingService = async (id: number): Promise<void> => {
  return fakeShippingServices.delete(id);
};

/**
 * Shipping Services configuration page component
 */
export default function ShippingServicesPage() {
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState<ShippingServiceFormData>({
    name: '',
    multiplier: '1.0',
    transitTimeDays: '1'
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch shipping services data
  const { data: servicesData, isPending } = useQuery({
    queryKey: ['shippingServices'],
    queryFn: getShippingServices
  });

  // Mutation for creating a new shipping service
  const createMutation = useMutation({
    mutationFn: createShippingService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shippingServices'] });
      toast.success('Shipping service created successfully');
      closeDrawer();
    },
    onError: (error) => {
      toast.error(`Failed to create shipping service: ${error.message}`);
    }
  });

  // Mutation for updating a shipping service
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data
    }: {
      id: number;
      data: Partial<ShippingService>;
    }) => updateShippingService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shippingServices'] });
      toast.success('Shipping service updated successfully');
      closeDrawer();
    },
    onError: (error) => {
      toast.error(`Failed to update shipping service: ${error.message}`);
    }
  });

  // Mutation for deleting a shipping service
  const deleteMutation = useMutation({
    mutationFn: deleteShippingService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shippingServices'] });
      toast.success('Shipping service deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete shipping service: ${error.message}`);
    }
  });

  /**
   * Close the drawer and reset form data
   */
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setFormData({
      name: '',
      multiplier: '1.0',
      transitTimeDays: '1'
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
      multiplier: '1.0',
      transitTimeDays: '1'
    });
    setIsDrawerOpen(true);
  };

  /**
   * Handle editing an existing shipping service
   * @param service Shipping service to edit
   */
  const handleEdit = (service: ShippingService) => {
    setIsEditing(true);
    setFormData({
      id: service.id,
      name: service.name,
      multiplier: service.multiplier.toString(),
      transitTimeDays: service.transitTimeDays.toString()
    });
    setIsDrawerOpen(true);
  };

  /**
   * Handle deleting a shipping service
   * @param service Shipping service to delete
   */
  const handleDelete = (service: ShippingService) => {
    if (
      window.confirm('Are you sure you want to delete this shipping service?')
    ) {
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

    if (
      isNaN(Number(formData.multiplier)) ||
      Number(formData.multiplier) <= 0
    ) {
      toast.error('Multiplier must be a positive number');
      return;
    }

    if (
      isNaN(Number(formData.transitTimeDays)) ||
      Number(formData.transitTimeDays) < 0
    ) {
      toast.error('Transit time must be a non-negative number');
      return;
    }

    if (isEditing && formData.id) {
      updateMutation.mutate({
        id: formData.id,
        data: {
          name: formData.name,
          multiplier: Number(formData.multiplier),
          transitTimeDays: Number(formData.transitTimeDays)
        }
      });
    } else {
      createMutation.mutate({
        name: formData.name,
        multiplier: Number(formData.multiplier),
        transitTimeDays: Number(formData.transitTimeDays)
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
      render: (service: ShippingService) => <span>{service.id}</span>
    },
    {
      key: 'name',
      header: 'Name',
      render: (service: ShippingService) => <span>{service.name}</span>
    },
    {
      key: 'multiplier',
      header: 'Price Multiplier',
      render: (service: ShippingService) => (
        <span>×{service.multiplier.toFixed(2)}</span>
      )
    },
    {
      key: 'transitTimeDays',
      header: 'Transit Time (Days)',
      render: (service: ShippingService) => (
        <span>
          {service.transitTimeDays === 0
            ? 'Same day'
            : `${service.transitTimeDays} day${service.transitTimeDays > 1 ? 's' : ''}`}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (service: ShippingService) => (
        <div className='flex space-x-2'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => handleEdit(service)}
          >
            <PencilIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            onClick={() => handleDelete(service)}
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
        <h1 className='mb-2 text-3xl font-bold'>Shipping Services</h1>
        <p className='text-muted-foreground'>
          Manage shipping service levels and their multipliers
        </p>
      </div>

      <DataTable
        columns={columns}
        data={servicesData || []}
        onAdd={handleAdd}
        isLoading={isPending}
      />

      <DataDrawer
        title={isEditing ? 'Edit Shipping Service' : 'Add Shipping Service'}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
      >
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Service Name</Label>
            <Input
              id='name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              placeholder='e.g., Standard, Express, Same-Day'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='multiplier'>Price Multiplier</Label>
            <Input
              id='multiplier'
              name='multiplier'
              type='number'
              value={formData.multiplier}
              onChange={handleInputChange}
              placeholder='Price multiplier (e.g., 1.0, 1.5, 2.0)'
              min='0.1'
              step='0.1'
            />
            <p className='text-muted-foreground text-sm'>
              Base price will be multiplied by this value (e.g., 1.5 = 50% more
              expensive)
            </p>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='transitTimeDays'>Transit Time (Days)</Label>
            <Input
              id='transitTimeDays'
              name='transitTimeDays'
              type='number'
              value={formData.transitTimeDays}
              onChange={handleInputChange}
              placeholder='Expected transit time in days'
              min='0'
            />
            <p className='text-muted-foreground text-sm'>
              Use 0 for same-day delivery
            </p>
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
