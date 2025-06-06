import type { Route } from '../types/system-configuration';

export const routes: Route[] = [
  // —— Nội địa (VN) ——
  {
    id: 1,
    originCountryId: 1,
    originCityId: 1,
    destinationCountryId: 1,
    destinationCityId: 2,
    zoneId: 1,
    code: 'HCM-HAN',
    name: 'Hồ Chí Minh - Hà Nội'
  },
  {
    id: 2,
    originCountryId: 1,
    originCityId: 2,
    destinationCountryId: 1,
    destinationCityId: 1,
    zoneId: 1,
    code: 'HAN-HCM',
    name: 'Hà Nội - Hồ Chí Minh'
  },

  // —— VN→Asia (SGN→BJS, HAN→TYO) ——
  {
    id: 3,
    originCountryId: 1,
    originCityId: 1,
    destinationCountryId: 2,
    destinationCityId: 3,
    zoneId: 2,
    code: 'HCM-BJS',
    name: 'Hồ Chí Minh - Bắc Kinh'
  },
  {
    id: 4,
    originCountryId: 1,
    originCityId: 2,
    destinationCountryId: 3,
    destinationCityId: 5,
    zoneId: 2,
    code: 'HCM-TYO',
    name: 'Hồ Chí Minh - Tokyo'
  },

  // —— VN→Europe (SGN→PAR, HAN→BER) ——
  {
    id: 5,
    originCountryId: 1,
    originCityId: 1,
    destinationCountryId: 5,
    destinationCityId: 9,
    zoneId: 3,
    code: 'HCM-PAR',
    name: 'Hồ Chí Minh - Paris'
  },
  {
    id: 6,
    originCountryId: 1,
    originCityId: 2,
    destinationCountryId: 6,
    destinationCityId: 11,
    zoneId: 3,
    code: 'HCM-BER',
    name: 'Hồ Chí Minh - Berlin'
  },

  // —— VN→North America (SGN→NYC, HAN→TOR) ——
  {
    id: 7,
    originCountryId: 1,
    originCityId: 1,
    destinationCountryId: 9,
    destinationCityId: 17,
    zoneId: 4,
    code: 'HCM-NYC',
    name: 'Hồ Chí Minh - New York'
  },
  {
    id: 8,
    originCountryId: 1,
    originCityId: 2,
    destinationCountryId: 10,
    destinationCityId: 19,
    zoneId: 4,
    code: 'HCM-TOR',
    name: 'Hồ Chí Minh - Toronto'
  },

  // —— VN→South America (SGN→SAO, HAN→BUE) ——
  {
    id: 9,
    originCountryId: 1,
    originCityId: 1,
    destinationCountryId: 12,
    destinationCityId: 23,
    zoneId: 5,
    code: 'HCM-SA',
    name: 'Hồ Chí Minh - São Paulo'
  },
  {
    id: 10,
    originCountryId: 1,
    originCityId: 2,
    destinationCountryId: 13,
    destinationCityId: 25,
    zoneId: 5,
    code: 'HCM-BUE',
    name: 'Hồ Chí Minh - Buenos Aires'
  },

  // —— VN→Africa (SGN→JNB, HAN→CAY) ——
  {
    id: 11,
    originCountryId: 1,
    originCityId: 1,
    destinationCountryId: 14,
    destinationCityId: 27,
    zoneId: 6,
    code: 'HCM-JNB',
    name: 'Hồ Chí Minh - Johannesburg'
  },
  {
    id: 12,
    originCountryId: 1,
    originCityId: 2,
    destinationCountryId: 15,
    destinationCityId: 29,
    zoneId: 6,
    code: 'HCM-CAY',
    name: 'Hồ Chí Minh - Cairo'
  },

  // —— VN→Oceania (SGN→SYD, HAN→AUK) ——
  {
    id: 13,
    originCountryId: 1,
    originCityId: 1,
    destinationCountryId: 17,
    destinationCityId: 33,
    zoneId: 7,
    code: 'HCM-SYD',
    name: 'Hồ Chí Minh - Sydney'
  },
  {
    id: 14,
    originCountryId: 1,
    originCityId: 2,
    destinationCountryId: 18,
    destinationCityId: 35,
    zoneId: 7,
    code: 'HCM-AUK',
    name: 'Hồ Chí Minh - Auckland'
  }
];
