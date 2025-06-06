import { ShippingOrderStatus } from '@/types/enums';
import { ShippingOrder } from '@/types/shipping-order';

/**
 * - Mặc định branchId = 1, creatorId = 1, paymentTypeId = 1 (tiền mặt chẳng hạn)
 * - Chọn route sao cho carrier hỗ trợ (dựa trên carriers.ts)
 * - Mọi id commodityType, surchargeType, insurancePackage… đều tồn tại.
 */
export const shippingOrders: ShippingOrder[] = [
  /* ============ DRAFT (1-3) ============ */
  makeOrder(1, ShippingOrderStatus.Draft, 1), // Route 1 – FedEx ok
  makeOrder(2, ShippingOrderStatus.Draft, 2), // Route 2 – Vietnam Post ok
  makeOrder(3, ShippingOrderStatus.Draft, 3), // Route 3 – FedEx ok

  /* ===== PENDING FOR APPROVAL (4-6) ===== */
  makeOrder(4, ShippingOrderStatus.PendingForApproval, 4), // Route 4 – DHL ok
  makeOrder(5, ShippingOrderStatus.PendingForApproval, 5), // Route 5 – FedEx ok
  makeOrder(6, ShippingOrderStatus.PendingForApproval, 6), // Route 6 – DHL ok

  /* ============= APPROVED (7-9) ============== */
  makeOrder(7, ShippingOrderStatus.Approved, 7), // Route 7 – FedEx ok
  makeOrder(8, ShippingOrderStatus.Approved, 8), // Route 8 – DHL ok
  makeOrder(9, ShippingOrderStatus.Approved, 9), // Route 9 – FedEx ok

  /* ========= DOCS VERIFIED (10-12) ========= */
  makeOrder(10, ShippingOrderStatus.DocsVerified, 10), // Route 10 – DHL ok
  makeOrder(11, ShippingOrderStatus.DocsVerified, 11), // Route 11 – FedEx ok
  makeOrder(12, ShippingOrderStatus.DocsVerified, 12), // Route 12 – DHL ok

  /* ======= ENTRY IN WAREHOUSE (13-15) ======= */
  makeOrder(13, ShippingOrderStatus.EntryInWarehouse, 13), // Route 13 – Australia Post ok
  makeOrder(14, ShippingOrderStatus.EntryInWarehouse, 14), // Route 14 – Australia Post ok
  makeOrder(15, ShippingOrderStatus.EntryInWarehouse, 1), // nội địa VN, Vietnam Post

  /* ========= READY TO EXPORT (16-18) ========= */
  makeOrder(16, ShippingOrderStatus.ReadyToExport, 3),
  makeOrder(17, ShippingOrderStatus.ReadyToExport, 4),
  makeOrder(18, ShippingOrderStatus.ReadyToExport, 6),

  /* ============ IN TRANSIT (19-21) =========== */
  makeOrder(19, ShippingOrderStatus.InTransit, 7),
  makeOrder(20, ShippingOrderStatus.InTransit, 8),
  makeOrder(21, ShippingOrderStatus.InTransit, 5),

  /* ============ DELIVERED (22-24) ============ */
  makeOrder(22, ShippingOrderStatus.Delivered, 2),
  makeOrder(23, ShippingOrderStatus.Delivered, 11),
  makeOrder(24, ShippingOrderStatus.Delivered, 13),

  /* ============ CANCELLED (25-27) ============ */
  makeOrder(25, ShippingOrderStatus.Cancelled, 9),
  makeOrder(26, ShippingOrderStatus.Cancelled, 10),
  makeOrder(27, ShippingOrderStatus.Cancelled, 14)
];

/* ------------------------------------------------------------------ */
/*  Helper: sinh 1 đơn hợp lệ                                         */
/* ------------------------------------------------------------------ */
function makeOrder(
  id: number,
  status: ShippingOrderStatus,
  routeId: number
): ShippingOrder {
  // ―― Map route → carrier đầu tiên hỗ trợ ――
  const carrierId = findCarrierForRoute(routeId);

  // Lấy vài tham số từ route (để gán city cho người nhận)
  const receiverCityId =
    routeId === 1
      ? 2 // ví dụ SGN→HAN
      : routeId === 2
        ? 1
        : routeId === 3
          ? 3
          : routeId === 4
            ? 5
            : routeId === 5
              ? 9
              : routeId === 6
                ? 11
                : routeId === 7
                  ? 17
                  : routeId === 8
                    ? 19
                    : routeId === 9
                      ? 23
                      : routeId === 10
                        ? 25
                        : routeId === 11
                          ? 27
                          : routeId === 12
                            ? 29
                            : routeId === 13
                              ? 33
                              : routeId === 14
                                ? 35
                                : 2;

  const created = new Date(Date.now() - id * 36e5).toISOString(); // mỗi id cách 1h

  return {
    /* ---------- core ---------- */
    id,
    createdAt: created,
    branchId: 1,
    creatorId: 1,

    shippingTypeId: 1, // Air Freight
    shippingServiceId: 1, // Standard
    paymentTypeId: 1, // giả định Cash

    volumetricDivisor: 5000,

    /* ---------- parties ---------- */
    senderId: 1,
    senderInfo: {
      name: 'Gia Khánh',
      email: 'sender@example.com',
      phone: '0909009000',
      address: '12 Nguyen Hue, District 1',
      cityId: 1, // Ho Chi Minh
      postal: '700000',
      note: ''
    },

    receiverId: 2,
    receiverInfo: {
      name: `Receiver ${id}`,
      email: `rec${id}@example.com`,
      phone: '0911001100',
      address: '221B Baker Street',
      cityId: receiverCityId,
      postal: '100000',
      note: ''
    },

    /* ---------- routing ---------- */
    routeId,
    carrierId,

    /* ---------- goods ---------- */
    goods: [
      {
        id: 1,
        commodityTypeId: 1, // General Cargo
        description: 'Sample goods',
        length: 40,
        width: 30,
        height: 20,
        volume: 0.024,
        weight: 10,
        quantity: 1,
        unitPrice: 500000
      }
    ],

    /* ---------- surcharge & insurance ---------- */
    surcharges: id % 2 ? [{ surchargeTypeId: 1, amount: 50000 }] : undefined,

    insurance: {
      insurancePackageId: 2, // Standard Protection (10 %)
      declaredValue: 2_000_000,
      insuranceFee: 200_000
    },

    /* ---------- misc ---------- */
    barcode: `SO-${id.toString().padStart(6, '0')}`,
    status,
    history: [
      {
        id: 1,
        at: created,
        userId: 1,
        action: 'Order created'
      }
    ],

    totalWeightKg: 10,
    totalVolumeM3: 0.024,
    totalAmount: 500000 + (id % 2 ? 50000 : 0) + 200000
  };
}

/* Tìm carrier đầu tiên chạy được route (dựa trên mock carriers) */
function findCarrierForRoute(routeId: number): number | undefined {
  // Danh sách carriers bạn đã khai báo
  const carrierMap: Record<number, number[]> = {
    1: [1, 3, 5, 10],
    2: [2, 3, 5, 10],
    3: [1, 2, 6],
    4: [2, 4, 6, 7],
    5: [1, 3, 4, 8, 10],
    6: [2, 4, 8],
    7: [1, 3, 6],
    8: [2, 6],
    9: [1, 3],
    10: [2, 4, 7, 8],
    11: [1, 2, 6],
    12: [2, 6],
    13: [9],
    14: [9]
  };
  return carrierMap[routeId]?.[0];
}
