import { fakeCustomers } from '@/constants/mock-customers';
import { Customer } from '@/types/customer';

// Initialize all mock data stores
const initializeMockData = () => {
  fakeCustomers.initialize();
};

// Initialize data when this module is imported
initializeMockData();

export async function getCustomers(): Promise<Customer[]> {
  return fakeCustomers.getAll();
}

export async function createCustomer(
  customer: Omit<Customer, 'id'>
): Promise<Customer> {
  return fakeCustomers.create(customer);
}

export async function updateCustomer(
  id: number,
  customer: Partial<Customer>
): Promise<Customer> {
  return fakeCustomers.update(id, customer);
}

export async function deleteCustomer(id: number): Promise<void> {
  return fakeCustomers.delete(id);
}
