import type { Price } from '../types/system-configuration';

export const prices: Price[] = [
  // Route 1 (SGN→HAN)
  {
    id: 1,
    routeId: 1,
    shippingServiceId: 1,
    baseRatePerKg: 100000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },
  {
    id: 2,
    routeId: 1,
    shippingServiceId: 2,
    baseRatePerKg: 100000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },
  {
    id: 3,
    routeId: 1,
    shippingServiceId: 3,
    baseRatePerKg: 100000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },

  // Route 2 (HAN→SGN)
  {
    id: 4,
    routeId: 2,
    shippingServiceId: 1,
    baseRatePerKg: 120000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },
  {
    id: 5,
    routeId: 2,
    shippingServiceId: 2,
    baseRatePerKg: 110000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },
  {
    id: 6,
    routeId: 2,
    shippingServiceId: 3,
    baseRatePerKg: 110000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },

  // Route 3 (SGN→BJS)
  {
    id: 7,
    routeId: 3,
    shippingServiceId: 1,
    baseRatePerKg: 150000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },
  {
    id: 8,
    routeId: 3,
    shippingServiceId: 2,
    baseRatePerKg: 150000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },
  {
    id: 9,
    routeId: 3,
    shippingServiceId: 3,
    baseRatePerKg: 150000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },

  // Route 4 (HAN→TYO)
  {
    id: 10,
    routeId: 4,
    shippingServiceId: 1,
    baseRatePerKg: 140000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },
  {
    id: 11,
    routeId: 4,
    shippingServiceId: 2,
    baseRatePerKg: 140000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },
  {
    id: 12,
    routeId: 4,
    shippingServiceId: 3,
    baseRatePerKg: 140000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },

  // Route 5 (SGN→PAR)
  {
    id: 13,
    routeId: 5,
    shippingServiceId: 1,
    baseRatePerKg: 160000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },
  {
    id: 14,
    routeId: 5,
    shippingServiceId: 2,
    baseRatePerKg: 160000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },
  {
    id: 15,
    routeId: 5,
    shippingServiceId: 3,
    baseRatePerKg: 160000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },

  // Route 6 (HAN→BER)
  {
    id: 16,
    routeId: 6,
    shippingServiceId: 1,
    baseRatePerKg: 75000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },
  {
    id: 17,
    routeId: 6,
    shippingServiceId: 2,
    baseRatePerKg: 75000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },
  {
    id: 18,
    routeId: 6,
    shippingServiceId: 3,
    baseRatePerKg: 75000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },

  // Route 7 (SGN→NYC)
  {
    id: 19,
    routeId: 7,
    shippingServiceId: 1,
    baseRatePerKg: 90000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },
  {
    id: 20,
    routeId: 7,
    shippingServiceId: 2,
    baseRatePerKg: 90000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },
  {
    id: 21,
    routeId: 7,
    shippingServiceId: 3,
    baseRatePerKg: 90000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },

  // Route 8 (HAN→TOR)
  {
    id: 22,
    routeId: 8,
    shippingServiceId: 1,
    baseRatePerKg: 85000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },
  {
    id: 23,
    routeId: 8,
    shippingServiceId: 2,
    baseRatePerKg: 85000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },
  {
    id: 24,
    routeId: 8,
    shippingServiceId: 3,
    baseRatePerKg: 85000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },

  // Route 9 (SGN→SAO)
  {
    id: 25,
    routeId: 9,
    shippingServiceId: 1,
    baseRatePerKg: 70000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },
  {
    id: 26,
    routeId: 9,
    shippingServiceId: 2,
    baseRatePerKg: 70000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },
  {
    id: 27,
    routeId: 9,
    shippingServiceId: 3,
    baseRatePerKg: 70000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },

  // Route 10 (HAN→BUE)
  {
    id: 28,
    routeId: 10,
    shippingServiceId: 1,
    baseRatePerKg: 72000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },
  {
    id: 29,
    routeId: 10,
    shippingServiceId: 2,
    baseRatePerKg: 72000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },
  {
    id: 30,
    routeId: 10,
    shippingServiceId: 3,
    baseRatePerKg: 72000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },

  // Route 11 (SGN→JNB)
  {
    id: 31,
    routeId: 11,
    shippingServiceId: 1,
    baseRatePerKg: 82000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },
  {
    id: 32,
    routeId: 11,
    shippingServiceId: 2,
    baseRatePerKg: 82000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },
  {
    id: 33,
    routeId: 11,
    shippingServiceId: 3,
    baseRatePerKg: 82000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },

  // Route 12 (HAN→CAY)
  {
    id: 34,
    routeId: 12,
    shippingServiceId: 1,
    baseRatePerKg: 80000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },
  {
    id: 35,
    routeId: 12,
    shippingServiceId: 2,
    baseRatePerKg: 80000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },
  {
    id: 36,
    routeId: 12,
    shippingServiceId: 3,
    baseRatePerKg: 80000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },

  // Route 13 (SGN→SYD)
  {
    id: 37,
    routeId: 13,
    shippingServiceId: 1,
    baseRatePerKg: 65000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },
  {
    id: 38,
    routeId: 13,
    shippingServiceId: 2,
    baseRatePerKg: 65000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },
  {
    id: 39,
    routeId: 13,
    shippingServiceId: 3,
    baseRatePerKg: 65000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },

  // Route 14 (HAN→AUK)
  {
    id: 40,
    routeId: 14,
    shippingServiceId: 1,
    baseRatePerKg: 68000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },
  {
    id: 41,
    routeId: 14,
    shippingServiceId: 2,
    baseRatePerKg: 68000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  },
  {
    id: 42,
    routeId: 14,
    shippingServiceId: 3,
    baseRatePerKg: 68000,
    effectiveDate: '2025-01-01',
    deletionDate: ''
  }
];
