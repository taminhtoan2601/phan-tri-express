# Phan Tri Express — Front‑end Architecture **(final consolidated)**

> **Ngày cập nhật:** 2 Jun 2025

---

## 0. Quy ước chung

* **source** – nơi lấy dữ liệu (Zustand store, mock‑server, form‑state …)
* **rules**  – validation, điều kiện hiển thị, business‑logic
* **columns** – đối với bảng
* **fields**  – đối với form/wizard/drawer

```
src/
├── app/              # Next.js App Router (routes)
├── components/       # Re‑usable layout + UI (shadcn)
├── features/         # Domain‑driven code (shipping, admin…)
├── hooks/            # Custom hooks cross‑feature
├── stores/           # Zustand state
├── lib/              # Pure helpers, mock‑server, utils
├── constants/        # Static nav & misc.
├── types/            # Global TS interfaces & enums
└── tests/            # Vitest + Playwright
```

---

## 1. Dashboard module

### 1.1 `src/app/(dashboard)/layout.tsx`

* **Mục đích** : khung tổng quát (Sidebar + Topbar + ErrorBoundary).
* **Thư viện** : `@/components/layout/*`, `@sentry/nextjs`, Clerk.
* **Liên quan** : constants/navItems.ts, hooks/useSidebarState.
* **Bước** : Auth ⟶ Sidebar ⟶ Topbar ⟶ `<ErrorBoundary>`.

### 1.2 `src/app/(dashboard)/page.tsx`

* **widgets / fields** : `todayOrders`, `todayRevenue`, `pendingApproval`, `delayedRoutes` (source: `/stats/*`).
* **rules** : skeleton 1.5 s, 0→tooltip khi API lỗi.

### 1.3 `src/app/(dashboard)/reports/page.tsx`

* **filters** : `dateFrom`, `dateTo`, `branchId`, `status` multi‑select.
* **table columns** : `id`, `createdAt`, `office`, `route`, `value`, `status`.
* **rules** : Export CSV via PapaParse; warn >10 k rows.

---

## 2. Shipping module

Trạng thái luồng: `draft → pending_branch → approved_branch → docs_verified → ready_to_ship → in_transit → delivered` (enum `ShippingStatus`).

### 2.1  Tạo đơn – `src/app/(shipping)/new/page.tsx`

Wizard 5 bước, dành cho **Order Creator**.

**Bước 1 – Thông tin chung**
• `createdAt` (auto ISO)
• `creatorId` (từ Clerk)
• `officeId` — *Select* (`GET /branches`) **required**
• `transportTypeId` — *Select* (`GET /shipping-types`)
• `paymentTypeId` — *Select* (`GET /payment-types`)
• `branchDiscount` — auto điền từ `officeId`.

**Bước 2 – Khách gửi**
• `senderPhone` → search `GET /customers?phone=` (debounce 400 ms). Nếu tìm thấy → khoá các trường phía dưới (có nút **Update** để mở).
• `senderName`, `note`
• `countryId` (*Select* `/countries`), `city`, `postal`, `address`.
*Validation*: phone regex, name required.

**Bước 3 – Khách nhận**
• `receiverId` — dropdown `/customers/{senderId}/recipients` **hoặc**
• Tự nhập: `receiverName`, `phone`, `countryId`, `city`, `postal`, `address`.

**Bước 4 – Hàng hoá & Chi phí**
Mỗi kiện (`GoodsItem`) gồm:
`commodityTypeId` (*Select* `/commodity-types`), `description`, `length`, `width`, `height`, `weight`, `quantity`, **`unitPrice (auto)`**.

*Thuật toán tính `unitPrice`:*

1. **DIMWeight** = (length × width × height) / *coefficient*.
      • *coefficient* = 5 000 khi `transportTypeId = AIR`; 6 000 khi SEA/xa.
2. Làm tròn DIMWeight tới 0,5 kg; thể tích CBM làm tròn 0,1.
3. **ChargeableWeight** = `max(DIMWeight, actual weight)`.
4. Nếu cùng **customer + receiver address**, *cộng gộp* ChargeableWeight trước khi so sánh bước 3.
5. `carrierRate` lấy từ `GET /tariffs?carrierId={carrierId}&routeId={routeId}`.
6. `unitPrice` = `ChargeableWeight × carrierRate` (hiển thị currency).
7. Bảng hiển thị realtime các cột *Volume*, *ChargeableWeight*, *unitPrice*, *lineTotal*.

