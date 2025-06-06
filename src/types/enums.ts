/**
 * Defines the possible statuses of a shipping order.
 */
export enum ShippingOrderStatus {
  Draft = 0, // Đơn nháp, chưa gửi đi
  PendingForApproval = 1, // Chờ duyệt
  Approved = 2, // Đã duyệt
  DocsVerified = 3, // Chứng từ đã xác minh
  EntryInWarehouse = 4, // Hàng đã nhập kho
  ReadyToExport = 5, // Sẵn sàng xuất kho
  InTransit = 6, // Đang vận chuyển
  Delivered = 7, // Đã giao hàng
  Cancelled = 8 // Đã hủy
}
