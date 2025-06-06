////////////////////////////////////////////////////////////////////////////////
// 🛑 Mock API cho System Configuration Module
////////////////////////////////////////////////////////////////////////////////

import { faker } from '@faker-js/faker';
import {
  Branch,
  Carrier,
  City,
  CommodityType,
  Country,
  InsurancePackage,
  PaymentType,
  Price,
  PricingRule,
  Route,
  ShippingService,
  ShippingType,
  SurchargeType,
  Zone
} from '@/types/system-configuration';
import { delay } from './mock-api';

// Import seed data from data directory
import {
  zones as seedZones,
  countries as seedCountries,
  cities as seedCities,
  branches as seedBranches,
  routes as seedRoutes,
  prices as seedPrices,
  pricingRules as seedPricingRules,
  shippingServices as seedShippingServices, // 1
  surchargeTypes as seedSurchargeTypes,
  carriers as seedCarriers,
  insurancePackages as seedInsurancePackages
} from '@/data';

// Helpers
const generateId = (): number => Math.floor(Math.random() * 10000) + 1;
const getRandomItem = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)];

// ZONES
export const fakeZones = {
  records: [] as Zone[],

  initialize() {
    // Sử dụng dữ liệu từ file fake-zones.ts
    this.records = [...seedZones];
  },

  async getAll() {
    await delay(300); // Simulate network delay
    return [...this.records];
  },

  async getById(id: number): Promise<Zone | undefined> {
    await delay(200);
    return this.records.find((zone) => zone.id === id);
  },

  async create(data: Omit<Zone, 'id'>): Promise<Zone> {
    await delay(500);
    const newZone = {
      id: generateId(),
      ...data
    };
    this.records.push(newZone);
    return newZone;
  },

  async update(id: number, data: Partial<Zone>): Promise<Zone> {
    await delay(500);
    const index = this.records.findIndex((zone) => zone.id === id);
    if (index === -1) throw new Error('Zone not found');

    this.records[index] = { ...this.records[index], ...data };
    return this.records[index];
  },

  async delete(id: number): Promise<void> {
    await delay(500);
    const index = this.records.findIndex((zone) => zone.id === id);
    if (index === -1) throw new Error('Zone not found');

    this.records.splice(index, 1);
  }
};

// COUNTRIES
export const fakeCountries = {
  records: [] as Country[],

  initialize() {
    // Sử dụng dữ liệu từ file fake-countries.ts
    this.records = [...seedCountries];

    // Đảm bảo fakeZones đã được khởi tạo trước
    if (fakeZones.records.length === 0) {
      fakeZones.initialize();
    }
  },

  /**
   * Trả về danh sách quốc gia với thông tin zone đã được join
   */
  async getAll() {
    await delay(300); // Simulate network delay

    // Đảm bảo zone data đã được khởi tạo
    if (fakeZones.records.length === 0) {
      fakeZones.initialize();
    }

    // Join country với zone data
    return this.records.map((country) => {
      const zone = fakeZones.records.find((z) => z.id === country.zoneId);
      return {
        ...country,
        zone: zone
      };
    }) as Country[];
  },

  async getById(id: number): Promise<Country | undefined> {
    await delay(200);
    const country = this.records.find((country) => country.id === id);
    if (!country) return undefined;

    // Join với zone data
    const zone = fakeZones.records.find((z) => z.id === country.zoneId);
    return {
      ...country,
      zone
    };
  },

  async create(data: Omit<Country, 'id'>): Promise<Country> {
    await delay(500);
    const newCountry = {
      id: generateId(),
      ...data
    };
    this.records.push(newCountry);

    // Join với zone data
    const zone = fakeZones.records.find((z) => z.id === newCountry.zoneId);
    return {
      ...newCountry,
      zone
    };
  },

  async update(id: number, data: Partial<Country>): Promise<Country> {
    await delay(500);
    const index = this.records.findIndex((country) => country.id === id);
    if (index === -1) throw new Error('Country not found');

    this.records[index] = { ...this.records[index], ...data };

    // Join với zone data
    const updatedCountry = this.records[index];
    const zone = fakeZones.records.find((z) => z.id === updatedCountry.zoneId);
    return {
      ...updatedCountry,
      zone
    };
  },

  async delete(id: number): Promise<void> {
    await delay(500);
    const index = this.records.findIndex((country) => country.id === id);
    if (index === -1) throw new Error('Country not found');

    this.records.splice(index, 1);
  }
};

