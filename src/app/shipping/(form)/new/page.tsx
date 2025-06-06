import PageContainer from '@/components/layout/page-container';
import { CreateShippingOrderForm } from '@/features/shipping-orders/components/CreateShippingOrderForm';
import Link from 'next/link';

// Placeholder for Breadcrumb component

export default function NewShippingOrderPage() {
  return (
    <PageContainer scrollable={true}>
      <div className='container mx-auto p-4 md:p-6'>
        <h1 className='mb-6 text-2xl font-bold tracking-tight md:text-3xl'>
          Tạo Đơn Mới
        </h1>
        <CreateShippingOrderForm />
      </div>
    </PageContainer>
  );
}
