/**
 * Branches Configuration Page
 * Manages branch offices and locations
 */
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DataTable,
  DataDrawer
} from '@/components/system-configuration/data-table';
import { Branch, Country } from '@/types/system-configuration';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import { fakeBranches, fakeCountries } from '@/constants/mock-system-config';
import { PencilIcon, TrashIcon } from 'lucide-react';

/**
 * Form data structure for branch form
 */
interface BranchFormData {
  id?: number;
  code: string;
  name: string;
  discount: string;
  address: string;
  phone: string;
  countryId: string;
}

/**
 * API functions for Branches
 */
const getBranches = async (): Promise<Branch[]> => {
  return fakeBranches.getAll();
};

const getCountries = async (): Promise<Country[]> => {
  return fakeCountries.getAll();
};

const createBranch = async (data: Omit<Branch, 'id'>): Promise<Branch> => {
  return fakeBranches.create({
    ...data,
    discount: Number(data.discount),
    countryId: Number(data.countryId)
  });
};

const updateBranch = async (
  id: number,
  data: Partial<Branch>
): Promise<Branch> => {
  const updateData = { ...data };

  if (typeof data.discount === 'string') {
    updateData.discount = Number(data.discount);
  }

  if (typeof data.countryId === 'string') {
    updateData.countryId = Number(data.countryId);
  }

  return fakeBranches.update(id, updateData);
};

const deleteBranch = async (id: number): Promise<void> => {
  return fakeBranches.delete(id);
};

/**
 * Branches configuration page component
 */
