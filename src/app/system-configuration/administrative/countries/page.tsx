/**
 * Countries Configuration Page
 * Manages the countries used in the shipping system
 */
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DataTable,
  DataDrawer
} from '@/components/system-configuration/data-table';
import { Country, Zone } from '@/types/system-configuration';
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
import { fakeCountries, fakeZones } from '@/constants/mock-system-config';
import { PencilIcon, TrashIcon } from 'lucide-react';

/**
 * Form data structure for country form
 */
interface CountryFormData {
  id?: number;
  code2: string;
  code3: string;
  name: string;
  continent: string;
  zoneId: string;
}

/**
 * API functions for Countries
 */
const getCountries = async (): Promise<Country[]> => {
  return fakeCountries.getAll();
};

const getZones = async (): Promise<Zone[]> => {
  return fakeZones.getAll();
};

const createCountry = async (data: Omit<Country, 'id'>): Promise<Country> => {
  return fakeCountries.create({
    ...data,
    zoneId: Number(data.zoneId)
  });
};

const updateCountry = async (
  id: number,
  data: Partial<Country>
): Promise<Country> => {
  const updateData = {
    ...data
  };

  if (typeof data.zoneId === 'string') {
    updateData.zoneId = Number(data.zoneId);
  }

  return fakeCountries.update(id, updateData);
};

const deleteCountry = async (id: number): Promise<void> => {
  return fakeCountries.delete(id);
};

/**
 * Countries configuration page component
 */
