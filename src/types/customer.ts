import { City, Country } from './system-configuration';

/**
 * Represents a Customer.
 * Uses Country and City types from system-configuration.
 */
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  note?: string;
  cityId: number; // References City.id (number)
  city?: City; // Populated object based on cityId - NOW OPTIONAL
  postal: string;
  address: string;
}
