/**
 * Mock System Configuration API Service
 * Uses direct mock data instead of fetch API calls
 */
import {
  Branch,
  Carrier,
  CommodityType,
  Country,
  City,
  InsurancePackage,
  PaymentType,
  Price,
  Route,
  ShippingType,
  SurchargeType,
  Zone,
  ShippingService
} from '@/types/system-configuration';

import {
  fakeBranches,
  fakeCarriers,
  fakeCommodityTypes,
  fakeCountries,
  fakeCities,
  fakeInsurancePackages,
  fakePaymentTypes,
  fakePrices,
  fakeRoutes,
  fakeShippingTypes,
  fakeZones,
  fakeSurchargeTypes,
  fakeShippingServices
} from '@/constants/mock-system-config';

import { commodityTypes as mockCommodityTypes } from '@/data/fake-commodity-types';
import { shippingTypes as mockShippingTypes } from '@/data/fake-shipping-types';
import { paymentTypes as mockPaymentTypes } from '@/data/fake-payment-types';
import { routes as mockRoutes } from '@/data/fake-routes';
import { carriers as mockCarriers } from '@/data/fake-carriers';
import { insurancePackages as mockInsurancePackages } from '@/data/fake-insurance-packages';
import { surchargeTypes as mockSurchargeTypes } from '@/data/fake-surcharge-types';

// Initialize all mock data stores
const initializeMockData = () => {
  fakeCountries.initialize();
  fakeBranches.initialize();
  fakeCommodityTypes.initialize();
  fakeShippingTypes.initialize();
  fakePaymentTypes.initialize();
  fakeRoutes.initialize();
  fakeCarriers.initialize();
  fakeInsurancePackages.initialize();
  fakePrices.initialize();
  fakeCities.initialize();
  fakeZones.initialize();
  fakeSurchargeTypes.initialize();
};

// Initialize data when this module is imported
initializeMockData();

// Administrative
export async function getCountries(): Promise<Country[]> {
  return fakeCountries.getAll();
}

export async function createCountry(
  country: Omit<Country, 'id'>
): Promise<Country> {
  return fakeCountries.create(country);
}

export async function updateCountry(
  id: number,
  country: Partial<Country>
): Promise<Country> {
  return fakeCountries.update(id, country);
}

export async function deleteCountry(id: number): Promise<void> {
  return fakeCountries.delete(id);
}

// Cities
export async function getCities(): Promise<City[]> {
  return fakeCities.getAll();
}

export async function createCity(city: Omit<City, 'id'>): Promise<City> {
  return fakeCities.create(city);
}

export async function updateCity(
  id: number,
  city: Partial<City>
): Promise<City> {
  return fakeCities.update(id, city);
}

export async function deleteCity(id: number): Promise<void> {
  return fakeCities.delete(id);
}

// Branches
export async function getBranches(): Promise<Branch[]> {
  return fakeBranches.getAll();
}

export async function createBranch(
  branch: Omit<Branch, 'id'>
): Promise<Branch> {
  return fakeBranches.create(branch);
}

export async function updateBranch(
  id: number,
  branch: Partial<Branch>
): Promise<Branch> {
  return fakeBranches.update(id, branch);
}

export async function deleteBranch(id: number): Promise<void> {
  return fakeBranches.delete(id);
}

// Zones
export async function getZones(): Promise<Zone[]> {
  return fakeZones.getAll();
}

export async function createZone(zone: Omit<Zone, 'id'>): Promise<Zone> {
  return fakeZones.create(zone);
}

export async function updateZone(
  id: number,
  zone: Partial<Zone>
): Promise<Zone> {
  return fakeZones.update(id, zone);
}

export async function deleteZone(id: number): Promise<void> {
  return fakeZones.delete(id);
}

// System entities (CommodityTypes, ShippingTypes, PaymentTypes)
export const getCommodityTypes = async (): Promise<CommodityType[]> => {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return mockCommodityTypes;
};

export async function createCommodityType(
  commodityType: Omit<CommodityType, 'id'>
): Promise<CommodityType> {
  return fakeCommodityTypes.create(commodityType);
}

export async function updateCommodityType(
  id: number,
  commodityType: Partial<CommodityType>
): Promise<CommodityType> {
  return fakeCommodityTypes.update(id, commodityType);
}

export async function deleteCommodityType(id: number): Promise<void> {
  return fakeCommodityTypes.delete(id);
}

export const getShippingTypes = async (): Promise<ShippingType[]> => {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return mockShippingTypes;
};