// CITIES
export const fakeCities = {
  records: [] as City[],

  initialize() {
    // Đảm bảo countries đã được khởi tạo trước
    if (fakeCountries.records.length === 0) {
      fakeCountries.initialize();
    }

    // Sử dụng dữ liệu từ file fake-cities.ts
    this.records = [...seedCities];
    this.records.forEach((city) => {
      city.country = fakeCountries.records.find(
        (country) => country.id === city.countryId
      );
    });
  },

  async getAll() {
    await delay(300);
    return [...this.records];
  },

  async getById(id: number): Promise<City | undefined> {
    await delay(200);
    return this.records.find((city) => city.id === id);
  },

  async getByCountryId(countryId: number): Promise<City[]> {
    await delay(300);
    return this.records.filter((city) => city.countryId === countryId);
  },

  async create(data: Omit<City, 'id'>): Promise<City> {
    await delay(500);
    const newCity = {
      id: generateId(),
      ...data
    };
    this.records.push(newCity);
    return newCity;
  },

  async update(id: number, data: Partial<City>): Promise<City> {
    await delay(500);
    const index = this.records.findIndex((city) => city.id === id);
    if (index === -1) throw new Error('City not found');

    this.records[index] = { ...this.records[index], ...data };
    return this.records[index];
  },

  async delete(id: number): Promise<void> {
    await delay(500);
    const index = this.records.findIndex((city) => city.id === id);
    if (index === -1) throw new Error('City not found');

    this.records.splice(index, 1);
  }
};

// BRANCHES
export const fakeBranches = {
  records: [] as Branch[],

  initialize() {
    // Ensure cities are initialized first
    if (fakeCities.records.length === 0) {
      fakeCities.initialize();
    }

    this.records = [...seedBranches];
    this.records.forEach((branch) => {
      branch.city = fakeCities.records.find(
        (city) => city.id === branch.cityId
      );
    });
  },

  async getAll() {
    await delay(300);
    return [...this.records];
  },

  async getById(id: number): Promise<Branch | undefined> {
    await delay(200);
    return this.records.find((branch) => branch.id === id);
  },

  async create(data: Omit<Branch, 'id'>): Promise<Branch> {
    await delay(500);
    const newBranch = {
      id: generateId(),
      ...data
    };
    this.records.push(newBranch);
    return newBranch;
  },

  async update(id: number, data: Partial<Branch>): Promise<Branch> {
    await delay(500);
    const index = this.records.findIndex((branch) => branch.id === id);
    if (index === -1) throw new Error('Branch not found');

    this.records[index] = { ...this.records[index], ...data };
    return this.records[index];
  },

  async delete(id: number): Promise<void> {
    await delay(500);
    const index = this.records.findIndex((branch) => branch.id === id);
    if (index === -1) throw new Error('Branch not found');

    this.records.splice(index, 1);
  }
};

