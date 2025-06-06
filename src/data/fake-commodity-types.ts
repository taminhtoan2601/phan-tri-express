import type { CommodityType } from '../types/system-configuration';

export const commodityTypes: CommodityType[] = [
  { id: 1, name: 'Hàng hóa thông thường', code: 'GC01' },
  { id: 2, name: 'Giấy tờ', code: 'DOC01' },
  { id: 3, name: 'Thiết bị điện tử', code: 'ELEC01' },
  { id: 4, name: 'Vải', code: 'CLO01' },
  { id: 5, name: 'Thức ăn & đồ uống', code: 'FOOD01' },
  { id: 6, name: 'Hàng hóa y tế', code: 'MED01' },
  { id: 7, name: 'Vật liệu nguy hiểm', code: 'HAZ01' },
  { id: 8, name: 'Phụ tùng xe', code: 'AUTO01' },
  { id: 9, name: 'Sách & Truyền thông', code: 'BOOK01' },
  { id: 10, name: 'Hàng dễ vỡ', code: 'FRAG01' }
];
