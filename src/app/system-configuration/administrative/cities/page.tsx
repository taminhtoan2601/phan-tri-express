/**
 * Cities Configuration Page
 * Manages cities used in the system
 */
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DataTable,
  DataDrawer
} from '@/components/system-configuration/data-table';
import { City, Country } from '@/types/system-configuration';
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
import { fakeCities, fakeCountries } from '@/constants/mock-system-config';
import { PencilIcon, TrashIcon } from 'lucide-react';

/**
 * Form data structure for city form
 */
interface CityFormData {
  id?: number;
  code: string;
  name: string;
  countryId: string;
}

/**
 * API functions for Cities
 */
const getCities = async (): Promise<City[]> => {
  return fakeCities.getAll();
};

const getCountries = async (): Promise<Country[]> => {
  return fakeCountries.getAll();
};

const createCity = async (data: Omit<City, 'id'>): Promise<City> => {
  return fakeCities.create({
    ...data,
    countryId: Number(data.countryId)
  });
};

const updateCity = async (id: number, data: Partial<City>): Promise<City> => {
  const updateData = {
    ...data
  };

  if (typeof data.countryId === 'string') {
    updateData.countryId = Number(data.countryId);
  }

  return fakeCities.update(id, updateData);
};

const deleteCity = async (id: number): Promise<void> => {
  return fakeCities.delete(id);
};

/**
 * Cities configuration page component
 */
export default function CitiesPage() {
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState<CityFormData>({
    code: '',
    name: '',
    countryId: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch cities data
  const { data: citiesData, isPending: isPendingCities } = useQuery({
    queryKey: ['cities'],
    queryFn: getCities
  });

  // Fetch countries data for selection
  const { data: countriesData, isPending: isPendingCountries } = useQuery({
    queryKey: ['countries'],
    queryFn: getCountries
  });

  // Mutation for creating a new city
  const createMutation = useMutation({
    mutationFn: createCity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities'] });
      toast.success('City created successfully');
      closeDrawer();
    },
    onError: (error) => {
      toast.error(`Failed to create city: ${error.message}`);
    }
  });

  // Mutation for updating a city
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<City> }) =>
      updateCity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities'] });
      toast.success('City updated successfully');
      closeDrawer();
    },
    onError: (error) => {
      toast.error(`Failed to update city: ${error.message}`);
    }
  });

  // Mutation for deleting a city
  const deleteMutation = useMutation({
    mutationFn: deleteCity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities'] });
      toast.success('City deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete city: ${error.message}`);
    }
  });

  /**
   * Close the drawer and reset form data
   */
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setFormData({ code: '', name: '', countryId: '' });
    setIsEditing(false);
  };

  /**
   * Handle adding a new city
   */
  const handleAdd = () => {
    setIsEditing(false);
    setFormData({ code: '', name: '', countryId: '' });
    setIsDrawerOpen(true);
  };

  /**
   * Handle editing an existing city
   * @param city City to edit
   */
  const handleEdit = (city: City) => {
    setIsEditing(true);
    setFormData({
      id: city.id,
      code: city.code,
      name: city.name,
      countryId: city.countryId.toString()
    });
    setIsDrawerOpen(true);
  };

  /**
   * Handle deleting a city
   * @param city City to delete
   */
  const handleDelete = (city: City) => {
    if (window.confirm('Are you sure you want to delete this city?')) {
      deleteMutation.mutate(city.id);
    }
  };

  /**
   * Handle form submission
   * @param e Form event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('City name is required');
      return;
    }

    if (!formData.code.trim()) {
      toast.error('City code is required');
      return;
    }

    if (!formData.countryId) {
      toast.error('Country is required');
      return;
    }

    if (isEditing && formData.id) {
      updateMutation.mutate({
        id: formData.id,
        data: {
          code: formData.code,
          name: formData.name,
          countryId: Number(formData.countryId)
        }
      });
    } else {
      createMutation.mutate({
        code: formData.code,
        name: formData.name,
        countryId: Number(formData.countryId)
      });
    }
  };

  /**
   * Handle input change in the form
   * @param e Input change event
   */
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      render: (city: City) => <span>{city.id}</span>
    },
    {
      key: 'code',
      header: 'Code',
      render: (city: City) => <span>{city.code}</span>
    },
    {
      key: 'name',
      header: 'Name',
      render: (city: City) => <span>{city.name}</span>
    },
    {
      key: 'country',
      header: 'Country',
      render: (city: City) => <span>{getCountryName(city.countryId)}</span>
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (city: City) => (
        <div className='flex space-x-2'>
          <Button variant='outline' size='sm' onClick={() => handleEdit(city)}>
            <PencilIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='destructive'
            size='sm'
            onClick={() => handleDelete(city)}
          >
            <TrashIcon className='h-4 w-4' />
          </Button>
        </div>
      )
    }
  ];

  const isPending = isPendingCities || isPendingCountries;

  return (
    <div className='container mx-auto py-6'>
      <div className='mb-8'>
        <h1 className='mb-2 text-3xl font-bold'>Cities</h1>
        <p className='text-muted-foreground'>
          Manage cities for shipping routes and locations
        </p>
      </div>

      <DataTable
        columns={columns}
        data={citiesData || []}
        onAdd={handleAdd}
        isLoading={isPending}
      />

      <DataDrawer
        title={isEditing ? 'Edit City' : 'Add City'}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
      >
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='code'>City Code</Label>
            <Input
              id='code'
              name='code'
              value={formData.code}
              onChange={handleFormChange}
              placeholder='e.g., SGN, NYC, LON'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='name'>City Name</Label>
            <Input
              id='name'
              name='name'
              value={formData.name}
              onChange={handleFormChange}
              placeholder='e.g., Ho Chi Minh City, New York, London'
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
