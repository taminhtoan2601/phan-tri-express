/**
 * Pricing Rules Configuration Page
 * Manages rules for calculating shipping costs
 */
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DataTable,
  DataDrawer
} from '@/components/system-configuration/data-table';
import { PricingRule } from '@/types/system-configuration';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { fakePricingRules } from '@/constants/mock-system-config';
import { PencilIcon, TrashIcon } from 'lucide-react';

/**
 * Form data structure for pricing rule form
 */
interface PricingRuleFormData {
  id?: number;
  name: string;
  volumetricDivisor: string;
}

/**
 * API functions for Pricing Rules
 */
const getPricingRules = async (): Promise<PricingRule[]> => {
  return fakePricingRules.getAll();
};

const createPricingRule = async (
  data: Omit<PricingRule, 'id'>
): Promise<PricingRule> => {
  return fakePricingRules.create({
    ...data,
    volumetricDivisor: Number(data.volumetricDivisor)
  });
};

const updatePricingRule = async (
  id: number,
  data: Partial<PricingRule>
): Promise<PricingRule> => {
  const updateData = { ...data };

  if (typeof data.volumetricDivisor === 'string') {
    updateData.volumetricDivisor = Number(data.volumetricDivisor);
  }

  return fakePricingRules.update(id, updateData);
};

const deletePricingRule = async (id: number): Promise<void> => {
  return fakePricingRules.delete(id);
};

/**
 * Pricing Rules configuration page component
 */
export default function PricingRulesPage() {
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState<PricingRuleFormData>({
    name: '',
    volumetricDivisor: '5000'
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch pricing rules data
  const { data: rulesData, isPending } = useQuery({
    queryKey: ['pricingRules'],
    queryFn: getPricingRules
  });

  // Mutation for creating a new pricing rule
  const createMutation = useMutation({
    mutationFn: createPricingRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricingRules'] });
      toast.success('Đã tạo Quy tắc giá thành công');
      closeDrawer();
    },
    onError: (error) => {
      toast.error(`Thất bại khi tạo Quy tắc giá: ${error.message}`);
    }
  });

  // Mutation for updating a pricing rule
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PricingRule> }) =>
      updatePricingRule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricingRules'] });
      toast.success('Đã cập nhật Quy tắc giá thành công');
      closeDrawer();
    },
    onError: (error) => {
      toast.error(`Thất bại khi cập nhật Quy tắc giá: ${error.message}`);
    }
  });

  // Mutation for deleting a pricing rule
  const deleteMutation = useMutation({
    mutationFn: deletePricingRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricingRules'] });
      toast.success('Đã xóa Quy tắc giá thành công');
    },
    onError: (error) => {
      toast.error(`Failed to delete pricing rule: ${error.message}`);
    }
  });

  /**
   * Close the drawer and reset form data
   */
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setFormData({
      name: '',
      volumetricDivisor: '5000'
    });
    setIsEditing(false);
  };

  /**
   * Handle adding a new pricing rule
   */
  const handleAdd = () => {
    setIsEditing(false);
    setFormData({
      name: '',
      volumetricDivisor: '5000'
    });
    setIsDrawerOpen(true);
  };

  /**
   * Handle editing an existing pricing rule
   * @param rule Pricing rule to edit
   */
  const handleEdit = (rule: PricingRule) => {
    setIsEditing(true);
    setFormData({
      id: rule.id,
      name: rule.name,
      volumetricDivisor: rule.volumetricDivisor.toString()
    });
    setIsDrawerOpen(true);
  };

  /**
   * Handle deleting a pricing rule
   * @param rule Pricing rule to delete
   */
  const handleDelete = (rule: PricingRule) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa Quy tắc giá này?')) {
      deleteMutation.mutate(rule.id);
    }
  };

  /**
   * Handle form submission
   * @param e Form event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Tên Quy tắc giá không được để trống');
      return;
    }

    if (
      isNaN(Number(formData.volumetricDivisor)) ||
      Number(formData.volumetricDivisor) <= 0
    ) {
      toast.error('Divisor phải là số dương');
      return;
    }

    if (isEditing && formData.id) {
      updateMutation.mutate({
        id: formData.id,
        data: {
          name: formData.name,
          volumetricDivisor: Number(formData.volumetricDivisor)
        }
      });
    } else {
      createMutation.mutate({
        name: formData.name,
        volumetricDivisor: Number(formData.volumetricDivisor)
      });
    }
  };

  /**
   * Handle input change in the form
   * @param e Input change event
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Define columns for the data table
  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (rule: PricingRule) => <span>{rule.id}</span>
    },
    {
      key: 'name',
      header: 'Tên Quy tắc giá',
      render: (rule: PricingRule) => <span>{rule.name}</span>
    },
    {
      key: 'volumetricDivisor',
      header: 'Hệ số quy đổi',
      render: (rule: PricingRule) => (
        <span>{rule.volumetricDivisor.toLocaleString()}</span>
      )
    },
    {
      key: 'example',
      header: 'Ví dụ',
      render: (rule: PricingRule) => {
        const volume = 100 * 50 * 30; // 100cm × 50cm × 30cm = 150,000 cm³
        const volumetricWeight = volume / rule.volumetricDivisor;
        return (
          <span className='text-sm'>
            100cm × 50cm × 30cm = {volumetricWeight.toFixed(1)}kg
          </span>
        );
      }
    },
    {
      key: 'actions',
      header: 'Hành động',
      render: (rule: PricingRule) => (
        <div className='flex space-x-2'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => handleEdit(rule)}
          >
            <PencilIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            onClick={() => handleDelete(rule)}
          >
            <TrashIcon className='h-4 w-4' />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className='container mx-auto py-6'>
      <div className='mb-8'>
        <h1 className='mb-2 text-3xl font-bold'>Quy tắc giá</h1>
        <p className='text-muted-foreground'>
          Quản lý quy tắc giá và tính toán trọng lượng
        </p>
      </div>

      <DataTable
        columns={columns}
        data={rulesData || []}
        onAdd={handleAdd}
        isLoading={isPending}
      />

      <DataDrawer
        title={isEditing ? 'Sửa Quy tắc giá' : 'Thêm Quy tắc giá'}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
      >
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Tên Quy tắc giá</Label>
            <Input
              id='name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              placeholder='e.g., Standard Volumetric, Light Cargo'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='volumetricDivisor'>Hệ số quy đổi</Label>
            <Input
              id='volumetricDivisor'
              name='volumetricDivisor'
              type='number'
              value={formData.volumetricDivisor}
              onChange={handleInputChange}
              placeholder='Hệ số quy đổi (thường là 5000)'
              min='1'
              step='100'
            />
            <p className='text-muted-foreground text-sm'>
              Trọng lượng (kg) = Chiều dài × Chiều rộng × Chiều cao (cm) ÷ Hệ số
              quy đổi
            </p>
          </div>

          <div className='flex justify-end space-x-2'>
            <Button type='button' variant='outline' onClick={closeDrawer}>
              Hủy
            </Button>
            <Button
              type='submit'
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Đang lưu...'
                : 'Lưu'}
            </Button>
          </div>
        </form>
      </DataDrawer>
    </div>
  );
}
