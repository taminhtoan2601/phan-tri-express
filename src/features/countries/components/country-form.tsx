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
import { fakeCountries, fakeZones } from '@/constants/mock-system-config';
import { CONTINENT_OPTIONS } from './columns';

interface CountryFormProps {
  initialData?: Country;
  onClose: () => void;
}

/**
 * Form component for adding and editing countries
 */
export function CountryForm({ initialData, onClose }: CountryFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!initialData;

  // State for form data
  const [formData, setFormData] = useState<{
    id?: number;
    code2: string;
    code3: string;
    name: string;
    continent: string;
    zoneId: string;
  }>({
    id: initialData?.id,
    code2: initialData?.code2 || '',
    code3: initialData?.code3 || '',
    name: initialData?.name || '',
    continent: initialData?.continent || '',
    zoneId: initialData?.zoneId.toString() || ''
  });

  // Fetch zones data for selection
  const { data: zonesData, isLoading: isLoadingZones } = useQuery({
    queryKey: ['zones'],
    queryFn: () => fakeZones.getAll()
  });

  // Mutation for creating a new country
  const createMutation = useMutation({
    mutationFn: (data: Omit<Country, 'id'>) => {
      return fakeCountries.create({
        ...data,
        zoneId: Number(data.zoneId)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
      toast.success('Country created successfully');
      onClose();
    },
    onError: (error) => {
      toast.error(
        `Failed to create country: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  });

  // Mutation for updating a country
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Country> }) => {
      const updateData = { ...data };
      if (typeof data.zoneId === 'string') {
        updateData.zoneId = Number(data.zoneId);
      }
      return fakeCountries.update(id, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
      toast.success('Country updated successfully');
      onClose();
    },
    onError: (error) => {
      toast.error(
        `Failed to update country: ${error instanceof Error ? error.message : 'Unknown error'}`
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

    // Submit form data
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

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='space-y-2'>
        <Label htmlFor='zoneId'>Zone</Label>
        <Select
          value={formData.zoneId}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, zoneId: value }))
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
            {CONTINENT_OPTIONS.map((continent) => (
              <SelectItem key={continent.value} value={continent.value}>
                {continent.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='code2'>ISO Code (2-letter)</Label>
        <Input
          id='code2'
          name='code2'
          value={formData.code2}
          onChange={handleInputChange}
          placeholder='e.g., US, UK, VN'
          maxLength={2}
          className='uppercase'
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
          className='uppercase'
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
