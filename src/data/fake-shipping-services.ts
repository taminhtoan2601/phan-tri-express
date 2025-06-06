import type { ShippingService } from '../types/system-configuration';

export const shippingServices: ShippingService[] = [
  { id: 1, name: 'Tiêu chuẩn (7 ngày)', multiplier: 1.0, transitTimeDays: 7 },
  {
    id: 2,
    name: 'Nhanh Nhất (2-3 ngày - Giá gấp 1.5)',
    multiplier: 1.5,
    transitTimeDays: 3
  },
  {
    id: 3,
    name: 'Tiết kiệm (10-14 ngày - Giá giảm 20%)',
    multiplier: 0.8,
    transitTimeDays: 10
  }
];
