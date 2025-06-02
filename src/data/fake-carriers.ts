import type { Carrier } from '../types/system-configuration';

export const carriers: Carrier[] = [
  {
    id: 1,
    name: 'FedEx',
    routeIds: [1, 3, 5, 7, 9]
  },
  {
    id: 2,
    name: 'DHL',
    routeIds: [2, 4, 6, 8, 10]
  },
  {
    id: 3,
    name: 'UPS',
    routeIds: [1, 2, 5, 7, 10]
  },
  {
    id: 4,
    name: 'TNT Express',
    routeIds: [3, 4, 5, 6]
  },
  {
    id: 5,
    name: 'EMS',
    routeIds: [1, 2, 3, 4]
  },
  {
    id: 6,
    name: 'SF Express',
    routeIds: [3, 4, 7, 8]
  },
  {
    id: 7,
    name: 'Japan Post',
    routeIds: [4, 5, 9, 10]
  },
  {
    id: 8,
    name: 'Royal Mail',
    routeIds: [5, 6, 7, 8]
  },
  {
    id: 9,
    name: 'Australia Post',
    routeIds: [8, 9, 10]
  },
  {
    id: 10,
    name: 'Vietnam Post',
    routeIds: [1, 2, 3, 4, 5]
  }
];