Thêm:
• **Surcharge** array: `reason` (select), `amount` (currency).
• **Insurance**: `declaredValue`, `packageId` (*Select* `/insurance?active=true`) ⇒ `insuranceFee = declaredValue × rate%`.

**Bước 5 – Xác nhận**
Hiển thị tổng chi phí & thanh toán. Checkbox **Đã thanh toán** (bắt buộc nếu paymentType != COD).
Nhấn **Lưu Nháp** ⇒ `POST /shipping` (status `draft`) ➜ redirect list.

---

### 2.2  Danh sách Nháp – `src/app/(shipping)/list/page.tsx`

*Chỉ hiển thị* đơn `status = draft` của **Order Creator** hiện tại.
Filters: `search`, `routeId`, `officeId`.
Columns: ID • createdAt • receiverName • route • value • actions (Edit; **Confirm** → PATCH `/shipping/:id` status `pending_branch`; Delete).
Pagination 20/50/100 via Nuqs.

---

### 2.3  Duyệt chi nhánh – `src/app/(shipping)/approvals/branch/page.tsx`

Vai trò **Branch Manager**; dữ liệu `status = pending_branch` & `officeId = manager.branch`.
Columns: ID • createdAt • senderName • receiverName • value • **Approve** (quick) • View.
Quick Approve → status `approved_branch` + history `APPROVED_BRANCH`.

**View page** `/approvals/branch/[id]`
• Xem chi tiết readonly.
• **Điều chỉnh** cho phép sửa fields phi thương mại, PATCH.
• **Duyệt phiếu** (nếu chưa duyệt).

---

### 2.4  Kế toán chi nhánh – `src/app/(shipping)/approvals/accounting/page.tsx`

Vai trò **Branch Accountant**; `status = approved_branch`.
Columns tương tự + **Verify**.
Verify:

1. Sinh barcode (lib/barcode)
2. Tạo stub PDF hoá đơn `/api/invoice/:id`
3. PATCH status `docs_verified` + history `DOCS_VERIFIED`.

**View page** `/approvals/accounting/[id]`
• Cho điều chỉnh surcharge / insurance.
• **Xác nhận chứng từ** (nếu chưa verify).

---

### 2.5  Kho – `src/app/(shipping)/warehouse/page.tsx`

Vai trò **Warehouse Manager**; `status = docs_verified`.
Columns: ID • barcode • route • pickupTime • actions (Print, Ready to ship, Confirm pickup).
Drawer fields:
• `pickupTime` (datetime) **required khi Ready to ship**
• `carrierTracking` (text).

*Actions*:

1. **Print label** – `html2canvas` `.label` div.
2. **Ready to ship** → PATCH status `ready_to_ship` + pickupTime + history.
3. **Confirm pickup** → PATCH status `in_transit` + carrierTracking + history `PICKED_UP`.

---

### 2.6  Theo dõi – `src/app/(shipping)/tracking/page.tsx`

Bất kỳ vai trò; hiển thị timeline từ `history`.
Nếu `status ∈ {ready_to_ship, in_transit}` và user là **Warehouse Manager** hoặc **CS** → có form cập nhật `carrierTracking` (PATCH).

---

### 2.7  Helper actions (features/shipping/actions/shipping-actions.ts)

```ts
export const confirmDraft   = (id:number,u:string) => patch(`/shipping/${id}`, {
  status : ShippingStatus.PendingBranch,
  history: add('CONFIRM', u),
});

export const approveDraft   = (id:number,u:string) => patch(`/shipping/${id}`, {
  status : ShippingStatus.ApprovedBranch,
  history: add('APPROVED_BRANCH', u),
});

export const verifyDocs     = (id:number,u:string, barcode:string) => patch(`/shipping/${id}`, {
  status : ShippingStatus.DocsVerified,
  barcode,
  history: add('DOCS_VERIFIED', u),
});

export const warehouseReady = (id:number,u:string, pickupTime:string) => patch(`/shipping/${id}`, {
  status : ShippingStatus.ReadyToShip,
  pickupTime,
  history: add('READY_TO_SHIP', u),
});

export const confirmPickup  = (id:number,u:string, carrierTracking?:string) => patch(`/shipping/${id}`, {
  status : ShippingStatus.InTransit,
  carrierTracking,
  history: add('PICKED_UP', u),
});
```

---

## 3. Administration module Administration module

### 3.1 Users (`src/app/(admin)/users/page.tsx`)

