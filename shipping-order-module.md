````markdown
# Shipping Order (SO) Module – Technical Specs  
*Repository path: `src/app/(shipping-orders)`*

---

## 1. Data Model

```ts
// Roles & Users -------------------------------------------------------------
export type RoleKey =
  | 'order_creator'
  | 'branch_manager'
  | 'branch_accountant'
  | 'warehouse_manager'
  | 'admin';

export interface Permission { id: number; key: string; description: string; }

export interface User {
  id: number;
  fullName: string;
  email: string;
  roles: RoleKey[];
  status: 'active' | 'inactive';
}

// Customers -----------------------------------------------------------------
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  note?: string;
  countryId: string;
  country: Country;
  cityId: string;
  city: City;
  postal: string;
  address: string;
}

// Shipping ------------------------------------------------------------------
export interface ShippingHistory {
  id: number;
  at: string;          // ISO date-time
  userId: string;
  action: string;
  note?: string;
}

export interface GoodsItem {
  id: number;
  commodityTypeId: number;
  commodityType: CommodityType;
  description: string;
  length: number;
  width: number;
  height: number;
  volume: number;
  weight: number;
  quantity: number;
  unitPrice: number;
  qualityNote?: string;
}

export interface Surcharge { id: number; reason: string; amount: number; }

export interface InsuranceDetail {
  packageId: number;
  package: InsurancePackage;
  declaredValue: number;
  fee: number;
}

export enum ShippingStatus {
  Draft              = 0,
  PendingForApproval = 1,
  Approved           = 2,
  DocsVerified       = 3,
  EntryInWarehouse   = 4,
  ReadyToExport      = 5,
  InTransit          = 6,
  Delivered          = 7,
  Cancelled          = 8
}

export interface ShippingOrder {
  id: number;
  createdAt: string;
  branchId: number;
  branch: Branch;
  creatorId: string;
  shippingTypeId: number;
  shippingType: ShippingType;
  paymentTypeId: number;
  paymentType: PaymentType;
  branchDiscount: number;
  senderId: number;
  sender: Customer;
  receiverId: number;
  receiver: Customer;
  routeId: number;
  route: Route;
  carrierId: number;
  carrier: Carrier;
  goods: GoodsItem[];
  surcharge?: Surcharge[];
  insurance?: InsuranceDetail;
  barcode?: string;
  status: ShippingStatus;
  history: ShippingHistory[];
}
````

### 1.1 Status Flow

```text
Draft
  → PendingForApproval
    → Approved
      → DocsVerified
        → EntryInWarehouse
          → ReadyToExport
            → InTransit
              → Delivered
```

*Reverse moves are **not** allowed. “Cancelled” is handled by a separate action.*

---

## 2. Folder Structure

```
src/app/
└─ (shipping-orders)/
   ├─ list/          # overview dashboard
   ├─ draft/         # Draft | PendingForApproval
   ├─ approval/      # PendingForApproval | Approved
   ├─ verification/  # Approved | DocsVerified
   ├─ warehouse/     # DocsVerified | EntryInWarehouse | ReadyToExport
   ├─ transit/       # InTransit (table view)
   ├─ delivery/      # Delivered (table view)
   └─ cancellation/  # Cancelled (table view – optional)
