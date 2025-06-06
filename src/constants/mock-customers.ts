////////////////////////////////////////////////////////////////////////////////
// 🛑 Mock API cho System Configuration Module
////////////////////////////////////////////////////////////////////////////////

import { faker } from '@faker-js/faker';
import { City, Country } from '@/types/system-configuration';
import { delay } from './mock-api';

// Import seed data from data directory
import { customers as seedCustomers } from '@/data';
import { Customer } from '@/types/customer';
import { fakeCountries, fakeCities } from './mock-system-config';

// Helpers
const generateId = (): number => Math.floor(Math.random() * 10000) + 1;
const getRandomItem = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)];

// ZONES
export const fakeCustomers = {
  records: [] as Customer[],

  initialize() {
    // Đảm bảo countries đã được khởi tạo trước
    if (fakeCountries.records.length === 0) {
      fakeCountries.initialize();
    }
    if (fakeCities.records.length === 0) {
      fakeCities.initialize();
    }
    // Sử dụng dữ liệu từ file fake-cities.ts
    this.records = [...seedCustomers];
    this.records.forEach((customer) => {
      customer.city = fakeCities.records.find(
        (city) => city.id === customer.cityId
      );
    });
  },

  async getAll() {
    await delay(300); // Simulate network delay
    return [...this.records];
  },

  async getById(id: number): Promise<Customer | undefined> {
    await delay(200);
    return this.records.find((customer) => customer.id === id);
  },

  async create(data: Omit<Customer, 'id'>): Promise<Customer> {
    await delay(500);
    const newCustomer = {
      id: generateId(),
      ...data
    };
    this.records.push(newCustomer);
    return newCustomer;
  },

  async update(id: number, data: Partial<Customer>): Promise<Customer> {
    await delay(500);
    const index = this.records.findIndex((customer) => customer.id === id);
    if (index === -1) throw new Error('Customer not found');

    this.records[index] = { ...this.records[index], ...data };
    return this.records[index];
  },

  async delete(id: number): Promise<void> {
    await delay(500);
    const index = this.records.findIndex((customer) => customer.id === id);
    if (index === -1) throw new Error('Customer not found');

    this.records.splice(index, 1);
  }
};
