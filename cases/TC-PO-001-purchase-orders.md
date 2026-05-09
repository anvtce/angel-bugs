# TC-PO — Purchase Orders (Đơn đặt hàng nhà cung cấp)

**Module:** Purchase Orders  
**URL:** `https://project.vinapage.com/angel/admin/purchase-orders`  
**Standard:** IEEE 829 / ISTQB  
**Version:** 1.0 | **Updated:** 2026-05-09  
**Roles:** ADMIN, MANAGER  

---

## Test Cases

---

### TC-PO-001 — Tạo Purchase Order và theo dõi trạng thái

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-PO-001 |
| **Title** | Tạo PO → Duyệt → Nhận hàng → Cập nhật kho |
| **Priority** | P0 — Critical |
| **Type** | Functional / Integration / E2E |

**Test Data:**
- Supplier: OPI Beauty Supplies NZ
- Items: OPI Base Coat x20 + OPI Top Coat x15
- Total: $450.00

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "New Purchase Order" | PO form mở |
| 2 | Chọn Supplier: "OPI Beauty Supplies NZ" | Supplier details pre-fill |
| 3 | Thêm item: OPI Base Coat, qty=20, unit price=$10 | Line item thêm vào |
| 4 | Thêm item: OPI Top Coat, qty=15, unit price=$12 | Total = $200+$180 = $380 |
| 5 | Submit PO | Status: DRAFT |
| 6 | Click "Approve" | Status: APPROVED |
| 7 | Click "Mark as Received" | Status: RECEIVED |
| 8 | Kiểm tra Inventory | OPI Base Coat +20, OPI Top Coat +15 |
| 9 | Kiểm tra Audit Log | CREATE PO, UPDATE status x2 |

**PO Status Flow:** DRAFT → APPROVED → SENT → RECEIVED → CANCELLED (nếu cancel)

---

### TC-PO-002 — Theo dõi trạng thái PO

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-PO-002 |
| **Title** | Filter và xem PO theo trạng thái |
| **Priority** | P1 — High |
| **Type** | Functional |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Filter "PENDING/APPROVED" | POs chờ nhận hàng |
| 2 | Filter "RECEIVED" | POs đã nhận |
| 3 | Filter "CANCELLED" | POs đã hủy |
| 4 | Kiểm tra mỗi PO item | PO number, Supplier, Total, Status, Date |

---

### TC-PO-003 — Lịch sử nhập hàng theo nhà cung cấp

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-PO-003 |
| **Title** | View purchase history by supplier |
| **Priority** | P2 — Medium |
| **Type** | Functional |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Filter theo Supplier: "OPI Beauty" | Tất cả POs của OPI |
| 2 | Kiểm tra tổng đã mua từ OPI | Sum total POs RECEIVED |
| 3 | Click vào PO | Chi tiết items, ngày, người duyệt |
