////////////////////////////////////////////////////////////////////////////////
// 🛑 Mock API cho System Configuration Module
////////////////////////////////////////////////////////////////////////////////

import { delay } from './mock-api';

// Import seed data from data directory
import { shippingOrders as seedShippingOrders } from '@/data';
import {
  fakeCountries,
  fakeCities,
  fakePaymentTypes,
  fakeCommodityTypes,
  fakeBranches,
  fakeCarriers,
  fakeInsurancePackages,
  fakePrices,
  fakeShippingTypes,
  fakeShippingServices,
  fakeRoutes,
  fakeSurchargeTypes
} from './mock-system-config';
import {
  Branch,
  Carrier,
  CommodityType,
  InsurancePackage,
  PaymentType,
  ShippingType,
  ShippingService,
  Route,
  SurchargeType,
  City
} from '@/types/system-configuration';
import { ShippingOrder } from '@/types/shipping-order';
// Helpers
const generateId = (): number => Math.floor(Math.random() * 10000) + 1;
const getRandomItem = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)];

// ZONES
export const fakeShippingOrders = {
  records: [] as ShippingOrder[],

  initialize() {
    // Đảm bảo countries đã được khởi tạo trước
    if (fakeCountries.records.length === 0) {
      fakeCountries.initialize();
    }
    if (fakeCities.records.length === 0) {
      fakeCities.initialize();
    }
    if (fakeBranches.records.length === 0) {
      fakeBranches.initialize();
    }
    if (fakeShippingTypes.records.length === 0) {
      fakeShippingTypes.initialize();
    }
    if (fakeShippingServices.records.length === 0) {
      fakeShippingServices.initialize();
    }
    if (fakeCarriers.records.length === 0) {
      fakeCarriers.initialize();
    }
    if (fakeRoutes.records.length === 0) {
      fakeRoutes.initialize();
    }
    if (fakeInsurancePackages.records.length === 0) {
      fakeInsurancePackages.initialize();
    }
    if (fakePrices.records.length === 0) {
      fakePrices.initialize();
    }
    if (fakeSurchargeTypes.records.length === 0) {
      fakeSurchargeTypes.initialize();
    }
    // Sử dụng dữ liệu từ file fake-cities.ts
    this.records = [...seedShippingOrders];
    this.records.forEach((shippingOrder) => {
      shippingOrder.branch = fakeBranches.records.find(
        (branch: Branch) => branch.id === shippingOrder.branchId
      );
      shippingOrder.shippingService = fakeShippingServices.records.find(
        (shippingService: ShippingService) =>
          shippingService.id === shippingOrder.shippingServiceId
      );
      shippingOrder.shippingType = fakeShippingTypes.records.find(
        (shippingType: ShippingType) =>
          shippingType.id === shippingOrder.shippingTypeId
      );
      shippingOrder.paymentType = fakePaymentTypes.records.find(
        (paymentType: PaymentType) =>
          paymentType.id === shippingOrder.paymentTypeId
      );
      shippingOrder.route = fakeRoutes.records.find(
        (route: Route) => route.id === shippingOrder.routeId
      );
      shippingOrder.carrier = fakeCarriers.records.find(
        (carrier: Carrier) => carrier.id === shippingOrder.carrierId
      );
      shippingOrder.surcharges?.forEach((surcharge) => {
        surcharge.surchargeType = fakeSurchargeTypes.records.find(
          (surchargeType: SurchargeType) =>
            surchargeType.id === surcharge.surchargeTypeId
        );
      });
      if (shippingOrder.insurance) {
        shippingOrder.insurance.insurancePackage =
          fakeInsurancePackages.records.find(
            (insurancePackage: InsurancePackage) =>
              insurancePackage.id ===
              shippingOrder.insurance?.insurancePackageId
          );
      }
      shippingOrder.senderInfo.city = fakeCities.records.find(
        (city: City) => city.id === shippingOrder.senderInfo.cityId
      );

      shippingOrder.receiverInfo.city = fakeCities.records.find(
        (city: City) => city.id === shippingOrder.receiverInfo.cityId
      );
      shippingOrder.goods.forEach((good) => {
        good.commodityType = fakeCommodityTypes.records.find(
          (commodityType: CommodityType) =>
            commodityType.id === good.commodityTypeId
        );
      });
    });
  },

  async getAll() {
    await delay(300); // Simulate network delay
    return [...this.records];
  },

  async getById(id: number): Promise<ShippingOrder | undefined> {
    await delay(200);
    return this.records.find((customer) => customer.id === id);
  },

  async create(data: Omit<ShippingOrder, 'id'>): Promise<ShippingOrder> {
    await delay(500);
    const newCustomer = {
      id: generateId(),
      ...data
    };
    this.records.push(newCustomer);
    return newCustomer;
  },

  async update(
    id: number,
    data: Partial<ShippingOrder>
  ): Promise<ShippingOrder> {
    await delay(500);
    const index = this.records.findIndex((customer) => customer.id === id);
    if (index === -1) throw new Error('Customer not found');

    this.records[index] = { ...this.records[index], ...data };
    return this.records[index];
  },

  async delete(id: number): Promise<void> {
    await delay(500);
    const index = this.records.findIndex((customer) => customer.id === id);
    if (index === -1) throw new Error('Customer not found');

    this.records.splice(index, 1);
  }
};
