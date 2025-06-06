import { ShippingOrderStatus } from './enums';
import type {
  Branch,
  CommodityType, // Imported, will be re-exported
  ShippingType,
  PaymentType,
  Route,
  Carrier,
  City,
  Country,
  SurchargeType,
  InsurancePackage,
  ShippingService
} from './system-configuration';

export type { CommodityType }; // Re-exporting CommodityType

/**
 * Represents an item of goods in a shipping order.
 */
export interface GoodsItem {
  id: number;
  commodityTypeId: number;
  commodityType?: CommodityType;
  description: string;
  length: number;
  width: number;
  height: number;
  volume: number;
  weight: number;
  quantity: number;
  unitPrice: number; // price per item or per chargeable weight unit
  qualityNote?: string; // Notes on the quality or condition of the goods
}

/**
 * Represents a surcharge applied to a shipping order.
 */
export interface Surcharge {
  surchargeTypeId: number;
  surchargeType?: SurchargeType;
  amount: number;
}

/**
 * Details of insurance for a shipping order.
 * Uses InsurancePackage from system-configuration.
 */
export interface InsuranceDetail {
  insurancePackageId: number;
  insurancePackage?: InsurancePackage;
  declaredValue: number;
  insuranceFee?: number; // Calculated: packageRate * declaredValue
}

/**
 * Represents an entry in the shipping history log.
 */
export interface ShippingHistory {
  id: number;
  at: string; // ISO date-time string when the action occurred
  userId: number; // ID of the user (references User.id)
  // user?: User;       // Optional: populated user object
  action: string; // Description of the action taken
  note?: string; // Optional notes for the history entry
}
export interface SenderReceiver {
  name: string;
  email: string;
  phone: string;
  note?: string;
  cityId: number; // References City.id (number)
  city?: City; // Populated object based on cityId - NOW OPTIONAL
  postal: string;
  address: string;
}
/**
 * Represents a Shipping Order.
 * Uses Branch, ShippingType, PaymentType, Route, Carrier, Customer, GoodsItem, Surcharge, InsuranceDetail.
 */
export interface ShippingOrder {
  id: number; // Unique identifier for the shipping order
  shippingServiceId: number; // ID of the specific shipping service/product used
  shippingService?: ShippingService;
  orderCode?: string; // User-friendly order code, e.g., SO-YYYYMMDD-XXXX
  createdAt: string; // ISO date-time string of creation
  branchId: number;
  branch?: Branch; // Populated object
  creatorId: number; // ID of the user who created the order (references User.id)
  // creator?: User;           // Optional: populated creator User object
  shippingTypeId: number;
  shippingType?: ShippingType; // Populated object
  paymentTypeId: number;
  paymentType?: PaymentType; // Populated object
  volumetricDivisor: number;
  senderId: number;
  senderInfo: SenderReceiver; // Populated object
  receiverId: number;
  receiverInfo: SenderReceiver; // Populated object
  routeId: number;
  route?: Route; // Populated object
  carrierId?: number; // Optional: Carrier might be assigned later
  carrier?: Carrier; // Populated object if carrierId exists
  goods: GoodsItem[];
  surcharges?: Surcharge[]; // Optional surcharges
  insurance?: InsuranceDetail; // Optional insurance details
  barcode?: string; // Barcode for the package, generated at a certain stage
  status: ShippingOrderStatus;
  history: ShippingHistory[]; // Log of actions and status changes
  totalWeightKg?: number; // Total actual weight of all goods in kg
  totalVolumeM3?: number; // Total volume of all goods in m³
  // totalChargeableWeightKg?: number; // Total chargeable weight (could be actual or volumetric)
  totalAmount?: number; // Total cost of the order
}
