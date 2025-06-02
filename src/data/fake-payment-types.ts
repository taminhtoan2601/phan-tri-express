import type { PaymentType } from '../types/system-configuration';

export const paymentTypes: PaymentType[] = [
  { id: 1, name: 'Credit Card', code: 'CC01' },
  { id: 2, name: 'Bank Transfer', code: 'BT01' },
  { id: 3, name: 'Cash on Delivery', code: 'COD01' },
  { id: 4, name: 'Digital Wallet', code: 'DW01' },
  { id: 5, name: 'Prepaid Account', code: 'PA01' },
  { id: 6, name: 'Invoice', code: 'INV01' },
  { id: 7, name: 'Cheque', code: 'CHQ01' },
  { id: 8, name: 'Corporate Account', code: 'CA01' },
  { id: 9, name: 'Cryptocurrency', code: 'CRY01' },
  { id: 10, name: 'Mobile Payment', code: 'MP01' }
];
