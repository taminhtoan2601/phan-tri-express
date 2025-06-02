import type { ShippingType } from '../types/system-configuration';

export const shippingTypes: ShippingType[] = [
  { id: 1, name: 'Air Freight', code: 'AIR' },
  { id: 2, name: 'Sea Freight', code: 'SEA' },
  { id: 3, name: 'Ground', code: 'GRD' },
  { id: 4, name: 'Express', code: 'EXP' },
  { id: 5, name: 'Multimodal', code: 'MULTI' },
  { id: 6, name: 'Courier', code: 'COUR' },
  { id: 7, name: 'Last Mile', code: 'LAST' },
  { id: 8, name: 'Consolidation', code: 'CONS' },
  { id: 9, name: 'Cold Chain', code: 'COLD' },
  { id: 10, name: 'Specialized', code: 'SPEC' }
];