* Columns : `photo`, `fullName`, `email`, `roles`, `status`, `actions`.
* Drawer : same fields, email unique.

### 3.2 Roles (`…/roles/page.tsx`)

* Columns : `name`, `description`, `actions`.
* Drawer : `name`, `description`, `permissions[]`.

### 3.3 Permissions matrix (`…/permissions/page.tsx`)

* Table rows = permissions, cols = roles; checkbox updates store.

---

## 4. System‑Configuration module

### Administrative

* **Countries** : columns `id, code, name`; drawer same (code ISO‑2).
* **Branches** : columns `id, code, name, discount, address, phone`; drawer + countryId.

### System

* **CommodityTypes / ShippingTypes / PaymentTypes** : columns `id, code, name`.

### Pricing

* **Routes** : `id`, `code`, `name`, `originBranch`, `destCountry`.
* **Carriers** : `id`, `name`, `routeCount`.
* **InsurancePackages** : `id`, `name`, `rate%`, `activeDate`.
* **PriceConfigurations** : cấu hình giá cố định theo tuyến + hãng vận chuyển.

  * **Columns** : `id`, `routeId`, `carrierId`, `fixedPrice` (currency), `actions`.
  * **Drawer fields** : `routeId` (*Select* `/routes`), `carrierId` (*Select* `/carriers`), `fixedPrice` (số ≥ 0) **required**.
  * **Rules** : combination `(routeId, carrierId)` phải **duy nhất**; validate khi lưu.

---

## 5. Shared Components & Utilities

