# TC-PAY — Payments (Thanh toán)

**Module:** Payment Management  
**URL:** `https://project.vinapage.com/angel/admin/payments`  
**Standard:** IEEE 829 / ISTQB  
**Version:** 1.0 | **Updated:** 2026-05-09  
**Roles:** ADMIN, MANAGER  

---

## Test Plan

### Scope
Kiểm thử lịch sử thanh toán: hiển thị giao dịch, lọc theo phương thức thanh toán, tổng kết theo ngày/tuần/tháng.

---

## Test Cases

---

### TC-PAY-001 — Lịch sử thanh toán

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-PAY-001 |
| **Title** | Danh sách giao dịch thanh toán hiển thị đúng |
| **Priority** | P1 — High |
| **Type** | Functional |
| **Preconditions** | Có ≥5 booking COMPLETED với payment records |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Truy cập `/angel/admin/payments` | Danh sách giao dịch với: Mã booking, Khách, Dịch vụ, Số tiền, Phương thức, Ngày |
| 2 | Kiểm tra định dạng số tiền | "$XX.XX" (NZD), không phải cents |
| 3 | Kiểm tra phương thức | cash / card / gift-card |
| 4 | Kiểm tra thứ tự | Mới nhất trước |
| 5 | Click vào 1 giao dịch | Chi tiết hoặc navigate đến booking |

---

### TC-PAY-002 — Filter theo phương thức thanh toán

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-PAY-002 |
| **Title** | Filter giao dịch theo cash / card / gift card |
| **Priority** | P1 — High |
| **Type** | Functional |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Chọn filter "Cash" | Chỉ hiển thị giao dịch tiền mặt |
| 2 | Chọn filter "Card" | Chỉ hiển thị giao dịch thẻ |
| 3 | Chọn filter "Gift Card" | Chỉ hiển thị giao dịch gift card |
| 4 | Chọn "All" | Toàn bộ giao dịch |
| 5 | Kiểm tra tổng tiền theo từng filter | Tổng đúng |

---

### TC-PAY-003 — Tổng tiền theo ngày / tuần / tháng

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-PAY-003 |
| **Title** | Summary tổng doanh thu theo khoảng thời gian |
| **Priority** | P1 — High |
| **Type** | Functional / Data Accuracy |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Chọn range: "Today" | Tổng doanh thu hôm nay |
| 2 | Chọn range: "This Week" | Tổng 7 ngày |
| 3 | Chọn range: "This Month" | Tổng tháng hiện tại |
| 4 | Chọn custom range: 01/05 - 09/05 | Tổng trong khoảng |
| 5 | Cross-check với Reports module | Số liệu nhất quán |
| 6 | Kiểm tra breakdown: cash + card + gift card | Sum = Total revenue |

---

### TC-PAY-004 — Xử lý thanh toán Gift Card

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-PAY-004 |
| **Title** | Thanh toán bằng Gift Card — trừ số dư đúng |
| **Priority** | P0 — Critical |
| **Type** | Functional / Integration |
| **Preconditions** | Gift card "AN-0001-ABCD" có số dư $100 |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Hoàn thành booking $55 bằng gift card "AN-0001-ABCD" | Payment record: method=gift-card, amount=$55 |
| 2 | Kiểm tra Gift Cards module | Số dư: $100 - $55 = $45 |
| 3 | Kiểm tra lịch sử redeem của gift card | Entry: -$55, ngày, booking ID |
| 4 | Thanh toán booking $50 bằng gift card còn $45 | Error: "Insufficient gift card balance" |
| 5 | Thanh toán $45 bằng gift card + $5 cash (split) | Kiểm tra xem có hỗ trợ split payment không |