export default function CountriesPage() {
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState<CountryFormData>({
    code2: '',
    code3: '',
    name: '',
    continent: '',
    zoneId: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch countries data
  const { data: countriesData, isPending: isPendingCountries } = useQuery({
    queryKey: ['countries'],
    queryFn: getCountries
  });

  // Fetch zones data for selection
  const { data: zonesData, isPending: isPendingZones } = useQuery({
    queryKey: ['zones'],
    queryFn: getZones
  });

  // Mutation for creating a new country
  const createMutation = useMutation({
    mutationFn: createCountry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
      toast.success('Country created successfully');
      closeDrawer();
    },
    onError: (error) => {
      toast.error(`Failed to create country: ${error.message}`);
    }
  });

  // Mutation for updating a country
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Country> }) =>
      updateCountry(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
      toast.success('Country updated successfully');
      closeDrawer();
    },
    onError: (error) => {
      toast.error(`Failed to update country: ${error.message}`);
    }
  });

  // Mutation for deleting a country
  const deleteMutation = useMutation({
    mutationFn: deleteCountry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
      toast.success('Country deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete country: ${error.message}`);
    }
  });

  /**
   * Close the drawer and reset form data
   */
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setFormData({
      code2: '',
      code3: '',
      name: '',
      continent: '',
      zoneId: ''
    });
    setIsEditing(false);
  };

  /**
   * Handle adding a new country
   */
  const handleAdd = () => {
    setIsEditing(false);
    setFormData({
      code2: '',
      code3: '',
      name: '',
      continent: '',
      zoneId: ''
    });
    setIsDrawerOpen(true);
  };

  /**
   * Handle editing an existing country
   * @param country Country to edit
   */
  const handleEdit = (country: Country) => {
    setIsEditing(true);
    setFormData({
      id: country.id,
      code2: country.code2,
      code3: country.code3,
      name: country.name,
      continent: country.continent,
      zoneId: country.zoneId.toString()
    });
    setIsDrawerOpen(true);
  };

  /**
   * Handle deleting a country
   * @param country Country to delete
   */
  const handleDelete = (country: Country) => {
    if (window.confirm('Are you sure you want to delete this country?')) {
      deleteMutation.mutate(country.id);
    }
  };

  /**
   * Handle form submission
   * @param e Form event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Country name is required');
      return;
    }

    if (!formData.code2.trim() || !formData.code3.trim()) {
      toast.error('Country codes are required');
      return;
    }

    if (!formData.continent.trim()) {
      toast.error('Continent is required');
      return;
    }

    if (!formData.zoneId) {
      toast.error('Zone is required');
      return;
    }

    if (isEditing && formData.id) {
      updateMutation.mutate({
        id: formData.id,
        data: {
          code2: formData.code2,
          code3: formData.code3,
          name: formData.name,
          continent: formData.continent,
          zoneId: Number(formData.zoneId)
        }
      });
    } else {
      createMutation.mutate({
        code2: formData.code2,
        code3: formData.code3,
        name: formData.name,
        continent: formData.continent,
        zoneId: Number(formData.zoneId)
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

  // Helper function to get zone name
  const getZoneName = (zoneId: number) => {
    if (!zonesData || zonesData.length === 0) return 'Unknown';
    const zone = zonesData.find((z: Zone) => z.id === zoneId);
    return zone ? zone.name : 'Unknown';
  };

  // Define continents for selection
  const continents = [
    { value: 'Asia', label: 'Asia' },
    { value: 'Europe', label: 'Europe' },
    { value: 'North America', label: 'North America' },
    { value: 'South America', label: 'South America' },
    { value: 'Africa', label: 'Africa' },
    { value: 'Oceania', label: 'Oceania' },
    { value: 'Antarctica', label: 'Antarctica' }
  ];

  // Define columns for the data table
  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (country: Country) => <span>{country.id}</span>
    },
    {
      key: 'code2',
      header: 'ISO Code (2)',
      render: (country: Country) => <span>{country.code2}</span>
    },
    {
      key: 'code3',
      header: 'ISO Code (3)',
      render: (country: Country) => <span>{country.code3}</span>
    },
    {
      key: 'name',
      header: 'Name',
      render: (country: Country) => <span>{country.name}</span>
    },
    {
      key: 'continent',
      header: 'Continent',
      render: (country: Country) => <span>{country.continent}</span>
    },
    {
      key: 'zone',
      header: 'Zone',
      render: (country: Country) => <span>{getZoneName(country.zoneId)}</span>
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (country: Country) => (
        <div className='flex space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handleEdit(country)}
          >
            <PencilIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='destructive'
            size='sm'
            onClick={() => handleDelete(country)}
          >
            <TrashIcon className='h-4 w-4' />
          </Button>
        </div>
      )
    }
  ];

  const isPending = isPendingCountries || isPendingZones;

  return (
    <div className='container mx-auto py-6'>
      <div className='mb-8'>
        <h1 className='mb-2 text-3xl font-bold'>Countries</h1>
        <p className='text-muted-foreground'>
          Manage countries for shipping routes and logistics
        </p>
      </div>

      <DataTable
        columns={columns}
        data={countriesData || []}
        onAdd={handleAdd}
        isLoading={isPending}
      />

      <DataDrawer
        title={isEditing ? 'Edit Country' : 'Add Country'}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
      >
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='code2'>ISO Code (2-letter)</Label>
            <Input
              id='code2'
              name='code2'
              value={formData.code2}
              onChange={handleInputChange}
              placeholder='e.g., US, UK, VN'
              maxLength={2}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='code3'>ISO Code (3-letter)</Label>
            <Input
              id='code3'
              name='code3'
              value={formData.code3}
              onChange={handleInputChange}
              placeholder='e.g., USA, GBR, VNM'
              maxLength={3}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='name'>Country Name</Label>
            <Input
              id='name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              placeholder='e.g., United States, Vietnam'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='continent'>Continent</Label>
            <Select
              value={formData.continent}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, continent: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select a continent' />
              </SelectTrigger>
              <SelectContent>
                {continents.map((continent) => (
                  <SelectItem key={continent.value} value={continent.value}>
                    {continent.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='zoneId'>Shipping Zone</Label>
            <Select
              value={formData.zoneId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, zoneId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select a zone' />
              </SelectTrigger>
              <SelectContent>
                {zonesData && zonesData.length > 0 ? (
                  zonesData.map((zone: Zone) => (
                    <SelectItem key={zone.id} value={zone.id.toString()}>
                      {zone.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value='no_zone' disabled>
                    No zones available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
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
