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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Carrier } from '@/types/system-configuration';
import {
  createCarrier,
  updateCarrier
} from '@/lib/api/system-configuration-api';
import { routes } from '@/data';
import { Checkbox } from '@/components/ui/checkbox';

// Form validation schema using Zod
const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Tên là bắt buộc' })
    .max(100, { message: 'Tên không được vượt quá 100 ký tự' }),
  routeIds: z.array(z.number())
});

type CarrierFormValues = z.infer<typeof formSchema>;

interface CarrierFormProps {
  initialData: Carrier | null;
  onClose: () => void;
}

/**
 * Form component for creating/editing insurance packages
 */
export function CarrierForm({ initialData, onClose }: CarrierFormProps) {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  // Initialize form with default values or data from initialData if editing
  const form = useForm<CarrierFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          routeIds: initialData.routes?.map((route) => route.id) || []
        }
      : {
          name: '',
          routeIds: []
        }
  });

  // Create mutation for new commodity types
  const createMutation = useMutation({
    mutationFn: createCarrier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carriers'] });
      toast.success('Đơn vị vận chuyển được tạo thành công.');
      onClose();
    },
    onError: (error: Error) => {
      toast.error(`Không thể tạo đơn vị vận chuyển: ${error.message}`);
    }
  });

  // Update mutation for existing commodity types
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Carrier> }) =>
      updateCarrier(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carriers'] });
      toast.success('Đơn vị vận chuyển được cập nhật thành công.');
      onClose();
    },
    onError: (error: Error) => {
      toast.error(`Không thể cập nhật đơn vị vận chuyển: ${error.message}`);
    }
  });

  // Form submission handler
  const onSubmit = (values: CarrierFormValues) => {
    setIsPending(true);

    if (initialData) {
      // Update existing carrier
      updateMutation.mutate({
        id: initialData.id,
        data: values
      });
    } else {
      // Create new carrier
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
                <Input placeholder='Tên đơn vị vận chuyển' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='routeIds'
          render={() => (
            <FormItem>
              <div className='mb-4'>
                <FormLabel className='text-base'>
                  Các Tuyến Vận Chuyển
                </FormLabel>
                <FormDescription>
                  Chọn các tuyến vận chuyển bạn muốn hiển thị trong thanh menu.
                </FormDescription>
              </div>
              {routes.map((route) => (
                <FormField
                  key={route.id}
                  control={form.control}
                  name='routeIds'
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={route.id}
                        className='flex flex-row items-center gap-2'
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(route.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, route.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== route.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className='text-sm font-normal'>
                          {route.name}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
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