// COMMODITY TYPES
export const fakeCommodityTypes = {
  records: [] as CommodityType[],

  initialize() {
    const commodityTypeNames = [
      'Electronics',
      'Clothing',
      'Food Items',
      'Medical Supplies',
      'Furniture',
      'Books',
      'Toys',
      'Automotive Parts',
      'Industrial Equipment',
      'Cosmetics'
    ];

    this.records = commodityTypeNames.map((name, index) => ({
      id: index + 1,
      code: name.substring(0, 3).toUpperCase(),
      name
    }));
  },

  async getAll() {
    await delay(300);
    return [...this.records];
  },

  async getById(id: number): Promise<CommodityType | undefined> {
    await delay(200);
    return this.records.find((type) => type.id === id);
  },

  async create(data: Omit<CommodityType, 'id'>): Promise<CommodityType> {
    await delay(500);
    const newType = {
      id: generateId(),
      ...data
    };
    this.records.push(newType);
    return newType;
  },

  async update(
    id: number,
    data: Partial<CommodityType>
  ): Promise<CommodityType> {
    await delay(500);
    const index = this.records.findIndex((type) => type.id === id);
    if (index === -1) throw new Error('Commodity type not found');

    this.records[index] = { ...this.records[index], ...data };
    return this.records[index];
  },

  async delete(id: number): Promise<void> {
    await delay(500);
    const index = this.records.findIndex((type) => type.id === id);
    if (index === -1) throw new Error('Commodity type not found');

    this.records.splice(index, 1);
  }
};

// SHIPPING TYPES
export const fakeShippingTypes = {
  records: [] as ShippingType[],

  initialize() {
    const shippingTypeNames = [
      'Express',
      'Standard',
      'Economy',
      'Next Day',
      'Two-Day',
      'International Priority',
      'Ground',
      'Air Freight',
      'Sea Freight',
      'Special Handling'
    ];

    this.records = shippingTypeNames.map((name, index) => ({
      id: index + 1,
      code: name.substring(0, 3).toUpperCase(),
      name
    }));
  },

  async getAll() {
    await delay(300);
    return [...this.records];
  },

  async getById(id: number): Promise<ShippingType | undefined> {
    await delay(200);
    return this.records.find((type) => type.id === id);
  },

  async create(data: Omit<ShippingType, 'id'>): Promise<ShippingType> {
    await delay(500);
    const newType = {
      id: generateId(),
      ...data
    };
    this.records.push(newType);
    return newType;
  },

  async update(id: number, data: Partial<ShippingType>): Promise<ShippingType> {
    await delay(500);
    const index = this.records.findIndex((type) => type.id === id);
    if (index === -1) throw new Error('Shipping type not found');

    this.records[index] = { ...this.records[index], ...data };
    return this.records[index];
  },

  async delete(id: number): Promise<void> {
    await delay(500);
    const index = this.records.findIndex((type) => type.id === id);
    if (index === -1) throw new Error('Shipping type not found');

    this.records.splice(index, 1);
  }
};

// PAYMENT TYPES
export const fakePaymentTypes = {
  records: [] as PaymentType[],

  initialize() {
    const paymentTypeNames = [
      'COD',
      'Bank Transfer',
      'Credit Card',
      'Debit Card',
      'PayPal',
      'Crypto',
      'Apple Pay',
      'Google Pay',
      'Invoice',
      'Check'
    ];

    this.records = paymentTypeNames.map((name, index) => ({
      id: index + 1,
      code: name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase(),
      name
    }));
  },

  async getAll() {
    await delay(300);
    return [...this.records];
  },

  async getById(id: number): Promise<PaymentType | undefined> {
    await delay(200);
    return this.records.find((type) => type.id === id);
  },

  async create(data: Omit<PaymentType, 'id'>): Promise<PaymentType> {
    await delay(500);
    const newType = {
      id: generateId(),
      ...data
    };
    this.records.push(newType);
    return newType;
  },

  async update(id: number, data: Partial<PaymentType>): Promise<PaymentType> {
    await delay(500);
    const index = this.records.findIndex((type) => type.id === id);
    if (index === -1) throw new Error('Payment type not found');

    this.records[index] = { ...this.records[index], ...data };
    return this.records[index];
  },

  async delete(id: number): Promise<void> {
    await delay(500);
    const index = this.records.findIndex((type) => type.id === id);
    if (index === -1) throw new Error('Payment type not found');

    this.records.splice(index, 1);
  }
};