* **layout/Sidebar.tsx** : nav từ `navItems`, collapse mobile.
* **layout/Topbar.tsx** : breadcrumbs + Command‑K + Clerk `UserButton`.
* **tables/DataTable.tsx** : wrapper TanStack + Dice.
* **charts/** : Recharts card components.
* **lib/mock-server.ts** : REST faker (chi tiết §8).
* **lib/calcs.ts** : `getVolume`, `getInsuranceFee`.
* **lib/barcode.ts** : regex `/^[AS]\/\w{3}\/\d{2}\/\w{3}\d{4}$/`.
* **lib/status.ts** : state machine helper.

---

## 6. State & Hooks

* `stores/useShippingStore.ts` : orders cache, filters.
* `stores/useConfigStore.ts` : master‑data cache TTL 5 min.
* `hooks/useMultistepForm.tsx` : điều khiển wizard.
* `hooks/useBreadcrumbs.tsx` : pathname → breadcrumbs.

---

## 7. TypeScript Interfaces (đầy đủ)

```ts
// ✦ Master‑data
export interface Country { id:number; code:string; name:string; }
export interface Branch  { id:number; code:string; name:string; discount:number; phone:string; address:string; countryId:string; }
export interface CommodityType { id:number; code:string; name:string; }
export interface ShippingType  { id:number; code:string; name:string; }
export interface PaymentType   { id:number; code:string; name:string; }
export interface Route   { id:number; code:string; name:string; originBranchId:string; destCountryId:string; }
export interface Carrier { id:number; name:string; routeIds:string[]; }
export interface InsurancePackage { id:number; name:string; rate:number; activeDate:string; }
export interface PriceConfiguration { id:number; routeId:string; carrierId:string; fixedPrice:number; }

// ✦ User management
export type RoleKey = 'order_creator'|'branch_manager'|'branch_accountant'|'warehouse_manager'|'admin';
export interface Permission { id:number; key:string; description:string; }
export interface User { id:number; fullName:string; email:string; roles:RoleKey[]; status:'active'|'inactive'; }

// ✦ Customer
export interface Customer { 
  id:number; 
  name:string; 
  phone:string; 
  email:string; 
  note?:string; 
  countryId:string; 
  country:Country;
  cityId:string; 
  city:City;
  postal:string; 
  address:string; 
}

// ✦ Shipping
export enum ShippingStatus {
  Draft          = 'draft',
  PendingBranch  = 'pending_branch',
  ApprovedBranch = 'approved_branch',
  DocsVerified   = 'docs_verified',
  ReadyToShip    = 'ready_to_ship',
  InTransit      = 'in_transit',
  Delivered      = 'delivered',
}
export interface ShippingHistory { 
  id:number; 
  at:string; 
  userId:string; 
  action:string; 
  note?:string; 
}
export interface GoodsItem { 
  id:number; 
  commodityTypeId:number; 
  commodityType:CommodityType; 
  description:string; 
  length:number; 
  width:number; 
  height:number; 
  volume:number; 
  weight:number; 
  quantity:number; 
  unitPrice:number; 
  qualityNote?:string; 
}

export interface Surcharge { 
  id:number; 
  reason:string; 
  amount:number; 
}
export interface InsuranceDetail { 
  packageId:number; 
  package:InsurancePackage; 
  declaredValue:number; 
  fee:number; 
}
export interface ShippingOrder {
  id:number;
  createdAt:string;
  branchId:number;
  branch:Branch;
  creatorId:string;
  shippingTypeId:number;
  shippingType:ShippingType;
  paymentTypeId:number;
  paymentType:PaymentType;
  branchDiscount:number;
  senderId: number;
  sender:Customer;
  receiverId: number;
  receiver:Customer;
  routeId:number;
  route:Route;
  carrierId:number;
  carrier:Carrier;
  goods:GoodsItem[];
  surcharge?:Surcharge[];
  insurance?:InsuranceDetail;
  barcode?:string;
  status:ShippingStatus;
  history:ShippingHistory[];
}

// ✦ Dashboard
export interface DashboardStats { todayOrders:number; todayRevenue:number; pendingApproval:number; delayedRoutes:number; }
```

---

## 8. Seed data (file `db.ts`)

Tất cả `id` đều là **number** để thống nhất typings. Seed dùng cho demo & test E2E.

```ts
// --- Countries
export const COUNTRIES: Country[] = [
  { id: 1, code: 'VN',  name: 'Việt Nam'   },
  { id: 2, code: 'IND', name: 'India'      },
  { id: 3, code: 'SIN', name: 'Singapore'  },
];

// --- Branches (Chi nhánh)
export const BRANCHES: Branch[] = [
  { id: 1, code: 'HCM', name: 'Hồ Chí Minh', discount: 5000, phone: '028999999', address: '123 Lê Lợi, Q1', countryId: 'VN' },
  { id: 2, code: 'HAN', name: 'Hà Nội',      discount: 4000, phone: '024888888', address: '456 Phố Huế, Hai Bà Trưng', countryId: 'VN' },
];

// --- Commodity, Shipping, Payment types
export const COMMODITY_TYPES: CommodityType[] = [
  { id: 1, code: 'ELE', name: 'Điện tử' },
  { id: 2, code: 'FAS', name: 'Thời trang' },
];
export const SHIPPING_TYPES: ShippingType[] = [
  { id: 1, code: 'AIR', name: 'Đường bay' },
  { id: 2, code: 'SEA', name: 'Đường biển' },
];
export const PAYMENT_TYPES: PaymentType[] = [
  { id: 1, code: 'COD', name: 'Thu hộ (COD)' },
  { id: 2, code: 'CSH', name: 'Tiền mặt'     },
  { id: 3, code: 'TRF', name: 'Chuyển khoản' },
];

// --- Routes
export const ROUTES: Route[] = [
  { id: 1, code: '01', name: 'HCM → IND', originBranchId: 'HCM', destCountryId: 'IND' },
  { id: 2, code: '02', name: 'HAN → SIN', originBranchId: 'HAN', destCountryId: 'SIN' },
];

// --- Carriers
export const CARRIERS: Carrier[] = [
  { id: 1, name: 'DHL Express', routeIds: ['01','02'] },
  { id: 2, name: 'FedEx',       routeIds: ['01']      },
];

// --- Insurance packages
export const INSURANCE_PACKAGES: InsurancePackage[] = [
  { id: 1, name: 'Basic 1%',   rate: 1, activeDate: '2024-01-01' },
  { id: 2, name: 'Premium 3%', rate: 3, activeDate: '2024-01-01' },
];

// --- Price configurations (đơn giá cố định VND/kg)
export const PRICE_CONFIGS: PriceConfiguration[] = [
  { id: 1, routeId: '01', carrierId: 'DHL',  fixedPrice: 90000  },
  { id: 2, routeId: '01', carrierId: 'FedEx',fixedPrice: 95000  },
  { id: 3, routeId: '02', carrierId: 'DHL',  fixedPrice: 110000 },
];

// --- Customers sample
export const CUSTOMERS: Customer[] = [
  { id: 1, name: 'Nguyễn Văn A', phone: '0909000111', countryId:'VN', city:'Hồ Chí Minh', postal:'700000', address:'12 Nguyễn Huệ, Q1' },
  { id: 2, name: 'Trần Thị B',   phone: '0909222333', countryId:'VN', city:'Hà Nội',      postal:'100000', address:'98 Nguyễn Chí Thanh' },
];

// --- Permissions
export const PERMISSIONS: Permission[] = [
  { id: 1, key:'CREATE_ORDER',  description:'Tạo phiếu VC' },
  { id: 2, key:'APPROVE_ORDER', description:'Duyệt phiếu CN' },
  { id: 3, key:'VERIFY_DOCS',   description:'Kiểm tra chứng từ' },
];

// --- Users demo (Clerk đồng bộ bằng ID string, seed chỉ minh hoạ)
export const USERS: User[] = [
  { id: 1, fullName:'Alice Creator',  email:'alice@ptx.vn',   roles:['order_creator'],  status:'active' },
  { id: 2, fullName:'Bob Manager',    email:'bob@ptx.vn',     roles:['branch_manager'], status:'active' },
  { id: 3, fullName:'Cathy Accountant',email:'cathy@ptx.vn',  roles:['branch_accountant'], status:'active' },
  { id: 4, fullName:'David Warehouse', email:'david@ptx.vn',  roles:['warehouse_manager'],status:'active' },
];

// --- Example Shipping order (draft)
export const SHIPPING_ORDERS: ShippingOrder[] = [
  {
    id: 1,
    createdAt: new Date().toISOString(),
    officeId: 'HCM',
    creatorId: 'alice@ptx.vn',
    transportTypeId: 'AIR',
    paymentTypeId: 'COD',
    branchDiscount: 5000,
    sender: CUSTOMERS[0],
    receiver: CUSTOMERS[1],
    routeId: '01',
    carrierId: 'DHL',
    goods: [
      { id:1, commodityTypeId:'ELE', description:'iPhone 15', length:15, width:7, height:1, volume:105, weight:0.2, quantity:1, unitPrice:25000000 }
    ],
    surcharge:[ { id:1, reason:'Wooden crate', amount:50000 } ],
    insurance:{ packageId:'1', declaredValue:25000000, fee:250000 },
    status: ShippingStatus.Draft,
    history: [],
  },
];
```

## Các mảng seed khác (e.g., roles) suy ra từ enum `RoleKey`—không cần dữ liệu riêng vì FE lấy từ constants.

9. Mock‑server (lib/mock-server.ts)

Hoàn chỉnh mã nguồn mock REST server dùng itty-router; delay 400–800 ms để mô phỏng network. Tất cả endpoint trả JSON (Content‑Type: application/json).

// lib/mock-server.ts
import { Router } from 'itty-router';
import { json }   from 'itty-router-extras';
import {
  COUNTRIES, BRANCHES, COMMODITY_TYPES, SHIPPING_TYPES, PAYMENT_TYPES,
  ROUTES, CARRIERS, INSURANCE_PACKAGES, PRICE_CONFIGS,
  CUSTOMERS, SHIPPING_ORDERS,
} from './db';
import { ShippingOrder, ShippingStatus } from '@/types';

/* ---------- helpers ---------- */
const router = Router();
const rnd  = (min:number,max:number)=>Math.floor(Math.random()*(max-min+1))+min;
const delay = (ms=400)=>new Promise(r=>setTimeout(r,ms));
const J = (data:any,code=200)=>json(data, code);
const nextId = (arr:any[]):number => arr.length ? Math.max(...arr.map((x:any)=>x.id))+1 : 1;

