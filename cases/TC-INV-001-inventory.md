# TC-INV — Inventory (Kho hàng)

**Module:** Inventory Management  
**URL:** `https://project.vinapage.com/angel/admin/inventory`  
**Standard:** IEEE 829 / ISTQB  
**Version:** 1.0 | **Updated:** 2026-05-09  
**Roles:** ADMIN, MANAGER (CRUD) | STAFF (view only)  

---

## Test Plan

### Scope
Kiểm thử module quản lý kho hàng (sơn, dụng cụ, vật tư): theo dõi tồn kho theo SKU, cảnh báo low stock, nhập/xuất kho, phân loại theo nhóm sản phẩm.

### Business Rules
- Low stock threshold: số lượng tồn ≤ min_quantity
- Khi low stock → hiển thị badge đỏ và cảnh báo trên Dashboard
- Mỗi sản phẩm có SKU unique
- Xuất kho không cho số lượng âm (tồn kho ≥ 0)

---

## Test Cases

---

### TC-INV-001 — Theo dõi tồn kho theo SKU

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-INV-001 |
| **Title** | Danh sách hàng tồn kho hiển thị đúng theo SKU |
| **Priority** | P1 — High |
| **Type** | Functional |
| **Preconditions** | Có ≥5 sản phẩm trong kho |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Truy cập `/angel/admin/inventory` | Danh sách sản phẩm với cột: SKU, Tên, Nhóm, Tồn kho, Min, Đơn vị |
| 2 | Tìm kiếm theo SKU "OPI-RED-001" | Hiển thị đúng sản phẩm |
| 3 | Kiểm tra cột Tồn kho | Số nguyên, đơn vị đúng (bottles, pieces...) |
| 4 | Kiểm tra cột Min Stock | Ngưỡng tồn tối thiểu |
| 5 | Sản phẩm tồn > min | Row bình thường (không có warning) |
| 6 | Sản phẩm tồn ≤ min | Row có badge đỏ "Low Stock" |

---

### TC-INV-002 — Cảnh báo Low Stock

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-INV-002 |
| **Title** | Low stock badge hiển thị đúng và sync với Dashboard |
| **Priority** | P0 — Critical |
| **Type** | Functional / Integration |
| **Preconditions** | Có sản phẩm "OPI Base Coat" với tồn = 2, min = 5 |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Mở Inventory | "OPI Base Coat" có badge đỏ "Low Stock" |
| 2 | Mở Dashboard | Card "Low Stock" hiển thị số > 0 |
| 3 | Nhập thêm hàng cho "OPI Base Coat" đến tồn = 10 | Badge "Low Stock" biến mất |
| 4 | Mở Dashboard | Card "Low Stock" số giảm xuống |
| 5 | Filter "Low Stock only" (nếu có filter) | Chỉ hiển thị sản phẩm dưới ngưỡng |

---

### TC-INV-003 — Nhập kho (Stock In)

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-INV-003 |
| **Title** | Nhập hàng vào kho — số lượng tăng đúng |
| **Priority** | P0 — Critical |
| **Type** | Functional |

**Test Data:**
- Sản phẩm: "OPI Base Coat", tồn hiện tại: 3
- Số lượng nhập: 10
- Kỳ vọng tồn sau: 13

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Stock In" / "Receive Stock" | Form nhập kho mở |
| 2 | Chọn sản phẩm "OPI Base Coat" | Hiển thị tồn hiện tại: 3 |
| 3 | Nhập số lượng: 10 | Preview: "New quantity: 13" |
| 4 | Nhập ghi chú: "Supplier delivery May 2026" | Optional field |
| 5 | Confirm | Tồn kho cập nhật: 13 |
| 6 | Kiểm tra lịch sử giao dịch | Entry mới: +10, ngày giờ, người thực hiện |
| 7 | Nhập số lượng âm -5 | Error: "Quantity must be positive" |
| 8 | Nhập số lượng 0 | Error: "Quantity must be > 0" |

---

### TC-INV-004 — Xuất kho (Stock Out)

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-INV-004 |
| **Title** | Xuất kho — số lượng giảm, không cho tồn âm |
| **Priority** | P0 — Critical |
| **Type** | Functional / Negative |

**Test Data:**
- Sản phẩm: "Acetone Remover", tồn hiện tại: 5

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Stock Out" | Form xuất kho mở |
| 2 | Nhập số lượng xuất: 3 | Preview: "New quantity: 2" |
| 3 | Confirm | Tồn kho cập nhật: 2 |
| 4 | Xuất thêm 5 (vượt quá tồn hiện tại 2) | Error: "Insufficient stock. Available: 2" |
| 5 | Xuất đúng 2 (hết hàng) | Tồn = 0, badge "Out of Stock" nếu có |

---

### TC-INV-005 — Thêm sản phẩm mới vào kho

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-INV-005 |
| **Title** | Tạo sản phẩm kho mới với SKU unique |
| **Priority** | P1 — High |
| **Type** | Functional |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Add Product" | Form tạo sản phẩm |
| 2 | Nhập SKU: "GEL-TOP-002", Name, Category, Unit, Min Stock | Fields hợp lệ |
| 3 | Nhập số lượng ban đầu: 20 | Initial stock = 20 |
| 4 | Save | Sản phẩm tạo thành công |
| 5 | Thử tạo sản phẩm khác với cùng SKU "GEL-TOP-002" | Error: "SKU already exists" |

---

### TC-INV-006 — Phân loại theo nhóm sản phẩm

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-INV-006 |
| **Title** | Filter và nhóm sản phẩm theo category |
| **Priority** | P2 — Medium |
| **Type** | Functional |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Chọn filter "Gel Polish" | Chỉ hiển thị sản phẩm nhóm Gel Polish |
| 2 | Chọn filter "Tools" | Chỉ hiển thị dụng cụ |
| 3 | Chọn "All" | Toàn bộ sản phẩm |
| 4 | Group view (nếu có) | Sản phẩm gom theo nhóm với subtotal |
