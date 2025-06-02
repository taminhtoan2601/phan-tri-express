import type { ShippingService } from '../types/system-configuration';

export const shippingServices: ShippingService[] = [
  { id: 1, name: 'Standard', multiplier: 1.0, transitTimeDays: 7 },
  { id: 2, name: 'Express', multiplier: 1.5, transitTimeDays: 3 },
  { id: 3, name: 'Economy', multiplier: 0.8, transitTimeDays: 10 }
];