/* ---------- master‑data routes ---------- */
router.get('/countries',          () => J(COUNTRIES));
router.get('/branches',           () => J(BRANCHES));
router.get('/commodity-types',    () => J(COMMODITY_TYPES));
router.get('/shipping-types',     () => J(SHIPPING_TYPES));
router.get('/payment-types',      () => J(PAYMENT_TYPES));
router.get('/routes',             () => J(ROUTES));
router.get('/carriers',           () => J(CARRIERS));
router.get('/insurance',          () => J(INSURANCE_PACKAGES));
router.get('/price-configs',      () => J(PRICE_CONFIGS));

/* ---------- tariffs quick lookup ---------- */
router.get('/tariffs', (req:any)=>{
  const { carrierId, routeId } = req.query as { carrierId:string; routeId:string };
  const pc = PRICE_CONFIGS.find(p=>p.carrierId===carrierId && p.routeId===routeId);
  return J({ rate: pc?.fixedPrice ?? 0 });
});

/* ---------- customer ---------- */
router.get('/customers', (req:any)=>{
  const phone = (req.query?.phone || '') as string;
  const list = phone ? CUSTOMERS.filter(c=>c.phone.includes(phone)) : CUSTOMERS;
  return J(list);
});
router.get('/customers/:id/recipients', (req:any)=>{
  const senderId = Number(req.params.id);
  return J(CUSTOMERS.filter(c=>c.id!==senderId));
});

