/**
 * Represents a permission in the system.
 */
export interface Permission {
  id: number;
  key: string;
  description: string;
}

/**
 * Defines the possible roles a user can have.
 */
export type RoleKey =
  | 'order_creator' // Người tạo đơn
  | 'branch_manager' // Quản lý chi nhánh
  | 'branch_accountant' // Kế toán chi nhánh
  | 'warehouse_manager' // Quản lý kho
  | 'admin'; // Quản trị viên

/**
 * Represents a user in the system.
 */
export interface User {
  id: number; // Consistent with ShippingOrder.creatorId and ShippingHistory.userId
  fullName: string;
  email: string;
  roles: RoleKey[];
  status: 'active' | 'inactive';
}
