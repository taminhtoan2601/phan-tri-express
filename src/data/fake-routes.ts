import type { Route } from '../types/system-configuration';

export const routes: Route[] = [
  // —— Nội địa (VN) ——
  {
    id: 1,
    originCountryId: 1,
    originCityId: 1,
    destinationCountryId: 1,
    destinationCityId: 2,
    zoneId: 1
  },
  {
    id: 2,
    originCountryId: 1,
    originCityId: 2,
    destinationCountryId: 1,
    destinationCityId: 1,
    zoneId: 1
  },

  // —— VN→Asia (SGN→BJS, HAN→TYO) ——
  {
    id: 3,
    originCountryId: 1,
    originCityId: 1,
    destinationCountryId: 2,
    destinationCityId: 3,
    zoneId: 2
  },
  {
    id: 4,
    originCountryId: 1,
    originCityId: 2,
    destinationCountryId: 3,
    destinationCityId: 5,
    zoneId: 2
  },

  // —— VN→Europe (SGN→PAR, HAN→BER) ——
  {
    id: 5,
    originCountryId: 1,
    originCityId: 1,
    destinationCountryId: 5,
    destinationCityId: 9,
    zoneId: 3
  },
  {
    id: 6,
    originCountryId: 1,
    originCityId: 2,
    destinationCountryId: 6,
    destinationCityId: 11,
    zoneId: 3
  },

  // —— VN→North America (SGN→NYC, HAN→TOR) ——
  {
    id: 7,
    originCountryId: 1,
    originCityId: 1,
    destinationCountryId: 9,
    destinationCityId: 17,
    zoneId: 4
  },
  {
    id: 8,
    originCountryId: 1,
    originCityId: 2,
    destinationCountryId: 10,
    destinationCityId: 19,
    zoneId: 4
  },

  // —— VN→South America (SGN→SAO, HAN→BUE) ——
  {
    id: 9,
    originCountryId: 1,
    originCityId: 1,
    destinationCountryId: 12,
    destinationCityId: 23,
    zoneId: 5
  },
  {
    id: 10,
    originCountryId: 1,
    originCityId: 2,
    destinationCountryId: 13,
    destinationCityId: 25,
    zoneId: 5
  },

  // —— VN→Africa (SGN→JNB, HAN→CAY) ——
  {
    id: 11,
    originCountryId: 1,
    originCityId: 1,
    destinationCountryId: 14,
    destinationCityId: 27,
    zoneId: 6
  },
  {
    id: 12,
    originCountryId: 1,
    originCityId: 2,
    destinationCountryId: 15,
    destinationCityId: 29,
    zoneId: 6
  },

  // —— VN→Oceania (SGN→SYD, HAN→AUK) ——
  {
    id: 13,
    originCountryId: 1,
    originCityId: 1,
    destinationCountryId: 17,
    destinationCityId: 33,
    zoneId: 7
  },
  {
    id: 14,
    originCountryId: 1,
    originCityId: 2,
    destinationCountryId: 18,
    destinationCityId: 35,
    zoneId: 7
  }
];