export async function createShippingType(
  shippingType: Omit<ShippingType, 'id'>
): Promise<ShippingType> {
  return fakeShippingTypes.create(shippingType);
}

export async function updateShippingType(
  id: number,
  shippingType: Partial<ShippingType>
): Promise<ShippingType> {
  return fakeShippingTypes.update(id, shippingType);
}

export async function deleteShippingType(id: number): Promise<void> {
  return fakeShippingTypes.delete(id);
}

export const getPaymentTypes = async (): Promise<PaymentType[]> => {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return mockPaymentTypes;
};

export async function createPaymentType(
  paymentType: Omit<PaymentType, 'id'>
): Promise<PaymentType> {
  return fakePaymentTypes.create(paymentType);
}

export async function updatePaymentType(
  id: number,
  paymentType: Partial<PaymentType>
): Promise<PaymentType> {
  return fakePaymentTypes.update(id, paymentType);
}

export async function deletePaymentType(id: number): Promise<void> {
  return fakePaymentTypes.delete(id);
}

// Pricing
export const getRoutes = async (): Promise<Route[]> => {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return mockRoutes;
};

export async function createRoute(route: Omit<Route, 'id'>): Promise<Route> {
  return fakeRoutes.create(route);
}

export async function updateRoute(
  id: number,
  route: Partial<Route>
): Promise<Route> {
  return fakeRoutes.update(id, route);
}

export async function deleteRoute(id: number): Promise<void> {
  return fakeRoutes.delete(id);
}

export const getCarriers = async (): Promise<Carrier[]> => {
  await new Promise((resolve) => setTimeout(resolve, 50)); // Simulate API delay
  return mockCarriers;
};

export const getInsurancePackages = async (): Promise<InsurancePackage[]> => {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return mockInsurancePackages;
};

export async function createCarrier(
  carrier: Omit<Carrier, 'id'>
): Promise<Carrier> {
  return fakeCarriers.create(carrier);
}

export async function updateCarrier(
  id: number,
  carrier: Partial<Carrier>
): Promise<Carrier> {
  return fakeCarriers.update(id, carrier);
}

export async function deleteCarrier(id: number): Promise<void> {
  return fakeCarriers.delete(id);
}

export async function createInsurancePackage(
  insurancePackage: Omit<InsurancePackage, 'id'>
): Promise<InsurancePackage> {
  return fakeInsurancePackages.create(insurancePackage);
}

export async function updateInsurancePackage(
  id: number,
  insurancePackage: Partial<InsurancePackage>
): Promise<InsurancePackage> {
  return fakeInsurancePackages.update(id, insurancePackage);
}

export async function deleteInsurancePackage(id: number): Promise<void> {
  return fakeInsurancePackages.delete(id);
}

export async function getPrices(): Promise<Price[]> {
  return fakePrices.getAll();
}

export async function createPrice(
  priceConfig: Omit<Price, 'id'>
): Promise<Price> {
  return fakePrices.create(priceConfig);
}

export async function updatePrice(
  id: number,
  priceConfig: Partial<Price>
): Promise<Price> {
  return fakePrices.update(id, priceConfig);
}

export async function deletePrice(id: number): Promise<void> {
  return fakePrices.delete(id);
}

export async function getSurchargeTypes(): Promise<SurchargeType[]> {
  return fakeSurchargeTypes.getAll();
}

export async function createSurchargeType(
  surchargeType: Omit<SurchargeType, 'id'>
): Promise<SurchargeType> {
  return fakeSurchargeTypes.create(surchargeType);
}

export async function updateSurchargeType(
  id: number,
  surchargeType: Partial<SurchargeType>
): Promise<SurchargeType> {
  return fakeSurchargeTypes.update(id, surchargeType);
}

export async function deleteSurchargeType(id: number): Promise<void> {
  return fakeSurchargeTypes.delete(id);
}

export async function getShippingServices(): Promise<ShippingService[]> {
  return fakeShippingServices.getAll();
}

export async function createShippingService(
  shippingService: Omit<ShippingService, 'id'>
): Promise<ShippingService> {
  return fakeShippingServices.create(shippingService);
}

export async function updateShippingService(
  id: number,
  shippingService: Partial<ShippingService>
): Promise<ShippingService> {
  return fakeShippingServices.update(id, shippingService);
}

export async function deleteShippingService(id: number): Promise<void> {
  return fakeShippingServices.delete(id);
}
