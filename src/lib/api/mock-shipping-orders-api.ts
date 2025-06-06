import { fakeShippingOrders } from '@/constants/mock-shipping-orders';
import { ShippingOrder } from '@/types/shipping-order';

// Initialize all mock data stores
const initializeMockData = () => {
  fakeShippingOrders.initialize();
};

// Initialize data when this module is imported
initializeMockData();

export async function getShippingOrders(): Promise<ShippingOrder[]> {
  return fakeShippingOrders.getAll();
}

export async function createShippingOrder(
  customer: Omit<ShippingOrder, 'id'>
): Promise<ShippingOrder> {
  return fakeShippingOrders.create(customer);
}

export async function updateShippingOrder(
  id: number,
  customer: Partial<ShippingOrder>
): Promise<ShippingOrder> {
  return fakeShippingOrders.update(id, customer);
}

export async function deleteShippingOrder(id: number): Promise<void> {
  return fakeShippingOrders.delete(id);
}