/* ---------- shipping CRUD ---------- */
router.get('/shipping', (req:any)=>{
  let data:ShippingOrder[] = SHIPPING_ORDERS;
  if(req.query?.status){ data = data.filter(o=>o.status===req.query.status); }
  if(req.query?.creatorId){ data = data.filter(o=>o.creatorId===req.query.creatorId); }
  return J(data);
});

router.post('/shipping', async (req:any)=>{
  await delay(rnd(400,800));
  const body = await req.json();
  const newOrder: ShippingOrder = {
    ...body,
    id: nextId(SHIPPING_ORDERS),
    createdAt: new Date().toISOString(),
    status: ShippingStatus.Draft,
    history: [],
  };
  SHIPPING_ORDERS.push(newOrder);
  return J(newOrder,201);
});

router.patch('/shipping/:id', async (req:any)=>{
  await delay(rnd(300,600));
  const id = Number(req.params.id);
  const idx = SHIPPING_ORDERS.findIndex(o=>o.id===id);
  if(idx===-1) return J({message:'Not found'},404);
  const body = await req.json();
  SHIPPING_ORDERS[idx] = { ...SHIPPING_ORDERS[idx], ...body } as ShippingOrder;
  return J(SHIPPING_ORDERS[idx]);
});

router.delete('/shipping/:id', (req:any)=>{
  const id = Number(req.params.id);
  const idx = SHIPPING_ORDERS.findIndex(o=>o.id===id);
  if(idx===-1) return J({message:'Not found'},404);
  SHIPPING_ORDERS.splice(idx,1);
  return J({ ok:true });
});

/* ---------- dashboard stats ---------- */
router.get('/stats/today-orders', ()=>J({ todayOrders: SHIPPING_ORDERS.filter(o=>o.createdAt.slice(0,10)===new Date().toISOString().slice(0,10)).length }));
router.get('/stats/today-revenue',()=>J({ todayRevenue: rnd(5_000_000,15_000_000) }));
router.get('/stats/delay',        ()=>J({ delayedRoutes: rnd(0,2) }));

/* ---------- default 404 ---------- */
router.all('*',()=>J({ message:'Endpoint not found'},404));

/* ---------- export Cloudflare Worker‑style handler ---------- */
export const mockServer = async (req:Request)=>{
  await delay(rnd(400,800));
  return router.handle(req);
};

Triển khai: trong Next.js App Router, tạo route src/app/api/mock/[...path]/route.ts và forward Request tới mockServer(request) để dùng chung cho FE.

## Các endpoint CRUD (POST/PATCH/DELETE) cấu hình giá có thể thêm tương tự nếu cần.

## 10. Tech stack & Libraries

* **Framework** : **Next.js 15** (App Router, React 18 + Server Actions).
* **Language** : TypeScript 5.
* **Styling** : Tailwind CSS v4 + CSS Modules (shadcn-ui tokens).
* **UI Components** : [shadcn/ui](https://ui.shadcn.com/) + lucide-react icons.
* **Forms & Validation** : React Hook Form + Zod.
* **Data Tables** : TanStack Table v8 + Dice UI skin.
* **State Management** : Zustand (persist + middleware).
* **Search param sync** : Nuqs.
* **Auth** : Clerk (multi‑org, RBAC via middleware).
* **Error tracking** : Sentry (browser & server‑side).
* **Command Palette** : kbar.
* **Charts** : Recharts.
* **Mock API** : itty‑router + faker.js.
* **Testing** : Vitest (unit) + Playwright (e2e).
* **Lint/Format** : ESLint, Prettier, Husky pre‑commit.
* **PDF/Label** : pdf-lib (invoice stub), html2canvas (label snapshot).

---

## 11. Testing & Road‑map

* **Vitest** : unit‑test `barcode`, `calcs`.
* **Playwright** : e2e flow tạo → duyệt → warehouse → pickup.
* **CI** : lint, type‑check, test.

### Road‑map

1. **System‑Configuration** CRUD + seed.
2. **Shipping Wizard** & confirm draft.
3. **Approvals** + barcode & invoice.
4. **Warehouse workflow**.
5. **Dashboard & Reports**.
6. **RBAC** & Admin.
7. **Tests & polish**.

---