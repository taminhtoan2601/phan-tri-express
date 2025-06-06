import { Customer } from '@/types/customer';

export const customers: Customer[] = [
  {
    id: 1,
    name: 'Công ty TNHH ABC',
    email: 'contact@abc.com',
    phone: '02838123456',
    address: '123 Đường X, Phường Y, Quận Z',
    cityId: 1, // HCM
    postal: '700000',
    note: 'Khách hàng VIP, ưu tiên giao nhanh'
    // country and city are optional and can be omitted if not provided for mock data
  },
  {
    id: 2,
    name: 'Anh Nguyễn Văn B',
    email: 'van.b@personal.com',
    phone: '0908765432',
    address: '456 Đường A, Phường B, Quận C',
    cityId: 2, // HN
    postal: '100000',
    note: 'Giao hàng ngoài giờ hành chính'
    // country and city are optional and can be omitted if not provided for mock data
  },
  {
    id: 3,
    name: 'Chị Trần Thị C',
    email: 'thic.tran@example.net',
    phone: '0912345678',
    address: '789 Đường D, Phường E, Quận F',
    cityId: 17, // NYC
    postal: '10001',
    note: 'Hàng dễ vỡ, xin nhẹ tay'
    // country and city are optional and can be omitted if not provided for mock data
  }
];
