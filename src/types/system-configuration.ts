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
  country?: Country;
}

export interface Branch {
  id: number;
  code: string;
  name: string;
  discount: number;
  address: string;
  phone: string;
  cityId: number;
  city?: City;
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
  code: string;
  name: string;
  originCountryId: number; // Tham chiếu Country.id
  originCountry?: Country;
  originCityId: number; // Tham chiếu City.id
  originCity?: City;
  destinationCountryId: number; // Tham chiếu Country.id
  destinationCountry?: Country;
  destinationCityId: number; // Tham chiếu City.id
  destinationCity?: City;
  zoneId: number; // Tham chiếu Zone.id
  zone?: Zone;
}

export interface Carrier {
  id: number;
  name: string;
  routeIds: number[];
  routes?: Route[];
}

export interface SurchargeType {
  id: number;
  name: string; // Example: "Fuel Surcharge", "Remote Area Surcharge"
  description?: string;
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
  route?: Route;
  shippingServiceId: number; // Tham chiếu ShippingService.id
  shippingService?: ShippingService;
  baseRatePerKg: number;
  effectiveDate: string;
  deletionDate?: string;
}
