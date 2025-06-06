import ShippingOrderKanbanViewPage from '@/features/shipping-orders/components/kanban/components/shipping-order-kanban-view-page';
import { ShippingOrderStatus } from '@/types/enums';

export default function ListShippingOrdersPage() {
  return (
    <ShippingOrderKanbanViewPage
      statusCols={[
        ShippingOrderStatus.Draft,
        ShippingOrderStatus.PendingForApproval,
        ShippingOrderStatus.Approved,
        ShippingOrderStatus.DocsVerified,
        ShippingOrderStatus.EntryInWarehouse,
        ShippingOrderStatus.ReadyToExport,
        ShippingOrderStatus.InTransit,
        ShippingOrderStatus.Delivered,
        ShippingOrderStatus.Cancelled
      ]}
    />
  );
}
