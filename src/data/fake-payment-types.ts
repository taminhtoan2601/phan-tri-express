import type { PaymentType } from '../types/system-configuration';

export const paymentTypes: PaymentType[] = [
  { id: 1, name: 'Thẻ tín dụng', code: 'CC01' },
  { id: 2, name: 'Chuyển khoản ngân hàng', code: 'BT01' },
  { id: 3, name: 'Thanh toán khi nhận hàng', code: 'COD01' },
  { id: 4, name: 'Ví điện tử', code: 'DW01' },
  { id: 5, name: 'Tiền mặt', code: 'CASH' }
];
