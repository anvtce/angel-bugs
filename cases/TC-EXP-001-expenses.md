# TC-EXP — Expenses (Chi phí vận hành)

**Module:** Expenses  
**URL:** `https://project.vinapage.com/angel/admin/expenses`  
**Standard:** IEEE 829 / ISTQB  
**Version:** 1.0 | **Updated:** 2026-05-09  
**Roles:** ADMIN, MANAGER  

---

## Test Cases

---

### TC-EXP-001 — Thêm khoản chi phí mới

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EXP-001 |
| **Title** | Tạo expense mới với đầy đủ thông tin |
| **Priority** | P1 — High |
| **Type** | Functional |

**Test Data:**
| Field | Value |
|-------|-------|
| Category | Rent |
| Amount | $1,200.00 |
| Date | 01/05/2026 |
| Description | Monthly rent May 2026 |
| Receipt | invoice_may.pdf |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Truy cập `/angel/admin/expenses` | Danh sách chi phí |
| 2 | Click "Add Expense" | Form tạo expense |
| 3 | Chọn Category: Rent | Dropdown categories |
| 4 | Nhập Amount: 1200.00 | Field nhận $1,200.00 |
| 5 | Chọn Date: 01/05/2026 | Date picker |
| 6 | Upload receipt PDF | File upload thành công |
| 7 | Save | Expense tạo thành công |
| 8 | Kiểm tra danh sách | Expense mới xuất hiện |

---

### TC-EXP-002 — Phân loại theo nhóm chi phí

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EXP-002 |
| **Title** | Filter và nhóm chi phí theo category |
| **Priority** | P1 — High |
| **Type** | Functional |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Filter "Rent" | Chỉ hiển thị chi phí thuê mặt bằng |
| 2 | Filter "Utilities" | Điện, nước, internet |
| 3 | Filter "Supplies" | Vật tư, dụng cụ |
| 4 | Tổng theo category | Đúng với sum từng nhóm |

---

### TC-EXP-003 — Tổng chi phí theo tháng

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EXP-003 |
| **Title** | Monthly expense summary chính xác |
| **Priority** | P1 — High |
| **Type** | Data Accuracy |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Chọn tháng 5/2026 | Tổng chi phí tháng 5 |
| 2 | Kiểm tra tổng | Sum tất cả expense trong tháng |
| 3 | Kiểm tra breakdown | Rent $1200 + Utilities $300 + Supplies $500 = $2000 |
| 4 | Profit = Revenue - Expenses | Kiểm tra xem có hiển thị P&L không |

---

### TC-EXP-004 — Đính kèm hoá đơn

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EXP-004 |
| **Title** | Upload và xem receipt đính kèm |
| **Priority** | P2 — Medium |
| **Type** | Functional |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Upload PDF receipt | File upload thành công |
| 2 | Upload JPG receipt | File upload thành công |
| 3 | Click "View Receipt" | File mở trong new tab hoặc preview |
| 4 | Upload file >10MB | Error: "File too large" |
| 5 | Upload file .exe | Error: "File type not allowed" |
