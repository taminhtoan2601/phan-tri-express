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
import { Branch } from '@/types/system-configuration';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { fakeBranches, fakeCities } from '@/constants/mock-system-config';
import { useDrawer } from '../context/drawer-context';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';

/**
 * Form validation schema for branches
 */
const formSchema = z.object({
  code: z.string().min(2, 'Code must be at least 2 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  phone: z.string().min(5, 'Phone must be at least 5 characters'),
  discount: z.string().transform((val) => {
    // Convert input to number between 0-100
    const num = Number(val);
    return isNaN(num) ? 0 : Math.max(0, Math.min(100, num));
  }),
  cityId: z.string().transform((val) => Number(val))
});

/**
 * Type for form input, based on the schema
 */
type BranchFormValues = z.infer<typeof formSchema>;

/**
 * Helper type for form submission
 */
type BranchSubmitData = {
  code: string;
  name: string;
  address: string;
  phone: string;
  discount: number;
  cityId: number;
};

/**
 * Props for BranchForm component
 */
interface BranchFormProps {
  initialData?: Branch;
  onClose?: () => void;
}

/**
 * Form component for adding or editing branches
 */
export function BranchForm({ initialData, onClose }: BranchFormProps) {
  const queryClient = useQueryClient();
  const { closeDrawer } = useDrawer();

  // Use either passed initialData or branch from context
  const branch = initialData;

  // Determine if this is an edit or add operation
  const isEditing = !!branch;

  // Initialize form with default values or existing branch data
  const form = useForm<BranchFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: branch?.code || '',
      name: branch?.name || '',
      address: branch?.address || '',
      phone: branch?.phone || '',
      discount: branch ? Number(branch.discount) : 0,
      cityId: branch ? Number(branch.cityId) : 0
    }
  });
  // Fetch countries for the dropdown
  const { data: cities, isLoading: isLoadingCities } = useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      return await fakeCities.getAll();
    }
  });
  // Create mutation for adding a new branch
  const createMutation = useMutation({
    mutationFn: (data: BranchSubmitData) =>
      fakeBranches.create({
        code: data.code,
        name: data.name,
        address: data.address,
        phone: data.phone,
        discount: data.discount,
        cityId: data.cityId
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast.success('Branch created successfully');
      // Use passed onClose prop if available, otherwise use context
      if (onClose) onClose();
      else closeDrawer();
    },
    onError: (error) => {
      toast.error(
        `Failed to create branch: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  });

  // Update mutation for editing an existing branch
  const updateMutation = useMutation({
    mutationFn: (data: BranchSubmitData) =>
      fakeBranches.update(branch!.id, {
        code: data.code,
        name: data.name,
        address: data.address,
        phone: data.phone,
        discount: data.discount,
        cityId: branch?.cityId || 0
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast.success('Branch updated successfully');
      // Use passed onClose prop if available, otherwise use context
      if (onClose) onClose();
      else closeDrawer();
    },
    onError: (error) => {
      toast.error(
        `Failed to update branch: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  });

  // Handle form submission
  const onSubmit = (values: BranchFormValues) => {
    // Convert form values to proper types
    const submitData: BranchSubmitData = {
      code: values.code,
      name: values.name,
      address: values.address,
      phone: values.phone,
      discount: Number(values.discount),
      cityId: Number(values.cityId)
    };

    if (branch) {
      // Update existing branch
      updateMutation.mutate(submitData);
    } else {
      // Create new branch
      createMutation.mutate(submitData);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='cityId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={String(field.value)}
                disabled={isLoadingCities}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a city' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cities?.map((city) => (
                    <SelectItem key={city.id} value={String(city.id)}>
                      {city.name}
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
              <FormLabel>Branch Code</FormLabel>
              <FormControl>
                <Input placeholder='e.g., HCM1, HN2, DN1' {...field} />
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
              <FormLabel>Branch Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter branch name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='address'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder='Full branch address' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder='Branch contact number' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='discount'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount (%)</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  min='0'
                  max='100'
                  step='0.01'
                  placeholder='0-100%'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-end space-x-2'>
          <Button
            variant='outline'
            type='button'
            onClick={onClose || closeDrawer}
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            Cancel
          </Button>

          <Button
            type='submit'
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending
              ? 'Saving...'
              : 'Save'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
