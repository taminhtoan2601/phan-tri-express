import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { ShippingOrderKanbanBoard } from './shipping-order-kanban-board';
import { ShippingOrderStatus } from '@/types/enums';

export default function ShippingOrderKanbanViewPage({
  statusCols
}: {
  statusCols: ShippingOrderStatus[];
}) {
  return (
    <PageContainer scrollable={true}>
      {/* flex-1 + overflow-y-auto = vùng cuộn */}
      <div className='flex h-full flex-col'>
        <div className='mb-4'>
          <Heading title='Đơn Vận Chuyển' description={''} />
        </div>

        <div className='flex-1 overflow-x-auto'>
          <ShippingOrderKanbanBoard statusCols={statusCols} />
        </div>
      </div>
    </PageContainer>
  );
}
