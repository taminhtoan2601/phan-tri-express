import type { Country } from '../types/system-configuration';

/**
 * Danh sách "các quốc gia lớn" theo từng châu lục,
 * đã bổ sung thêm field `zoneId` để trỏ về Zone.id.
 * (Continent vẫn giữ để tiện lọc/bố cục UI, nhưng về business logic,
 *  bạn có thể dùng zoneId để phân theo nhóm tính giá.)
 */
export const countries: Country[] = [
  // ===== Asia =====
  {
    id: 1,
    code2: 'VN',
    code3: 'VNM',
    name: 'Việt Nam',
    continent: 'Asia',
    zoneId: 1
  },
  {
    id: 2,
    code2: 'CN',
    code3: 'CHN',
    name: 'Trung Quốc',
    continent: 'Asia',
    zoneId: 2
  },
  {
    id: 3,
    code2: 'JP',
    code3: 'JPN',
    name: 'Nhật Bản',
    continent: 'Asia',
    zoneId: 2
  },
  {
    id: 4,
    code2: 'IN',
    code3: 'IND',
    name: 'Ấn Độ',
    continent: 'Asia',
    zoneId: 2
  },

  // ===== Europe =====
  {
    id: 5,
    code2: 'FR',
    code3: 'FRA',
    name: 'Pháp',
    continent: 'Europe',
    zoneId: 3
  },
  {
    id: 6,
    code2: 'DE',
    code3: 'DEU',
    name: 'Đức',
    continent: 'Europe',
    zoneId: 3
  },
  {
    id: 7,
    code2: 'GB',
    code3: 'GBR',
    name: 'Anh',
    continent: 'Europe',
    zoneId: 3
  },
  {
    id: 8,
    code2: 'IT',
    code3: 'ITA',
    name: 'Ý',
    continent: 'Europe',
    zoneId: 3
  },

  // ===== North America =====
  {
    id: 9,
    code2: 'US',
    code3: 'USA',
    name: 'Mỹ',
    continent: 'North America',
    zoneId: 4
  },
  {
    id: 10,
    code2: 'CA',
    code3: 'CAN',
    name: 'Canada',
    continent: 'North America',
    zoneId: 4
  },
  {
    id: 11,
    code2: 'MX',
    code3: 'MEX',
    name: 'Mexico',
    continent: 'North America',
    zoneId: 4
  },

  // ===== South America =====
  {
    id: 12,
    code2: 'BR',
    code3: 'BRA',
    name: 'Brazil',
    continent: 'South America',
    zoneId: 5
  },
  {
    id: 13,
    code2: 'AR',
    code3: 'ARG',
    name: 'Argentina',
    continent: 'South America',
    zoneId: 5
  },

  // ===== Africa =====
  {
    id: 14,
    code2: 'ZA',
    code3: 'ZAF',
    name: 'South Africa',
    continent: 'Africa',
    zoneId: 6
  },
  {
    id: 15,
    code2: 'EG',
    code3: 'EGY',
    name: 'Egypt',
    continent: 'Africa',
    zoneId: 6
  },
  {
    id: 16,
    code2: 'NG',
    code3: 'NGA',
    name: 'Nigeria',
    continent: 'Africa',
    zoneId: 6
  },

  // ===== Oceania =====
  {
    id: 17,
    code2: 'AU',
    code3: 'AUS',
    name: 'Australia',
    continent: 'Oceania',
    zoneId: 7
  },
  {
    id: 18,
    code2: 'NZ',
    code3: 'NZL',
    name: 'New Zealand',
    continent: 'Oceania',
    zoneId: 7
  }
];
