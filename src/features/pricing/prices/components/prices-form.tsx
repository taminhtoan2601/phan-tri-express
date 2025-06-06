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
import { Price } from '@/types/system-configuration';
import { createPrice, updatePrice } from '@/lib/api/system-configuration-api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { routes, shippingServices } from '@/data';

// Form validation schema using Zod
const formSchema = z.object({
  routeId: z.number().min(1, { message: 'Tuyến vận chuyển là bắt buộc' }),
  shippingServiceId: z.number().min(1, { message: 'Dịch vụ là bắt buộc' }),
  baseRatePerKg: z.number().min(0, { message: 'Giá phải là số dương' }),
  effectiveDate: z.string().min(1, { message: 'Ngày hiệu lực là bắt buộc' }),
  deletionDate: z.string().optional()
});

type PriceFormValues = z.infer<typeof formSchema>;

interface PriceFormProps {
  initialData: Price | null;
  onClose: () => void;
}

/**
 * Form component for creating/editing prices
 */
export function PricesForm({ initialData, onClose }: PriceFormProps) {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  // Initialize form with default values or data from initialData if editing
  const form = useForm<PriceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          routeId: initialData.routeId,
          shippingServiceId: initialData.shippingServiceId,
          baseRatePerKg: initialData.baseRatePerKg,
          effectiveDate: initialData.effectiveDate,
          deletionDate: initialData.deletionDate
        }
      : {
          routeId: 0,
          shippingServiceId: 0,
          baseRatePerKg: 0,
          effectiveDate: '',
          deletionDate: ''
        }
  });

  // Create mutation for new commodity types
  const createMutation = useMutation({
    mutationFn: createPrice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prices'] });
      toast.success('Giá tạo thành công');
      onClose();
    },
    onError: (error: Error) => {
      toast.error(`Tạo giá thất bại: ${error.message}`);
    }
  });

  // Update mutation for existing commodity types
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Price> }) =>
      updatePrice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prices'] });
      toast.success('Giá cập nhật thành công');
      onClose();
    },
    onError: (error: Error) => {
      toast.error(`Cập nhật giá thất bại: ${error.message}`);
    }
  });

  // Form submission handler
  const onSubmit = (values: PriceFormValues) => {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-2/3 space-y-6'>
        <FormField
          control={form.control}
          name='routeId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tuyến vận chuyển</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn tuyến vận chuyển' />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map((route) => (
                      <SelectItem key={route.id} value={route.id.toString()}>
                        ({route.code}) {route.originCity?.name} -{' '}
                        {route.destinationCity?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='shippingServiceId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dịch vụ</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn dịch vụ' />
                  </SelectTrigger>
                  <SelectContent>
                    {shippingServices.map((service) => (
                      <SelectItem
                        key={service.id}
                        value={service.id.toString()}
                      >
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='baseRatePerKg'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giá Cân Trung Bình</FormLabel>
              <FormControl>
                <Input type='number' placeholder='e.g. 1000' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='effectiveDate'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày Hiệu Lực</FormLabel>
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
                ? 'Cập nhật'
                : 'Tạo'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
