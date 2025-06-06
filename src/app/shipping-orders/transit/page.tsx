import ShippingOrderKanbanViewPage from '@/features/shipping-orders/components/kanban/components/shipping-order-kanban-view-page';
import { ShippingOrderStatus } from '@/types/enums';

export default function TransitShippingOrdersPage() {
  return (
    <ShippingOrderKanbanViewPage
      statusCols={[
        ShippingOrderStatus.EntryInWarehouse,
        ShippingOrderStatus.ReadyToExport
      ]}
    />
  );
}
