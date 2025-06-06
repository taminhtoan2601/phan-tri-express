import type { SurchargeType } from '@/types/system-configuration';

export const surchargeTypes: SurchargeType[] = [
  {
    id: 1,
    name: 'Phí nhiên liệu',
    description: 'Phụ phí áp dụng do biến động giá nhiên liệu.'
  },
  {
    id: 2,
    name: 'Phí vùng sâu vùng xa',
    description: 'Phụ phí cho các địa chỉ giao hàng ở khu vực khó tiếp cận.'
  },
  {
    id: 3,
    name: 'Phí hàng quá khổ/quá tải',
    description:
      'Phụ phí cho các kiện hàng vượt quá kích thước hoặc trọng lượng tiêu chuẩn.'
  },
  {
    id: 4,
    name: 'Phí kiểm đếm/bốc xếp',
    description:
      'Phụ phí cho dịch vụ kiểm đếm hoặc bốc xếp hàng hóa theo yêu cầu.'
  },
  {
    id: 5,
    name: 'Phí lưu kho/chờ xử lý',
    description:
      'Phụ phí phát sinh do hàng hóa lưu kho quá hạn hoặc chờ xử lý kéo dài.'
  },
  {
    id: 6,
    name: 'Khác',
    description: 'Phụ phí phát sinh do lý do khác.'
  }
];
