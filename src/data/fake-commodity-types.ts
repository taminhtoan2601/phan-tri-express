import type { CommodityType } from '../types/system-configuration';

export const commodityTypes: CommodityType[] = [
  { id: 1, name: 'General Cargo', code: 'GC01' },
  { id: 2, name: 'Documents', code: 'DOC01' },
  { id: 3, name: 'Electronics', code: 'ELEC01' },
  { id: 4, name: 'Clothing', code: 'CLO01' },
  { id: 5, name: 'Food & Beverages', code: 'FOOD01' },
  { id: 6, name: 'Medical Supplies', code: 'MED01' },
  { id: 7, name: 'Hazardous Materials', code: 'HAZ01' },
  { id: 8, name: 'Automotive Parts', code: 'AUTO01' },
  { id: 9, name: 'Books & Media', code: 'BOOK01' },
  { id: 10, name: 'Fragile Items', code: 'FRAG01' }
];
