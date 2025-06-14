/**
 * System Configuration API Service
 * Using direct mock data instead of fetch API calls
 */
import {
  Branch,
  Carrier,
  City,
  CommodityType,
  Country,
  InsurancePackage,
  PaymentType,
  Route,
  ShippingType,
  ShippingService,
  Zone,
  Price
} from '@/types/system-configuration';

import {
  fakeBranches,
  fakeCarriers,
  fakeCities,
  fakeCommodityTypes,
  fakeCountries,
  fakeInsurancePackages,
  fakePaymentTypes,
  fakePrices,
  fakeRoutes,
  fakeShippingServices,
  fakeShippingTypes,
  fakeZones
} from '@/constants/mock-system-config';

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
  fakeShippingServices.initialize();
  fakeZones.initialize();
};

// Initialize data when this module is imported
initializeMockData();

// Administrative
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

// System entities (CommodityTypes, ShippingTypes, PaymentTypes)
export async function getCommodityTypes(): Promise<CommodityType[]> {
  return fakeCommodityTypes.getAll();
}

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

export async function getShippingTypes(): Promise<ShippingType[]> {
  return fakeShippingTypes.getAll();
}

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

export async function getPaymentTypes(): Promise<PaymentType[]> {
  return fakePaymentTypes.getAll();
}

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
export async function getRoutes(): Promise<Route[]> {
  return fakeRoutes.getAll();
}

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

export async function getCarriers(): Promise<Carrier[]> {
  return fakeCarriers.getAll();
}

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

export async function getInsurancePackages(): Promise<InsurancePackage[]> {
  return fakeInsurancePackages.getAll();
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

export async function createPrice(price: Omit<Price, 'id'>): Promise<Price> {
  return fakePrices.create(price);
}

export async function updatePrice(
  id: number,
  price: Partial<Price>
): Promise<Price> {
  return fakePrices.update(id, price);
}

export async function deletePrice(id: number): Promise<void> {
  return fakePrices.delete(id);
}
