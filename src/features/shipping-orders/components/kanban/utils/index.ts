import { Active, DataRef, Over } from '@dnd-kit/core';
import { ShippingOrderDragData } from '../components/shipping-order-card';

type DraggableData = ShippingOrderDragData;

export function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined
): entry is T & {
  data: DataRef<DraggableData>;
} {
  if (!entry) {
    return false;
  }

  const data = entry.data.current;

  if (data?.type === 'Column' || data?.type === 'ShippingOrder') {
    return true;
  }

  return false;
}
