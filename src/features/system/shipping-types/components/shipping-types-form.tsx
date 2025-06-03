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
import { ShippingType } from '@/types/system-configuration';
import {
  createShippingType,
  updateShippingType
} from '@/lib/api/system-configuration-api';

// Form validation schema using Zod
const formSchema = z.object({
  code: z
    .string()
    .min(1, { message: 'Code is required' })
    .max(15, { message: 'Code cannot exceed 15 characters' }),
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(100, { message: 'Name cannot exceed 100 characters' })
});

type ShippingTypeFormValues = z.infer<typeof formSchema>;

interface ShippingTypeFormProps {
  initialData: ShippingType | null;
  onClose: () => void;
}

/**
 * Form component for creating/editing shipping types
 */
export function ShippingTypeForm({
  initialData,
  onClose
}: ShippingTypeFormProps) {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  // Initialize form with default values or data from initialData if editing
  const form = useForm<ShippingTypeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          code: initialData.code,
          name: initialData.name
        }
      : {
          code: '',
          name: ''
        }
  });

  // Create mutation for new shipping types
  const createMutation = useMutation({
    mutationFn: createShippingType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-types'] });
      toast.success('Shipping type created successfully');
      onClose();
    },
    onError: (error: Error) => {
      toast.error(`Failed to create shipping type: ${error.message}`);
    }
  });

  // Update mutation for existing shipping types
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ShippingType> }) =>
      updateShippingType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-types'] });
      toast.success('Shipping type updated successfully');
      onClose();
    },
    onError: (error: Error) => {
      toast.error(`Failed to update shipping type: ${error.message}`);
    }
  });

  // Form submission handler
  const onSubmit = (values: ShippingTypeFormValues) => {
    setIsPending(true);

    if (initialData) {
      // Update existing shipping type
      updateMutation.mutate({
        id: initialData.id,
        data: values
      });
    } else {
      // Create new shipping type
      createMutation.mutate(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='code'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input placeholder='e.g. ELEC, FASH' {...field} />
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
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='e.g. Electronics, Fashion' {...field} />
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