export default function BranchesPage() {
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState<BranchFormData>({
    code: '',
    name: '',
    discount: '0',
    address: '',
    phone: '',
    countryId: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch branches data
  const { data: branchesData, isPending: isPendingBranches } = useQuery({
    queryKey: ['branches'],
    queryFn: getBranches
  });

  // Fetch countries data for selection
  const { data: countriesData, isPending: isPendingCountries } = useQuery({
    queryKey: ['countries'],
    queryFn: getCountries
  });

  // Mutation for creating a new branch
  const createMutation = useMutation({
    mutationFn: createBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast.success('Branch created successfully');
      closeDrawer();
    },
    onError: (error) => {
      toast.error(`Failed to create branch: ${error.message}`);
    }
  });

  // Mutation for updating a branch
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Branch> }) =>
      updateBranch(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast.success('Branch updated successfully');
      closeDrawer();
    },
    onError: (error) => {
      toast.error(`Failed to update branch: ${error.message}`);
    }
  });

  // Mutation for deleting a branch
  const deleteMutation = useMutation({
    mutationFn: deleteBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast.success('Branch deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete branch: ${error.message}`);
    }
  });

  /**
   * Close the drawer and reset form data
   */
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setFormData({
      code: '',
      name: '',
      discount: '0',
      address: '',
      phone: '',
      countryId: ''
    });
    setIsEditing(false);
  };

  /**
   * Handle adding a new branch
   */
  const handleAdd = () => {
    setIsEditing(false);
    setFormData({
      code: '',
      name: '',
      discount: '0',
      address: '',
      phone: '',
      countryId: ''
    });
    setIsDrawerOpen(true);
  };

  /**
   * Handle editing an existing branch
   * @param branch Branch to edit
   */
  const handleEdit = (branch: Branch) => {
    setIsEditing(true);
    setFormData({
      id: branch.id,
      code: branch.code,
      name: branch.name,
      discount: branch.discount.toString(),
      address: branch.address,
      phone: branch.phone,
      countryId: branch.countryId.toString()
    });
    setIsDrawerOpen(true);
  };

  /**
   * Handle deleting a branch
   * @param branch Branch to delete
   */
  const handleDelete = (branch: Branch) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      deleteMutation.mutate(branch.id);
    }
  };

  /**
   * Handle form submission
   * @param e Form event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Branch name is required');
      return;
    }

    if (!formData.code.trim()) {
      toast.error('Branch code is required');
      return;
    }

    if (!formData.countryId) {
      toast.error('Country is required');
      return;
    }

    if (isNaN(Number(formData.discount))) {
      toast.error('Discount must be a number');
      return;
    }

    if (isEditing && formData.id) {
      updateMutation.mutate({
        id: formData.id,
        data: {
          code: formData.code,
          name: formData.name,
          discount: Number(formData.discount),
          address: formData.address,
          phone: formData.phone,
          countryId: Number(formData.countryId)
        }
      });
    } else {
      createMutation.mutate({
        code: formData.code,
        name: formData.name,
        discount: Number(formData.discount),
        address: formData.address,
        phone: formData.phone,
        countryId: Number(formData.countryId)
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

  // Helper function to get country name
  const getCountryName = (countryId: number) => {
    if (!countriesData || countriesData.length === 0) return 'Unknown';
    const country = countriesData.find((c: Country) => c.id === countryId);
    return country ? country.name : 'Unknown';
  };

  // Define columns for the data table
  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (branch: Branch) => <span>{branch.id}</span>
    },
    {
      key: 'code',
      header: 'Code',
      render: (branch: Branch) => <span>{branch.code}</span>
    },
    {
      key: 'name',
      header: 'Name',
      render: (branch: Branch) => <span>{branch.name}</span>
    },
    {
      key: 'country',
      header: 'Country',
      render: (branch: Branch) => (
        <span>{getCountryName(branch.countryId)}</span>
      )
    },
    {
      key: 'address',
      header: 'Address',
      render: (branch: Branch) => <span>{branch.address}</span>
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (branch: Branch) => <span>{branch.phone}</span>
    },
    {
      key: 'discount',
      header: 'Discount (%)',
      render: (branch: Branch) => <span>{branch.discount}%</span>
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (branch: Branch) => (
        <div className='flex space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handleEdit(branch)}
          >
            <PencilIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='destructive'
            size='sm'
            onClick={() => handleDelete(branch)}
          >
            <TrashIcon className='h-4 w-4' />
          </Button>
        </div>
      )
    }
  ];

  const isPending = isPendingBranches || isPendingCountries;

  return (
    <div className='container mx-auto py-6'>
      <div className='mb-8'>
        <h1 className='mb-2 text-3xl font-bold'>Branches</h1>
        <p className='text-muted-foreground'>
          Manage branch offices and locations
        </p>
      </div>

      <DataTable
        columns={columns}
        data={branchesData || []}
        onAdd={handleAdd}
        isLoading={isPending}
      />

      <DataDrawer
        title={isEditing ? 'Edit Branch' : 'Add Branch'}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
      >
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='code'>Branch Code</Label>
            <Input
              id='code'
              name='code'
              value={formData.code}
              onChange={handleInputChange}
              placeholder='e.g., HCM, SGN, NYC'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='name'>Branch Name</Label>
            <Input
              id='name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              placeholder='e.g., Ho Chi Minh Branch, New York Office'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='countryId'>Country</Label>
            <Select
              value={formData.countryId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, countryId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select a country' />
              </SelectTrigger>
              <SelectContent>
                {countriesData && countriesData.length > 0 ? (
                  countriesData.map((country: Country) => (
                    <SelectItem key={country.id} value={country.id.toString()}>
                      {country.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value='no_country' disabled>
                    No countries available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='address'>Address</Label>
            <Input
              id='address'
              name='address'
              value={formData.address}
              onChange={handleInputChange}
              placeholder='Full address'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='phone'>Phone</Label>
            <Input
              id='phone'
              name='phone'
              value={formData.phone}
              onChange={handleInputChange}
              placeholder='Contact phone number'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='discount'>Discount (%)</Label>
            <Input
              id='discount'
              name='discount'
              type='number'
              value={formData.discount}
              onChange={handleInputChange}
              placeholder='Discount percentage'
              min='0'
              max='100'
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
