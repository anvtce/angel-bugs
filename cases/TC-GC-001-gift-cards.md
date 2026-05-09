# TC-GC — Gift Cards (Thẻ quà tặng)

**Module:** Gift Card Management  
**URL:** `https://project.vinapage.com/angel/admin/gift-cards`  
**Public URL:** `https://project.vinapage.com/angel/gift-cards`  
**Standard:** IEEE 829 / ISTQB  
**Version:** 1.0 | **Updated:** 2026-05-09  
**Roles:** ADMIN, MANAGER  

---

## Test Plan

### Scope
Kiểm thử quản lý gift cards: danh sách với mã AN-XXXX-XXXX, số dư, ngày hết hạn, lịch sử redeem, bật/tắt thẻ. Bao gồm cả luồng mua gift card từ public site.

### Business Rules
- Gift card code format: AN-XXXX-XXXX (uppercase)
- Gift card có expiry date (thường 1 năm từ ngày mua)
- Không redeem gift card đã hết hạn
- Không redeem gift card bị disabled
- Số dư không thể âm

---

## Test Cases

---

### TC-GC-001 — Danh sách Gift Cards

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-GC-001 |
| **Title** | Danh sách gift cards hiển thị đúng thông tin |
| **Priority** | P1 — High |
| **Type** | Functional |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Truy cập `/angel/admin/gift-cards` | Danh sách gift cards |
| 2 | Kiểm tra cột Code | Format AN-XXXX-XXXX |
| 3 | Kiểm tra cột Balance | Số dư hiện tại ($XX.XX) |
| 4 | Kiểm tra cột Initial Value | Mệnh giá ban đầu |
| 5 | Kiểm tra cột Expiry | Ngày hết hạn (DD/MM/YYYY) |
| 6 | Kiểm tra cột Status | Active / Expired / Disabled |
| 7 | Tìm kiếm theo code | Filter đúng gift card |

---

### TC-GC-002 — Số dư và lịch sử Redeem

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-GC-002 |
| **Title** | Số dư gift card và lịch sử sử dụng chính xác |
| **Priority** | P0 — Critical |
| **Type** | Functional / Data Accuracy |
| **Preconditions** | Gift card AN-TEST-0001, ban đầu $100, đã dùng $30 |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Mở chi tiết gift card AN-TEST-0001 | Detail page/modal |
| 2 | Kiểm tra Initial Value | $100.00 |
| 3 | Kiểm tra Current Balance | $70.00 ($100 - $30) |
| 4 | Kiểm tra Redeem History | 1 entry: -$30, ngày, booking ID |
| 5 | Public API: `GET /api/gift-cards/AN-TEST-0001` | Trả về code, balance=$70, expiry |

---

### TC-GC-003 — Bật/Tắt Gift Card

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-GC-003 |
| **Title** | Disable/Enable gift card ngăn redeem |
| **Priority** | P1 — High |
| **Type** | Functional |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Disable gift card AN-TEST-0002 (có balance $50) | Status = Disabled |
| 2 | Thử redeem AN-TEST-0002 tại thanh toán | Error: "Gift card is disabled" |
| 3 | Enable lại | Status = Active |
| 4 | Redeem thành công | Trừ số dư đúng |

---

### TC-GC-004 — Mua Gift Card từ Public Site

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-GC-004 |
| **Title** | Luồng mua gift card từ public `/angel/gift-cards` |
| **Priority** | P1 — High |
| **Type** | Functional / Integration / E2E |

**Test Data:**
- Loại: Physical card
- Mệnh giá: $50
- Người nhận: Mary Johnson, mary@test.com
- Thông điệp: "Happy Birthday!"

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Truy cập `/angel/gift-cards` | Trang mua gift card với các mệnh giá |
| 2 | Chọn mệnh giá $50 | Highlighted |
| 3 | Nhập thông tin người nhận | Fields hợp lệ |
| 4 | Nhập thông điệp | Optional textarea |
| 5 | Submit `POST /api/gift-cards` | Tạo gift card mới |
| 6 | Kiểm tra response | Code AN-XXXX-XXXX được tạo |
| 7 | Mở admin Gift Cards | Card mới xuất hiện với balance=$50 |
| 8 | Kiểm tra expiry | 1 năm từ ngày mua |

---

### TC-GC-005 — Redeem Gift Card hết hạn

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-GC-005 |
| **Title** | Không cho redeem gift card hết hạn |
| **Priority** | P0 — Critical |
| **Type** | Functional / Negative |
| **Preconditions** | Gift card AN-EXP-0001 đã expired (expiry = 2024-01-01) |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Thử redeem AN-EXP-0001 | Error: "Gift card has expired" |
| 2 | Public API `GET /api/gift-cards/AN-EXP-0001` | Trả về expired=true |
| 3 | Kiểm tra admin list | Status = "Expired" |
