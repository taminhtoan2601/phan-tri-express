'use client';

import { useState, useEffect } from 'react';
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
import { Country, Zone } from '@/types/system-configuration';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  fakeCities,
  fakeCountries,
  fakeRoutes,
  fakeZones
} from '@/constants/mock-system-config';
import { Route } from '@/types/system-configuration';

interface RouteFormProps {
  initialData?: Route;
  onClose: () => void;
}

/**
 * Form component for adding and editing routes
 */
export function RouteForm({ initialData, onClose }: RouteFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!initialData;

  // State for form data
  const [formData, setFormData] = useState<{
    id?: number;
    zoneId: number;
    originCountryId: number;
    originCityId: number;
    destinationCountryId: number;
    destinationCityId: number;
    code?: string;
    name?: string;
  }>({
    id: initialData?.id,
    zoneId: initialData?.zoneId || 0,
    originCountryId: initialData?.originCountryId || 0,
    originCityId: initialData?.originCityId || 0,
    destinationCountryId: initialData?.destinationCountryId || 0,
    destinationCityId: initialData?.destinationCityId || 0,
    code: initialData?.code,
    name: initialData?.name
  });

  // Fetch zones data for selection
  const { data: zonesData, isLoading: isLoadingZones } = useQuery({
    queryKey: ['zones'],
    queryFn: () => fakeZones.getAll()
  });

  // Fetch countries data for selection
  const { data: countriesData, isLoading: isLoadingCountries } = useQuery({
    queryKey: ['countries'],
    queryFn: () => fakeCountries.getAll()
  });

  // Fetch cities data for selection
  const { data: citiesData, isLoading: isLoadingCities } = useQuery({
    queryKey: ['cities'],
    queryFn: () => fakeCities.getAll()
  });

  // Mutation for creating a new route
  const createMutation = useMutation({
    mutationFn: (data: Omit<Route, 'id'>) => {
      return fakeRoutes.create({
        ...data,
        zoneId: Number(data.zoneId),
        code: data.code || '',
        name: data.name || '',
        originCountryId: Number(data.originCountryId),
        originCityId: Number(data.originCityId),
        destinationCountryId: Number(data.destinationCountryId),
        destinationCityId: Number(data.destinationCityId)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      toast.success('Route created successfully');
      onClose();
    },
    onError: (error) => {
      toast.error(
        `Failed to create route: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  });

  // Mutation for updating a route
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Route> }) => {
      const updateData = { ...data };
      if (typeof data.zoneId === 'string') {
        updateData.zoneId = Number(data.zoneId);
      }
      if (typeof data.originCountryId === 'string') {
        updateData.originCountryId = Number(data.originCountryId);
      }
      if (typeof data.originCityId === 'string') {
        updateData.originCityId = Number(data.originCityId);
      }
      if (typeof data.destinationCountryId === 'string') {
        updateData.destinationCountryId = Number(data.destinationCountryId);
      }
      if (typeof data.destinationCityId === 'string') {
        updateData.destinationCityId = Number(data.destinationCityId);
      }
      return fakeRoutes.update(id, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      toast.success('Route updated successfully');
      onClose();
    },
    onError: (error) => {
      toast.error(
        `Failed to update route: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  });

  /**
   * Handle form input change
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.zoneId) {
      toast.error('Zone is required');
      return;
    }

    if (!formData.originCountryId) {
      toast.error('Origin country is required');
      return;
    }

    if (!formData.originCityId) {
      toast.error('Origin city is required');
      return;
    }

    if (!formData.destinationCountryId) {
      toast.error('Destination country is required');
      return;
    }

    if (!formData.destinationCityId) {
      toast.error('Destination city is required');
      return;
    }
    if (!formData.code) {
      toast.error('Route code is required');
      return;
    }
    if (!formData.name) {
      toast.error('Route name is required');
      return;
    }

    // Submit form data
    if (isEditing && formData.id) {
      updateMutation.mutate({
        id: formData.id,
        data: {
          zoneId: Number(formData.zoneId),
          originCountryId: Number(formData.originCountryId),
          originCityId: Number(formData.originCityId),
          destinationCountryId: Number(formData.destinationCountryId),
          destinationCityId: Number(formData.destinationCityId),
          code: formData.code || '',
          name: formData.name || ''
        }
      });
    } else {
      createMutation.mutate({
        zoneId: Number(formData.zoneId),
        originCountryId: Number(formData.originCountryId),
        originCityId: Number(formData.originCityId),
        destinationCountryId: Number(formData.destinationCountryId),
        destinationCityId: Number(formData.destinationCityId),
        code: formData.code || '',
        name: formData.name || ''
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='space-y-2'>
        <Label htmlFor='code'>Code</Label>
        <Input
          id='code'
          name='code'
          value={formData.code || ''}
          onChange={handleInputChange}
          disabled={createMutation.isPending || updateMutation.isPending}
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='name'>Name</Label>
        <Input
          id='name'
          name='name'
          value={formData.name || ''}
          onChange={handleInputChange}
          disabled={createMutation.isPending || updateMutation.isPending}
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='zoneId'>Zone</Label>
        <Select
          value={formData.zoneId.toString()}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, zoneId: Number(value) }))
          }
          disabled={isLoadingZones}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select a zone' />
          </SelectTrigger>
          <SelectContent>
            {zonesData?.map((zone) => (
              <SelectItem key={zone.id} value={zone.id.toString()}>
                {zone.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='originCountryId'>Origin Country</Label>
        <Select
          value={formData.originCountryId.toString()}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, originCountryId: Number(value) }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder='Select a country' />
          </SelectTrigger>
          <SelectContent>
            {countriesData?.map((country) => (
              <SelectItem key={country.id} value={country.id.toString()}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='originCityId'>Origin City</Label>
        <Select
          value={formData.originCityId.toString()}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, originCityId: Number(value) }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder='Select a city' />
          </SelectTrigger>
          <SelectContent>
            {citiesData?.map((city) => (
              <SelectItem key={city.id} value={city.id.toString()}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='destinationCountryId'>Destination Country</Label>
        <Select
          value={formData.destinationCountryId.toString()}
          onValueChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              destinationCountryId: Number(value)
            }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder='Select a country' />
          </SelectTrigger>
          <SelectContent>
            {countriesData?.map((country) => (
              <SelectItem key={country.id} value={country.id.toString()}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='destinationCityId'>Destination City</Label>
        <Select
          value={formData.destinationCityId.toString()}
          onValueChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              destinationCityId: Number(value)
            }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder='Select a city' />
          </SelectTrigger>
          <SelectContent>
            {citiesData?.map((city) => (
              <SelectItem key={city.id} value={city.id.toString()}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='flex justify-end space-x-2 pt-4'>
        <Button type='button' variant='outline' onClick={onClose}>
          Cancel
        </Button>
        <Button
          type='submit'
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {isEditing ? 'Update' : 'Create'} Country
        </Button>
      </div>
    </form>
  );
}