// CARRIERS
export const fakeCarriers = {
  records: [] as Carrier[],

  initialize() {
    if (fakeRoutes.records.length === 0) {
      fakeRoutes.initialize();
    }

    // Đồng bộ với dữ liệu từ seed nếu có
    if (seedCarriers && seedCarriers.length > 0) {
      this.records = [...seedCarriers];
    }

    this.records.forEach((carrier) => {
      carrier.routes = fakeRoutes.records.filter((route) =>
        carrier.routeIds.includes(route.id)
      );
    });
  },

  async getAll() {
    await delay(300);
    return [...this.records];
  },

  async getById(id: number): Promise<Carrier | undefined> {
    await delay(200);
    return this.records.find((carrier) => carrier.id === id);
  },

  async create(data: Omit<Carrier, 'id'>): Promise<Carrier> {
    await delay(500);
    const newCarrier = {
      id: generateId(),
      ...data
    };
    this.records.push(newCarrier);
    return newCarrier;
  },

  async update(id: number, data: Partial<Carrier>): Promise<Carrier> {
    await delay(500);
    const index = this.records.findIndex((carrier) => carrier.id === id);
    if (index === -1) throw new Error('Carrier not found');

    this.records[index] = { ...this.records[index], ...data };
    return this.records[index];
  },

  async delete(id: number): Promise<void> {
    await delay(500);
    const index = this.records.findIndex((carrier) => carrier.id === id);
    if (index === -1) throw new Error('Carrier not found');

    this.records.splice(index, 1);
  }
};

// ROUTES
export const fakeRoutes = {
  records: [] as Route[],

  initialize() {
    // Đảm bảo countries và cities đã được khởi tạo trước
    if (fakeCountries.records.length === 0) {
      fakeCountries.initialize();
    }
    if (fakeCities.records.length === 0) {
      fakeCities.initialize();
    }
    if (fakeZones.records.length === 0) {
      fakeZones.initialize();
    }

    // Sử dụng dữ liệu từ file fake-routes.ts
    this.records = [...seedRoutes];
    this.records.forEach((route) => {
      route.zone = fakeZones.records.find((zone) => zone.id === route.zoneId);
      route.originCountry = fakeCountries.records.find(
        (country) => country.id === route.originCountryId
      );
      route.originCity = fakeCities.records.find(
        (city) => city.id === route.originCityId
      );
      route.destinationCountry = fakeCountries.records.find(
        (country) => country.id === route.destinationCountryId
      );
      route.destinationCity = fakeCities.records.find(
        (city) => city.id === route.destinationCityId
      );
    });
  },

  async getAll() {
    await delay(300);
    return [...this.records];
  },

  async getById(id: number): Promise<Route | undefined> {
    await delay(200);
    return this.records.find((route) => route.id === id);
  },

  async create(data: Omit<Route, 'id'>): Promise<Route> {
    await delay(500);
    const newRoute = {
      id: generateId(),
      ...data
    };
    this.records.push(newRoute);
    return newRoute;
  },

  async update(id: number, data: Partial<Route>): Promise<Route> {
    await delay(500);
    const index = this.records.findIndex((route) => route.id === id);
    if (index === -1) throw new Error('Route not found');

    this.records[index] = { ...this.records[index], ...data };
    return this.records[index];
  },

  async delete(id: number): Promise<void> {
    await delay(500);
    const index = this.records.findIndex((route) => route.id === id);
    if (index === -1) throw new Error('Route not found');

    this.records.splice(index, 1);
  }
};

