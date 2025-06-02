import type { PriceConfiguration } from '../types/system-configuration';

export const priceConfigurations: PriceConfiguration[] = [
  {
    id: 1,
    routeId: 1,
    carrierId: 1,
    commodityTypeId: 1,
    shippingTypeId: 1,
    basePrice: 120.5,
    pricePerKg: 5.25,
    minWeight: 1,
    maxWeight: 50,
    effectiveDate: '2023-01-01'
  },
  {
    id: 2,
    routeId: 1,
    carrierId: 3,
    commodityTypeId: 2,
    shippingTypeId: 2,
    basePrice: 115.75,
    pricePerKg: 4.8,
    minWeight: 1,
    maxWeight: 45,
    effectiveDate: '2023-01-01'
  },
  {
    id: 3,
    routeId: 2,
    carrierId: 2,
    commodityTypeId: 1,
    shippingTypeId: 3,
    basePrice: 110.25,
    pricePerKg: 4.5,
    minWeight: 1,
    maxWeight: 40,
    effectiveDate: '2023-01-01'
  },
  {
    id: 4,
    routeId: 2,
    carrierId: 5,
    commodityTypeId: 3,
    shippingTypeId: 1,
    basePrice: 105.0,
    pricePerKg: 4.25,
    minWeight: 1,
    maxWeight: 35,
    effectiveDate: '2023-01-01'
  },
  {
    id: 5,
    routeId: 3,
    carrierId: 1,
    commodityTypeId: 4,
    shippingTypeId: 2,
    basePrice: 250.0,
    pricePerKg: 8.5,
    minWeight: 2,
    maxWeight: 60,
    effectiveDate: '2023-01-01'
  },
  {
    id: 6,
    routeId: 3,
    carrierId: 4,
    commodityTypeId: 5,
    shippingTypeId: 3,
    basePrice: 245.5,
    pricePerKg: 8.25,
    minWeight: 2,
    maxWeight: 55,
    effectiveDate: '2023-01-01'
  },
  {
    id: 7,
    routeId: 4,
    carrierId: 2,
    commodityTypeId: 1,
    shippingTypeId: 4,
    basePrice: 235.75,
    pricePerKg: 7.9,
    minWeight: 2,
    maxWeight: 50,
    effectiveDate: '2023-01-01'
  },
  {
    id: 8,
    routeId: 4,
    carrierId: 6,
    commodityTypeId: 2,
    shippingTypeId: 5,
    basePrice: 230.0,
    pricePerKg: 7.75,
    minWeight: 2,
    maxWeight: 45,
    effectiveDate: '2023-01-01'
  },
  {
    id: 9,
    routeId: 5,
    carrierId: 1,
    commodityTypeId: 3,
    shippingTypeId: 1,
    basePrice: 450.0,
    pricePerKg: 12.5,
    minWeight: 3,
    maxWeight: 70,
    effectiveDate: '2023-01-01'
  },
  {
    id: 10,
    routeId: 5,
    carrierId: 3,
    commodityTypeId: 4,
    shippingTypeId: 2,
    basePrice: 445.25,
    pricePerKg: 12.25,
    minWeight: 3,
    maxWeight: 65,
    effectiveDate: '2023-01-01'
  }
];