```

---

## 3. Page Specs

### 3.1 Overview – `list/page.tsx`

| Block         | Details                                                                                                |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| Header        | Breadcrumb + **Create order** button                                                                   |
| 2-column grid | Each `<Card>` links to Draft · Approval · Verification · Warehouse · Transit · Delivery · Cancellation |
| Status badges | Show SO count per status (via `GET /shipping-orders/count-by-status`)                                  |

---

### 3.2 Draft Board – `draft/page.tsx`

| Property        | Value                                                                                                                                |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Columns         | **Draft** → **PendingForApproval**                                                                                                   |
| Actions         | • “Confirm – send for approval” button **or** drag to next column<br>• View · Edit · Delete                                          |
| Permissions     | Any authenticated user (`order_creator`)                                                                                             |
| Card highlights | SO id · createdAt · creator · branch · shippingType · sender / receiver (name + phone) · route · total amount · total items · status |
| Extra           | Pagination · Filters · **Create order** button (link to `/shipping/new`)                                                             |

---

### 3.3 Approval Board – `approval/page.tsx`

| Property        | Value                                                        |
| --------------- | ------------------------------------------------------------ |
| Columns         | **PendingForApproval** → **Approved**                        |
| Actions         | “Approve – verify docs” button or drag; View · Edit · Delete |
| Permissions     | `branch_manager` only                                        |
| Card highlights | Same as Draft + *approvedBy*                                 |

---

### 3.4 Verification Board – `verification/page.tsx`

| Property    | Value                                                                    |
| ----------- | ------------------------------------------------------------------------ |
| Columns     | **Approved** → **DocsVerified**                                          |
| Actions     | “Verify docs – move to warehouse” (prints barcode); View · Edit · Delete |
| Permissions | `branch_accountant`                                                      |
| Special     | On status change print barcode (`printBarcode(util)`).                   |

---

### 3.5 Warehouse Board – `warehouse/page.tsx`

| Column               | Main Actions                                                                 |
| -------------------- | ---------------------------------------------------------------------------- |
| **DocsVerified**     | **Import to warehouse** → status `EntryInWarehouse`; print barcode + invoice |
| **EntryInWarehouse** | **Prepare export** → dialog (carrier, pickup time) → status `ReadyToExport`  |
| **ReadyToExport**    | **Carrier picked up** → status `InTransit`                                   |

*No backward moves. Same common buttons & permissions (`branch_accountant`).*

---

### 3.6 Transit Table – `transit/page.tsx`

*Table layout identical to `features/pricing/routes`.*

| Column list                                                                                                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ID · CreatedAt · Barcode (thumb) · TrackingNo · Sender (name / addr / phone) · Receiver (name / addr / phone) · Total Amount · Total Packages · Status · UpdatedAt · **Actions** (View · Edit · *Delivered*) |

Pagination + filters. **Delivered** action sets status to `Delivered`.

---

### 3.7 Delivery Table – `delivery/page.tsx`

*Same table columns as Transit.*
Action column = **View only** (detail modal / page).

---

### 3.8 Cancellation Table – `cancellation/page.tsx` *(optional)*

List SO with status `Cancelled`; View only.

---

## 4. Create New SO – `shipping/new/page.tsx`

> Single-page **form** (no multi-step routing). Use Accordion / Stepper for UX.
> **All `<Select>` dropdowns below fetch their options from the mock API
> `src/lib/api/mock-system-configuration-api.ts`.**

### Step 1 – General

| Field             | Type / Source                        | Validation   |
| ----------------- | ------------------------------------ | ------------ |
| createdAt         | auto ISO                             | readonly     |
| creatorId         | Clerk                                | readonly     |
| branchId          | Select `/branches` (mock)            | **required** |
| shippingTypeId    | Select `/shipping-types`             |              |
| shippingServiceId | Select `/shipping-services`          |              |
| paymentTypeId     | Select `/payment-types`              |              |
| branchDiscount    | auto filled from branch              | readonly     |
| volumetricDivisor | constant `5 000` (from pricing rule) | readonly     |
| routeId           | Select `/routes`                     |              |
| carrierId         | Select filtered by `routeId`         |              |

### Step 2 – Sender

Search by **phone** in `/customers`. If not found, allow *create new*.
Mandatory: `senderPhone (regex)` & `senderName`.

### Step 3 – Receiver

Same fields / rules as Sender.

### Step 4 – Goods & Cost

| Item                    | Notes                                                                                                                                                                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dynamic GoodsItem table | Add / remove rows                                                                                                                                                                                                                 |
| **unitPrice algorithm** | 1. `DIMWeight = (L×W×H) / volumetricDivisor`<br>2. Round DIMWeight to 0.5 kg, CBM to 0.1<br>3. `ChargeableWeight = max(DIMWeight, weight)`<br>4. `carrierRate` ← `GET /prices`<br>5. `unitPrice = ChargeableWeight × carrierRate` |
| Realtime columns        | Volume · ChargeableWeight · unitPrice · lineTotal                                                                                                                                                                                 |
| Surcharge\[]            | reason (select) · amount (currency)                                                                                                                                                                                               |
| Insurance               | declaredValue · packageId → `insuranceFee = declaredValue × rate%`                                                                                                                                                                |

### Step 5 – Confirmation

* Show **grand total**.
* Checkbox **Paid** *(required if paymentType ≠ COD)*.
* **Save Draft** → `POST /shipping` with `status = Draft`, then redirect to Draft board.

---

## 5. Developer Notes

1. **Kanban**: Re-use component logic from
   `src/app/dashboard/kanban` & `src/features/kanban`.
2. **Drag direction**: disable dropping to previous columns (`isDropDisabled`).
3. **Permissions**: HOC `withAuthorization(RoleKey[])`.
4. **Printing**: utilities in `src/shared/print`.
5. **URL state**: store filters & pagination via query-params (Zod schema).

---

> **End of document** – ready for Windsurf / Markdown viewers.

```
```
