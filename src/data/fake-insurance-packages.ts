import type { InsurancePackage } from '../types/system-configuration';

export const insurancePackages: InsurancePackage[] = [
  {
    id: 1,
    name: 'Basic Coverage',
    rate: 0.5,
    activeDate: '2023-01-01'
  },
  {
    id: 2,
    name: 'Standard Protection',
    rate: 1.2,
    activeDate: '2023-01-01'
  },
  {
    id: 3,
    name: 'Premium Insurance',
    rate: 2.5,
    activeDate: '2023-01-15'
  },
  {
    id: 4,
    name: 'Full Value Coverage',
    rate: 3.0,
    activeDate: '2023-02-01'
  },
  {
    id: 5,
    name: 'Fragile Items Protection',
    rate: 2.8,
    activeDate: '2023-02-15'
  },
  {
    id: 6,
    name: 'Electronics Insurance',
    rate: 2.2,
    activeDate: '2023-03-01'
  },
  {
    id: 7,
    name: 'Luxury Goods Coverage',
    rate: 4.5,
    activeDate: '2023-03-15'
  },
  {
    id: 8,
    name: 'Medical Supplies Insurance',
    rate: 1.8,
    activeDate: '2023-04-01'
  },
  {
    id: 9,
    name: 'Document Protection',
    rate: 0.8,
    activeDate: '2023-04-15'
  },
  {
    id: 10,
    name: 'High-Value Item Insurance',
    rate: 5.0,
    activeDate: '2023-05-01'
  }
];
