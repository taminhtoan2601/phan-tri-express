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
import { PaymentType } from '@/types/system-configuration';
import {
  createPaymentType,
  updatePaymentType
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

type PaymentTypeFormValues = z.infer<typeof formSchema>;

interface PaymentTypeFormProps {
  initialData: PaymentType | null;
  onClose: () => void;
}

/**
 * Form component for creating/editing payment types
 */
export function PaymentTypeForm({
  initialData,
  onClose
}: PaymentTypeFormProps) {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  // Initialize form with default values or data from initialData if editing
  const form = useForm<PaymentTypeFormValues>({
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

  // Create mutation for new payment types
  const createMutation = useMutation({
    mutationFn: createPaymentType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-types'] });
      toast.success('Payment type created successfully');
      onClose();
    },
    onError: (error: Error) => {
      toast.error(`Failed to create commodity type: ${error.message}`);
    }
  });

  // Update mutation for existing payment types
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PaymentType> }) =>
      updatePaymentType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-types'] });
      toast.success('Payment type updated successfully');
      onClose();
    },
    onError: (error: Error) => {
      toast.error(`Failed to update commodity type: ${error.message}`);
    }
  });

  // Form submission handler
  const onSubmit = (values: PaymentTypeFormValues) => {
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