// SHIPPING SERVICES
export const fakeShippingServices = {
  records: [] as ShippingService[],

  initialize() {
    // Sử dụng dữ liệu từ file fake-shipping-services.ts
    this.records = [...seedShippingServices];
  },

  async getAll() {
    await delay(300);
    return [...this.records];
  },

  async getById(id: number): Promise<ShippingService | undefined> {
    await delay(200);
    return this.records.find((service) => service.id === id);
  },

  async create(data: Omit<ShippingService, 'id'>): Promise<ShippingService> {
    await delay(500);
    const newService = {
      id: generateId(),
      ...data
    };
    this.records.push(newService);
    return newService;
  },

  async update(
    id: number,
    data: Partial<ShippingService>
  ): Promise<ShippingService> {
    await delay(500);
    const index = this.records.findIndex((service) => service.id === id);
    if (index === -1) throw new Error('Service not found');

    this.records[index] = { ...this.records[index], ...data };
    return this.records[index];
  },

  async delete(id: number): Promise<void> {
    await delay(500);
    const index = this.records.findIndex((service) => service.id === id);
    if (index === -1) throw new Error('Service not found');

    this.records.splice(index, 1);
  }
};

// PRICING RULES
export const fakePricingRules = {
  records: [] as PricingRule[],

  initialize() {
    // Sử dụng dữ liệu từ file fake-pricing-rules.ts
    this.records = [...seedPricingRules];
  },

  async getAll() {
    await delay(300);
    return [...this.records];
  },

  async getById(id: number): Promise<PricingRule | undefined> {
    await delay(200);
    return this.records.find((rule) => rule.id === id);
  },

  async create(data: Omit<PricingRule, 'id'>): Promise<PricingRule> {
    await delay(500);
    const newRule = {
      id: generateId(),
      ...data
    };
    this.records.push(newRule);
    return newRule;
  },

  async update(id: number, data: Partial<PricingRule>): Promise<PricingRule> {
    await delay(500);
    const index = this.records.findIndex((rule) => rule.id === id);
    if (index === -1) throw new Error('Rule not found');

    this.records[index] = { ...this.records[index], ...data };
    return this.records[index];
  },

  async delete(id: number): Promise<void> {
    await delay(500);
    const index = this.records.findIndex((rule) => rule.id === id);
    if (index === -1) throw new Error('Rule not found');

    this.records.splice(index, 1);
  }
};

// PRICES (NEW MODEL)
export const fakePrices = {
  records: [] as Price[],

  initialize() {
    // Đảm bảo routes và services đã được khởi tạo trước
    if (fakeRoutes.records.length === 0) {
      fakeRoutes.initialize();
    }
    if (fakeShippingServices.records.length === 0) {
      fakeShippingServices.initialize();
    }

    // Sử dụng dữ liệu từ file fake-prices.ts
    this.records = [...seedPrices];
    this.records.forEach((price) => {
      price.route = fakeRoutes.records.find(
        (route) => route.id === price.routeId
      );
      price.shippingService = fakeShippingServices.records.find(
        (service) => service.id === price.shippingServiceId
      );
    });
  },

  async getAll() {
    await delay(300);
    return [...this.records];
  },

  async getById(id: number): Promise<Price | undefined> {
    await delay(200);
    return this.records.find((price) => price.id === id);
  },

  async create(data: Omit<Price, 'id'>): Promise<Price> {
    await delay(500);
    const newPrice = {
      id: generateId(),
      ...data
    };
    this.records.push(newPrice);
    return newPrice;
  },

  async update(id: number, data: Partial<Price>): Promise<Price> {
    await delay(500);
    const index = this.records.findIndex((price) => price.id === id);
    if (index === -1) throw new Error('Price not found');

    this.records[index] = { ...this.records[index], ...data };
    return this.records[index];
  },

  async delete(id: number): Promise<void> {
    await delay(500);
    const index = this.records.findIndex((price) => price.id === id);
    if (index === -1) throw new Error('Price not found');

    this.records.splice(index, 1);
  }
};

