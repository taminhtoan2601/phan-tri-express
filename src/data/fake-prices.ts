import type { Price } from '../types/system-configuration';

export const prices: Price[] = [
  // Route 1 (SGN→HAN)
  { id: 1, routeId: 1, serviceId: 1, baseRatePerKg: 2.0 },
  { id: 2, routeId: 1, serviceId: 2, baseRatePerKg: 2.0 },
  { id: 3, routeId: 1, serviceId: 3, baseRatePerKg: 2.0 },

  // Route 2 (HAN→SGN)
  { id: 4, routeId: 2, serviceId: 1, baseRatePerKg: 1.8 },
  { id: 5, routeId: 2, serviceId: 2, baseRatePerKg: 1.8 },
  { id: 6, routeId: 2, serviceId: 3, baseRatePerKg: 1.8 },

  // Route 3 (SGN→BJS)
  { id: 7, routeId: 3, serviceId: 1, baseRatePerKg: 5.0 },
  { id: 8, routeId: 3, serviceId: 2, baseRatePerKg: 5.0 },
  { id: 9, routeId: 3, serviceId: 3, baseRatePerKg: 5.0 },

  // Route 4 (HAN→TYO)
  { id: 10, routeId: 4, serviceId: 1, baseRatePerKg: 4.5 },
  { id: 11, routeId: 4, serviceId: 2, baseRatePerKg: 4.5 },
  { id: 12, routeId: 4, serviceId: 3, baseRatePerKg: 4.5 },

  // Route 5 (SGN→PAR)
  { id: 13, routeId: 5, serviceId: 1, baseRatePerKg: 8.0 },
  { id: 14, routeId: 5, serviceId: 2, baseRatePerKg: 8.0 },
  { id: 15, routeId: 5, serviceId: 3, baseRatePerKg: 8.0 },

  // Route 6 (HAN→BER)
  { id: 16, routeId: 6, serviceId: 1, baseRatePerKg: 7.5 },
  { id: 17, routeId: 6, serviceId: 2, baseRatePerKg: 7.5 },
  { id: 18, routeId: 6, serviceId: 3, baseRatePerKg: 7.5 },

  // Route 7 (SGN→NYC)
  { id: 19, routeId: 7, serviceId: 1, baseRatePerKg: 9.0 },
  { id: 20, routeId: 7, serviceId: 2, baseRatePerKg: 9.0 },
  { id: 21, routeId: 7, serviceId: 3, baseRatePerKg: 9.0 },

  // Route 8 (HAN→TOR)
  { id: 22, routeId: 8, serviceId: 1, baseRatePerKg: 8.5 },
  { id: 23, routeId: 8, serviceId: 2, baseRatePerKg: 8.5 },
  { id: 24, routeId: 8, serviceId: 3, baseRatePerKg: 8.5 },

  // Route 9 (SGN→SAO)
  { id: 25, routeId: 9, serviceId: 1, baseRatePerKg: 7.0 },
  { id: 26, routeId: 9, serviceId: 2, baseRatePerKg: 7.0 },
  { id: 27, routeId: 9, serviceId: 3, baseRatePerKg: 7.0 },

  // Route 10 (HAN→BUE)
  { id: 28, routeId: 10, serviceId: 1, baseRatePerKg: 7.2 },
  { id: 29, routeId: 10, serviceId: 2, baseRatePerKg: 7.2 },
  { id: 30, routeId: 10, serviceId: 3, baseRatePerKg: 7.2 },

  // Route 11 (SGN→JNB)
  { id: 31, routeId: 11, serviceId: 1, baseRatePerKg: 8.2 },
  { id: 32, routeId: 11, serviceId: 2, baseRatePerKg: 8.2 },
  { id: 33, routeId: 11, serviceId: 3, baseRatePerKg: 8.2 },

  // Route 12 (HAN→CAY)
  { id: 34, routeId: 12, serviceId: 1, baseRatePerKg: 8.0 },
  { id: 35, routeId: 12, serviceId: 2, baseRatePerKg: 8.0 },
  { id: 36, routeId: 12, serviceId: 3, baseRatePerKg: 8.0 },

  // Route 13 (SGN→SYD)
  { id: 37, routeId: 13, serviceId: 1, baseRatePerKg: 6.5 },
  { id: 38, routeId: 13, serviceId: 2, baseRatePerKg: 6.5 },
  { id: 39, routeId: 13, serviceId: 3, baseRatePerKg: 6.5 },

  // Route 14 (HAN→AUK)
  { id: 40, routeId: 14, serviceId: 1, baseRatePerKg: 6.8 },
  { id: 41, routeId: 14, serviceId: 2, baseRatePerKg: 6.8 },
  { id: 42, routeId: 14, serviceId: 3, baseRatePerKg: 6.8 }
];
