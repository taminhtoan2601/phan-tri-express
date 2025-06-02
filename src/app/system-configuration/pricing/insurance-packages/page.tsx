/**
 * Insurance Packages Configuration Page
 * Manages the insurance packages offered for shipping orders
 */
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getInsurancePackages,
  createInsurancePackage,
  updateInsurancePackage,
  deleteInsurancePackage
} from '@/lib/api/system-configuration-api';
import {
  DataTable,
  DataDrawer
} from '@/components/system-configuration/data-table';
import { InsurancePackage } from '@/types/system-configuration';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { toast } from 'sonner';
import { PencilIcon, TrashIcon } from 'lucide-react';

/**
 * Form data structure for insurance package form
 */
interface InsurancePackageFormData {
  id?: number;
  name: string;
  rate: number;
  activeDate: string;
}

// API functions are imported from system-configuration-api.ts

/**
 * Insurance Packages configuration page component
 */
export default function InsurancePackagesPage() {
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState<InsurancePackageFormData>({
    name: '',
    rate: 0,
    activeDate: new Date().toISOString().split('T')[0]
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch insurance packages data
  const { data: insurancePackages, isPending } = useQuery<InsurancePackage[]>({
    queryKey: ['insurance-packages'],
    queryFn: getInsurancePackages
  });

  // Mutation for creating a new insurance package
  const createMutation = useMutation({
    mutationFn: createInsurancePackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insurance-packages'] });
      toast.success('Insurance package created successfully');
      closeDrawer();
    },
    onError: (error: Error) => {
      toast.error(`Failed to create insurance package: ${error.message}`);
    }
  });

  // Mutation for updating an insurance package
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data
    }: {
      id: number;
      data: Partial<InsurancePackage>;
    }) => updateInsurancePackage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insurance-packages'] });
      toast.success('Insurance package updated successfully');
      closeDrawer();
    },
    onError: (error: Error) => {
      toast.error(`Failed to update insurance package: ${error.message}`);
    }
  });

  // Mutation for deleting an insurance package
  const deleteMutation = useMutation({
    mutationFn: deleteInsurancePackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insurance-packages'] });
      toast.success('Insurance package deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete insurance package: ${error.message}`);
    }
  });

  /**
   * Handles form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || formData.rate <= 0 || !formData.activeDate) {
      toast.error('Please fill all required fields');
      return;
    }

    const packageData = {
      ...formData,
      rate: Number(formData.rate)
    };

    if (isEditing && formData.id) {
      updateMutation.mutate({
        id: formData.id,
        data: packageData
      });
    } else {
      createMutation.mutate(packageData as Omit<InsurancePackage, 'id'>);
    }
  };

  /**
   * Opens the drawer for adding a new insurance package
   */
  const handleAdd = () => {
    setFormData({
      name: '',
      rate: 0,
      activeDate: new Date().toISOString().split('T')[0]
    });
    setIsEditing(false);
    setIsDrawerOpen(true);
  };

  /**
   * Opens the drawer for editing an existing insurance package
   */
  const handleEdit = (insurancePackage: InsurancePackage) => {
    setFormData({
      id: insurancePackage.id,
      name: insurancePackage.name,
      rate: insurancePackage.rate,
      activeDate: insurancePackage.activeDate
    });
    setIsEditing(true);
    setIsDrawerOpen(true);
  };

  /**
   * Handles insurance package deletion
   */
  const handleDelete = (insurancePackage: InsurancePackage) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${insurancePackage.name}?`
      )
    ) {
      deleteMutation.mutate(insurancePackage.id);
    }
  };

  /**
   * Closes the drawer and resets form
   */
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setFormData({
      name: '',
      rate: 0,
      activeDate: new Date().toISOString().split('T')[0]
    });
  };

  /**
   * Formats currency values for display
   */
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  /**
   * Formats percentage values for display
   */
  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  // Column configuration for the data table
  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    {
      key: 'rate',
      header: 'Rate',
      cell: (item: InsurancePackage) => formatPercentage(item.rate)
    },
    {
      key: 'activeDate',
      header: 'Active Date'
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (insurancePackage: InsurancePackage) => (
        <div className='flex space-x-2'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => handleEdit(insurancePackage)}
          >
            <PencilIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            onClick={() => handleDelete(insurancePackage)}
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
        <h1 className='text-2xl font-bold'>Insurance Packages</h1>
        <p className='text-muted-foreground'>
          Manage insurance packages offered for shipments
        </p>
      </div>

      <DataTable
        data={insurancePackages || []}
        columns={columns}
        onAdd={handleAdd}
        isLoading={isPending}
      />

      <DataDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        title={
          isEditing ? 'Edit Insurance Package' : 'Add New Insurance Package'
        }
      >
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Package Name</Label>
            <Input
              id='name'
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder='e.g. Basic Coverage, Premium Coverage'
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='rate'>Rate (as decimal, e.g. 0.05 for 5%)</Label>
            <Input
              id='rate'
              type='number'
              step='0.001'
              min='0'
              value={formData.rate}
              onChange={(e) =>
                setFormData({ ...formData, rate: parseFloat(e.target.value) })
              }
              placeholder='e.g. 0.05 for 5%'
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='activeDate'>Active Date</Label>
            <Input
              id='activeDate'
              type='date'
              value={formData.activeDate}
              onChange={(e) =>
                setFormData({ ...formData, activeDate: e.target.value })
              }
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
