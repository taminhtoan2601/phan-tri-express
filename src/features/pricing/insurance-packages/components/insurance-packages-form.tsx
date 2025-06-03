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
import { InsurancePackage } from '@/types/system-configuration';
import {
  createInsurancePackage,
  updateInsurancePackage
} from '@/lib/api/system-configuration-api';

// Form validation schema using Zod
const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(100, { message: 'Name cannot exceed 100 characters' }),
  rate: z.number().min(0, { message: 'Rate must be a positive number' }),
  activeDate: z.string().min(1, { message: 'Active date is required' })
});

type InsurancePackageFormValues = z.infer<typeof formSchema>;

interface InsurancePackageFormProps {
  initialData: InsurancePackage | null;
  onClose: () => void;
}

/**
 * Form component for creating/editing insurance packages
 */
export function InsurancePackageForm({
  initialData,
  onClose
}: InsurancePackageFormProps) {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  // Initialize form with default values or data from initialData if editing
  const form = useForm<InsurancePackageFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          rate: initialData.rate,
          activeDate: initialData.activeDate
        }
      : {
          name: '',
          rate: 0,
          activeDate: ''
        }
  });

  // Create mutation for new commodity types
  const createMutation = useMutation({
    mutationFn: createInsurancePackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insurance-packages'] });
      toast.success('Insurance package created successfully');
      onClose();
    },
    onError: (error: Error) => {
      toast.error(`Failed to create commodity type: ${error.message}`);
    }
  });

  // Update mutation for existing commodity types
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data
    }: {
      id: number;
      data: Partial<InsurancePackage>;
    }) => updateInsurancePackage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insurance-packages'] });
      toast.success('Insurance package updated successfully');
      onClose();
    },
    onError: (error: Error) => {
      toast.error(`Failed to update commodity type: ${error.message}`);
    }
  });

  // Form submission handler
  const onSubmit = (values: InsurancePackageFormValues) => {
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
                <Input placeholder='e.g. Basic Coverage' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='rate'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rate</FormLabel>
              <FormControl>
                <Input type='number' placeholder='e.g. 1000' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='activeDate'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Active Date</FormLabel>
              <FormControl>
                <Input type='date' placeholder='e.g. 2023-01-01' {...field} />
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
