import type { InsurancePackage } from '../types/system-configuration';

export const insurancePackages: InsurancePackage[] = [
  {
    id: 1,
    name: 'Bảo hiểm cơ bản (25% giá trị khai báo)',
    rate: 0.05,
    activeDate: '2023-01-01'
  },
  {
    id: 2,
    name: 'Bảo hiểm tiêu chuẩn (50% giá trị khai báo)',
    rate: 0.1,
    activeDate: '2023-01-01'
  },
  {
    id: 3,
    name: 'Bảo hiểm cao cấp (100% giá trị khai báo)',
    rate: 0.15,
    activeDate: '2023-01-15'
  }
];
