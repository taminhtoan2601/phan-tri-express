/**
 * Commodity Type Form Component
 * For creating and updating commodity types
 */
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as z from 'zod';

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
import { ShippingService } from '@/types/system-configuration';
import {
  createShippingService,
  updateShippingService
} from '@/lib/api/system-configuration-api';

// Form validation schema using Zod
const formSchema = z.object({
  multiplier: z.number().min(1, { message: 'Multiplier is required' }),
  transitTimeDays: z.number().min(1, { message: 'Transit time is required' }),
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(100, { message: 'Name cannot exceed 100 characters' })
});

type ShippingServiceFormValues = z.infer<typeof formSchema>;

interface ShippingServiceFormProps {
  initialData: ShippingService | null;
  onClose: () => void;
}

/**
 * Form component for creating/editing payment types
 */
export function ShippingServiceForm({
  initialData,
  onClose
}: ShippingServiceFormProps) {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  // Initialize form with default values or data from initialData if editing
  const form = useForm<ShippingServiceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          multiplier: initialData.multiplier,
          transitTimeDays: initialData.transitTimeDays
        }
      : {
          name: '',
          multiplier: 1,
          transitTimeDays: 1
        }
  });

  // Create mutation for new payment types
  const createMutation = useMutation({
    mutationFn: createShippingService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-services'] });
      toast.success('Shipping service created successfully');
      onClose();
    },
    onError: (error: Error) => {
      toast.error(`Failed to create commodity type: ${error.message}`);
    }
  });

  // Update mutation for existing payment types
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data
    }: {
      id: number;
      data: Partial<ShippingService>;
    }) => updateShippingService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-services'] });
      toast.success('Shipping service updated successfully');
      onClose();
    },
    onError: (error: Error) => {
      toast.error(`Failed to update shipping service: ${error.message}`);
    }
  });

  // Form submission handler
  const onSubmit = (values: ShippingServiceFormValues) => {
    setIsPending(true);

    if (initialData) {
      // Update existing commodity type
      updateMutation.mutate({
        id: initialData.id,
        data: values
      });
    } else {
      // Create new commodity type
      createMutation.mutate(values);
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
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='e.g. Standard, Express' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='multiplier'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Multiplier</FormLabel>
              <FormControl>
                <Input type='number' placeholder='e.g. 1.5' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='transitTimeDays'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transit Time (days)</FormLabel>
              <FormControl>
                <Input type='number' placeholder='e.g. 1' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-end space-x-2 pt-4'>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            disabled={
              isPending || createMutation.isPending || updateMutation.isPending
            }
          >
            {createMutation.isPending || updateMutation.isPending || isPending
              ? 'Saving...'
              : initialData
                ? 'Update'
                : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
