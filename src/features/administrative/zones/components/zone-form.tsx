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
import { Zone } from '@/types/system-configuration';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { fakeZones } from '@/constants/mock-system-config';
import { useDrawer } from '../context/drawer-context';

/**
 * Form validation schema for zones
 */
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters')
});

/**
 * Type for form input, based on the schema
 */
type ZoneFormValues = z.infer<typeof formSchema>;

/**
 * Form component for adding or editing zones
 */
export function ZoneForm() {
  const queryClient = useQueryClient();
  const { zone, closeDrawer } = useDrawer();

  // Determine if this is an edit or add operation
  const isEditing = !!zone;

  // Initialize form with default values or existing zone data
  const form = useForm<ZoneFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: zone?.name || ''
    }
  });

  // Create mutation for adding a new zone
  const createMutation = useMutation({
    mutationFn: (data: ZoneFormValues) => fakeZones.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zones'] });
      toast.success('Zone created successfully');
      closeDrawer();
    },
    onError: (error) => {
      toast.error(
        `Failed to create zone: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  });

  // Update mutation for editing an existing zone
  const updateMutation = useMutation({
    mutationFn: (data: ZoneFormValues) => fakeZones.update(zone!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zones'] });
      toast.success('Zone updated successfully');
      closeDrawer();
    },
    onError: (error) => {
      toast.error(
        `Failed to update zone: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  });

  // Handle form submission
  const onSubmit = (data: ZoneFormValues) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zone Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter zone name' {...field} />
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
            {isEditing ? 'Update' : 'Create'} Zone
          </Button>
        </div>
      </form>
    </Form>
  );
}
