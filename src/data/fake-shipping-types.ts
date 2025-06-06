import type { ShippingType } from '../types/system-configuration';

export const shippingTypes: ShippingType[] = [
  { id: 1, name: 'Hàng không (AIR)', code: 'AIR' },
  { id: 2, name: 'Đường biển (SEA)', code: 'SEA' },
  { id: 3, name: 'Đường bộ (GRD)', code: 'GRD' },
  { id: 4, name: 'EMS (Chuyển phát nhanh)', code: 'EXP' },
  { id: 5, name: 'Multimodal', code: 'MULTI' },
  { id: 6, name: 'Courier', code: 'COUR' },
  { id: 7, name: 'Last Mile', code: 'LAST' },
  { id: 8, name: 'Consolidation', code: 'CONS' },
  { id: 9, name: 'Cold Chain', code: 'COLD' },
  { id: 10, name: 'Specialized', code: 'SPEC' }
];
