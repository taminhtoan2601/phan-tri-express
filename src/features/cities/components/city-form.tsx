'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { City, Country } from '@/types/system-configuration';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { fakeCities, fakeCountries } from '@/constants/mock-system-config';
import { useDrawer } from '../context/drawer-context';

/**
 * Form validation schema for cities
 */
const formSchema = z.object({
  code: z.string().min(2, 'Code must be at least 2 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  countryId: z.string().min(1, 'Country is required')
});

/**
 * Type for form input, based on the schema
 */
type CityFormValues = z.infer<typeof formSchema>;

// Helper type for form submission
type CitySubmitData = {
  code: string;
  name: string;
  countryId: number;
};

/**
 * Props for CityForm component
 */
interface CityFormProps {
  initialData?: City;
  onClose?: () => void;
}

/**
 * Form component for adding or editing cities
 */
export function CityForm({ initialData, onClose }: CityFormProps) {
  const queryClient = useQueryClient();
  const { closeDrawer } = useDrawer();

  // Use either passed initialData or city from context
  const city = initialData;

  // Determine if this is an edit or add operation
  const isEditing = !!city;

  // Fetch countries for the dropdown
  const { data: countries, isLoading: isLoadingCountries } = useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      return await fakeCountries.getAll();
    }
  });

  // Initialize form with default values or existing city data
  const form = useForm<CityFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: city?.code || '',
      name: city?.name || '',
      countryId: city?.countryId ? String(city.countryId) : ''
    }
  });

  // Create mutation for adding a new city
  const createMutation = useMutation({
    mutationFn: (data: CitySubmitData) =>
      fakeCities.create({
        code: data.code,
        name: data.name,
        countryId: data.countryId
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities'] });
      toast.success('City created successfully');
      // Use passed onClose prop if available, otherwise use context
      if (onClose) onClose();
      else closeDrawer();
    },
    onError: (error) => {
      toast.error(
        `Failed to create city: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  });

  // Update mutation for editing an existing city
  const updateMutation = useMutation({
    mutationFn: (data: CitySubmitData) =>
      fakeCities.update(city!.id, {
        code: data.code,
        name: data.name,
        countryId: data.countryId
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities'] });
      toast.success('City updated successfully');
      // Use passed onClose prop if available, otherwise use context
      if (onClose) onClose();
      else closeDrawer();
    },
    onError: (error) => {
      toast.error(
        `Failed to update city: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  });

  // Handle form submission
  const onSubmit = (values: CityFormValues) => {
    // Convert form values to proper types
    const submitData: CitySubmitData = {
      code: values.code,
      name: values.name,
      countryId: Number(values.countryId)
    };

    if (city) {
      // Update existing city
      updateMutation.mutate(submitData);
    } else {
      // Create new city
      createMutation.mutate(submitData as unknown as Omit<City, 'id'>);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='countryId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoadingCountries}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a country' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countries?.map((country) => (
                    <SelectItem key={country.id} value={String(country.id)}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='code'
          render={({ field }) => (
            <FormItem>
              <FormLabel>City Code</FormLabel>
              <FormControl>
                <Input placeholder='e.g., SGN, NYC, LON' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>City Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter city name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end space-x-2 pt-4'>
          <Button
            type='button'
            variant='outline'
            onClick={closeDrawer}
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {isEditing ? 'Update' : 'Create'} City
          </Button>
        </div>
      </form>
    </Form>
  );
}
