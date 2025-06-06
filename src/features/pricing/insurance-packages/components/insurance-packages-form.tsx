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
    .min(1, { message: 'Tên là bắt buộc' })
    .max(100, { message: 'Tên không được vượt quá 100 ký tự' }),
  rate: z.number().min(0, { message: 'Giá phải là số dương' }),
  activeDate: z.string().min(1, { message: 'Ngày hiệu lực là bắt buộc' })
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
      toast.success('Gói bảo hiểm được tạo thành công.');
      onClose();
    },
    onError: (error: Error) => {
      toast.error(`Failed to create insurance package: ${error.message}`);
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
      toast.success('Gói bảo hiểm được cập nhật thành công.');
      onClose();
    },
    onError: (error: Error) => {
      toast.error(`Failed to update insurance package: ${error.message}`);
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
              <FormLabel>Tên</FormLabel>
              <FormControl>
                <Input placeholder='Tên gói bảo hiểm' {...field} />
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
              <FormLabel>Tỉ Giá</FormLabel>
              <FormControl>
                <Input type='number' placeholder='Tỉ giá' {...field} />
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
              <FormLabel>Ngày Hiệu Lực</FormLabel>
              <FormControl>
                <Input type='date' placeholder='Ngày hiệu lực' {...field} />
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
            Hủy
          </Button>
          <Button
            type='submit'
            disabled={
              isPending || createMutation.isPending || updateMutation.isPending
            }
          >
            {createMutation.isPending || updateMutation.isPending || isPending
              ? 'Đang Lưu...'
              : initialData
                ? 'Cập Nhật'
                : 'Tạo'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