// INSURANCE PACKAGES
export const fakeInsurancePackages = {
  records: [] as InsurancePackage[],

  initialize() {
    const packageNames = [
      'Basic Coverage',
      'Standard Protection',
      'Premium Insurance',
      'Full Value Coverage',
      'Limited Liability',
      'Deluxe Package',
      'Express Insurance',
      'International Coverage',
      'Special Items Protection',
      'Electronics Insurance'
    ];

    this.records = packageNames.map((name, index) => ({
      id: index + 1,
      name,
      rate: parseFloat((Math.random() * 0.1 + 0.01).toFixed(4)), // 1% to 11% rate
      activeDate: faker.date.past({ years: 1 }).toISOString().split('T')[0] // ISO date format YYYY-MM-DD
    }));

    // Đồng bộ với dữ liệu từ seed nếu có
    if (seedInsurancePackages && seedInsurancePackages.length > 0) {
      this.records = [...seedInsurancePackages];
    }
  },

  async getAll() {
    await delay(300);
    return [...this.records];
  },

  async getById(id: number): Promise<InsurancePackage | undefined> {
    await delay(200);
    return this.records.find((pkg) => pkg.id === id);
  },

  async create(data: Omit<InsurancePackage, 'id'>): Promise<InsurancePackage> {
    await delay(500);
    const newPackage = {
      id: generateId(),
      ...data
    };
    this.records.push(newPackage);
    return newPackage;
  },

  async update(
    id: number,
    data: Partial<InsurancePackage>
  ): Promise<InsurancePackage> {
    await delay(500);
    const index = this.records.findIndex((pkg) => pkg.id === id);
    if (index === -1) throw new Error('Insurance package not found');

    this.records[index] = { ...this.records[index], ...data };
    return this.records[index];
  },

  async delete(id: number): Promise<void> {
    await delay(500);
    const index = this.records.findIndex((pkg) => pkg.id === id);
    if (index === -1) throw new Error('Insurance package not found');

    this.records.splice(index, 1);
  }
};

// Surcharge Types
export const fakeSurchargeTypes = {
  records: [] as SurchargeType[],

  initialize() {
    // Sử dụng dữ liệu từ file fake-surcharge-types.ts
    this.records = [...seedSurchargeTypes];
  },

  async getAll() {
    await delay(300); // Simulate network delay
    return [...this.records];
  },

  async getById(id: number): Promise<SurchargeType | undefined> {
    await delay(200);
    return this.records.find((surchargeType) => surchargeType.id === id);
  },

  async create(data: Omit<SurchargeType, 'id'>): Promise<SurchargeType> {
    await delay(500);
    const newSurchargeType = {
      id: generateId(),
      ...data
    };
    this.records.push(newSurchargeType);
    return newSurchargeType;
  },

  async update(
    id: number,
    data: Partial<SurchargeType>
  ): Promise<SurchargeType> {
    await delay(500);
    const index = this.records.findIndex(
      (surchargeType) => surchargeType.id === id
    );
    if (index === -1) throw new Error('Surcharge type not found');

    this.records[index] = { ...this.records[index], ...data };
    return this.records[index];
  },

  async delete(id: number): Promise<void> {
    await delay(500);
    const index = this.records.findIndex(
      (surchargeType) => surchargeType.id === id
    );
    if (index === -1) throw new Error('Surcharge type not found');

    this.records.splice(index, 1);
  }
};

// Initialize all mock data
export function initializeSystemConfigData() {
  fakeZones.initialize();
  fakeCountries.initialize();
  fakeCities.initialize();
  fakeBranches.initialize();
  fakeCommodityTypes.initialize();
  fakeShippingTypes.initialize();
  fakePaymentTypes.initialize();
  fakeShippingServices.initialize();
  fakePricingRules.initialize();
  fakeRoutes.initialize();
  fakeCarriers.initialize();
  fakeInsurancePackages.initialize();
  fakePrices.initialize();
  fakeSurchargeTypes.initialize();
}
