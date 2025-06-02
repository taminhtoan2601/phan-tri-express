import type { City } from '../types/system-configuration';

export const cities: City[] = [
  // ===== Asia =====
  { id: 1, code: 'VNSGN', name: 'Ho Chi Minh', countryId: 1 }, // VN.id = 1
  { id: 2, code: 'VNHAN', name: 'Hanoi', countryId: 1 },
  { id: 3, code: 'CNBJS', name: 'Beijing', countryId: 2 }, // CN.id = 2
  { id: 4, code: 'CNSHA', name: 'Shanghai', countryId: 2 },
  { id: 5, code: 'JPTYO', name: 'Tokyo', countryId: 3 }, // JP.id = 3
  { id: 6, code: 'JPOSA', name: 'Osaka', countryId: 3 },
  { id: 7, code: 'INDEL', name: 'Delhi', countryId: 4 }, // IN.id = 4
  { id: 8, code: 'INBOM', name: 'Mumbai', countryId: 4 },

  // ===== Europe =====
  { id: 9, code: 'FRPAR', name: 'Paris', countryId: 5 }, // FR.id = 5
  { id: 10, code: 'FRLYS', name: 'Lyon', countryId: 5 },
  { id: 11, code: 'DEBER', name: 'Berlin', countryId: 6 }, // DE.id = 6
  { id: 12, code: 'DEMUC', name: 'Munich', countryId: 6 },
  { id: 13, code: 'GBLON', name: 'London', countryId: 7 }, // GB.id = 7
  { id: 14, code: 'GBMAN', name: 'Manchester', countryId: 7 },
  { id: 15, code: 'ITROM', name: 'Rome', countryId: 8 }, // IT.id = 8
  { id: 16, code: 'ITMIL', name: 'Milan', countryId: 8 },

  // ===== North America =====
  { id: 17, code: 'USNYC', name: 'New York', countryId: 9 }, // US.id = 9
  { id: 18, code: 'USLAX', name: 'Los Angeles', countryId: 9 },
  { id: 19, code: 'CATOR', name: 'Toronto', countryId: 10 }, // CA.id = 10
  { id: 20, code: 'CAYVR', name: 'Vancouver', countryId: 10 },
  { id: 21, code: 'MXMEX', name: 'Mexico City', countryId: 11 }, // MX.id = 11
  { id: 22, code: 'MXGDL', name: 'Guadalajara', countryId: 11 },

  // ===== South America =====
  { id: 23, code: 'BRSAO', name: 'Sao Paulo', countryId: 12 }, // BR.id = 12
  { id: 24, code: 'BRRIO', name: 'Rio de Janeiro', countryId: 12 },
  { id: 25, code: 'ARBUE', name: 'Buenos Aires', countryId: 13 }, // AR.id = 13
  { id: 26, code: 'ARCOR', name: 'Cordoba', countryId: 13 },

  // ===== Africa =====
  { id: 27, code: 'ZAJNB', name: 'Johannesburg', countryId: 14 }, // ZA.id = 14
  { id: 28, code: 'ZACPT', name: 'Cape Town', countryId: 14 },
  { id: 29, code: 'EGCAY', name: 'Cairo', countryId: 15 }, // EG.id = 15
  { id: 30, code: 'EGALY', name: 'Alexandria', countryId: 15 },
  { id: 31, code: 'NGLAG', name: 'Lagos', countryId: 16 }, // NG.id = 16
  { id: 32, code: 'NGABV', name: 'Abuja', countryId: 16 },

  // ===== Oceania =====
  { id: 33, code: 'AUSYD', name: 'Sydney', countryId: 17 }, // AU.id = 17
  { id: 34, code: 'AUMEL', name: 'Melbourne', countryId: 17 },
  { id: 35, code: 'NZAUK', name: 'Auckland', countryId: 18 }, // NZ.id = 18
  { id: 36, code: 'NZWLG', name: 'Wellington', countryId: 18 }
];
