/**
 * System Configuration Types
 */

// Administrative
/**
 * Zone:
 *   - id: khoá chính numeric
 *   - name: tên vùng (ví dụ "Asia", "Europe", "North America", …)
 *
 */
export interface Zone {
  id: number;
  name: string;
}

/**
 * Country:
 *   - id: khoá chính numeric
 *   - code2, code3, name như trước
 *   - continent: tên châu lục để tiện lookup hoặc hiển thị
 *   - zoneId: numeric, tham chiếu trực tiếp tới Zone.id
 */
export interface Country {
  id: number;
  code2: string; // ISO 3166-1 alpha-2, ví dụ "VN", "FR", "US"
  code3: string; // ISO 3166-1 alpha-3, ví dụ "VNM", "FRA", "USA"
  name: string; // Tên đầy đủ của quốc gia
  continent: string; // Tên châu lục (để filter hoặc grouping)
  zoneId: number; // Tham chiếu tới Zone.id
  zone?: Zone;
}

/**
 * City: thêm trường numeric `id` làm khoá chính.
 * Vẫn giữ code (UN/LOCODE) để hiển thị nếu cần, nhưng join bằng city.id.
 */
export interface City {
  id: number; // id numeric, pk
  code: string; // UN/LOCODE 5 ký tự (không bắt buộc làm pk)
  name: string; // Tên thành phố
  countryId: number; // Tham chiếu đến Country.id
}

export interface Branch {
  id: number;
  code: string;
  name: string;
  discount: number;
  address: string;
  phone: string;
  countryId: number;
}

// System
export interface CommodityType {
  id: number;
  code: string;
  name: string;
}

export interface ShippingType {
  id: number;
  code: string;
  name: string;
}

export interface PaymentType {
  id: number;
  code: string;
  name: string;
}

// Pricing
export interface Route {
  id: number;
  originCountryId: number; // Tham chiếu Country.id
  originCityId: number; // Tham chiếu City.id
  destinationCountryId: number; // Tham chiếu Country.id
  destinationCityId: number; // Tham chiếu City.id
  zoneId: number; // Tham chiếu Zone.id
}

export interface Carrier {
  id: number;
  name: string;
  routeIds: number[];
}

export interface InsurancePackage {
  id: number;
  name: string;
  rate: number; // percentage as decimal (e.g., 0.05 for 5%)
  activeDate: string; // ISO date string
}

/**
 * ShippingService: Service levels like Standard, Express, Economy
 */
export interface ShippingService {
  id: number;
  name: string;
  multiplier: number;
  transitTimeDays: number;
}

/**
 * PricingRule: Rules for calculating shipping cost
 */
export interface PricingRule {
  id: number;
  name: string;
  volumetricDivisor: number;
}

/**
 * Price: Base rate per kg for a specific route and service
 */
export interface Price {
  id: number;
  routeId: number; // Tham chiếu Route.id
  serviceId: number; // Tham chiếu ShippingService.id
  baseRatePerKg: number;
}

// Bảo lưu interface cũ để tránh lỗi tương thích
export interface PriceConfiguration {
  id: number;
  routeId: number;
  carrierId: number;
  commodityTypeId: number;
  shippingTypeId: number;
  basePrice: number;
  pricePerKg: number;
  minWeight: number;
  maxWeight: number;
  effectiveDate: string; // ISO date string
  expiryDate?: string; // ISO date string, optional
}
