# TC-DASH — Dashboard

**Module:** Dashboard Admin  
**URL:** `https://project.vinapage.com/angel/admin`  
**Standard:** IEEE 829 / ISTQB  
**Version:** 1.0 | **Updated:** 2026-05-09  
**Roles:** ADMIN, MANAGER  

---

## Test Plan

### Scope
Kiểm thử trang Dashboard — trang landing sau khi đăng nhập Admin Panel. Dashboard hiển thị tổng quan vận hành: KPI stats, biểu đồ doanh thu 7 ngày, booking sắp tới, cảnh báo kho, kỹ thuật viên đang trực.

### Objectives
- Xác minh số liệu KPI (Total Bookings, Revenue, New Clients, Low Stock) được load và hiển thị đúng
- Xác minh biểu đồ doanh thu 7 ngày render chính xác
- Xác minh trạng thái loading/error state
- Xác minh navigation từ Dashboard đến các module khác

### Test Data
- Tài khoản: `elena@angelnail.co.nz` / `admin123` (ADMIN)
- Seed data: ≥1 booking PENDING, ≥1 sản phẩm low stock

---

## Test Cases

---

### TC-DASH-001 — Hiển thị KPI Stats Cards

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-DASH-001 |
| **Title** | Dashboard Stats Cards hiển thị đúng |
| **Priority** | P0 — Critical |
| **Type** | Functional / Positive |
| **Preconditions** | Đang đăng nhập role ADMIN |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Truy cập `/angel/admin` | Dashboard load |
| 2 | Quan sát 4 stats cards trong khi API đang fetch | Loading skeleton hoặc spinner hiển thị |
| 3 | Chờ API `GET /api/admin/stats` hoàn thành | Cards hiển thị dữ liệu thực |
| 4 | Kiểm tra card "Total Bookings" | Hiển thị số nguyên dương, có label rõ ràng |
| 5 | Kiểm tra card "Revenue" | Hiển thị số tiền định dạng $X,XXX.XX (NZD) |
| 6 | Kiểm tra card "New Clients" | Hiển thị số khách mới trong kỳ |
| 7 | Kiểm tra card "Low Stock" | Hiển thị số lượng item dưới mức tồn kho tối thiểu |
| 8 | Mở Network tab DevTools, kiểm tra `/api/admin/stats` | HTTP 200, response JSON có đầy đủ 4 fields |

**Expected Result:** 4 KPI cards hiển thị đúng giá trị, đúng format, không có NaN hoặc undefined.

---

### TC-DASH-002 — Biểu đồ doanh thu 7 ngày

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-DASH-002 |
| **Title** | Revenue chart 7 ngày render đúng |
| **Priority** | P1 — High |
| **Type** | Functional |
| **Preconditions** | Đang đăng nhập, có booking completed trong 7 ngày qua |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Mở Dashboard | Chart area hiển thị loading state |
| 2 | Chờ chart render | Biểu đồ line/bar với 7 data points (7 ngày) |
| 3 | Hover vào từng data point | Tooltip hiển thị: ngày + doanh thu |
| 4 | Kiểm tra trục X | Hiển thị ngày theo format locale (en-NZ) |
| 5 | Kiểm tra trục Y | Đơn vị $ (NZD), scale hợp lý |
| 6 | Kiểm tra tổng trong chart | Khớp với doanh thu thực tế của 7 ngày |

**Expected Result:** Chart render đúng, không blank, tooltip hoạt động.

---

### TC-DASH-003 — Card Pending Bookings — Drill-down filter

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-DASH-003 |
| **Title** | Click Pending Bookings card → filter đúng danh sách |
| **Priority** | P1 — High |
| **Type** | Functional / Navigation |
| **Preconditions** | Có ≥1 booking status PENDING trong hệ thống |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Quan sát số trên card "Pending Bookings" | Hiển thị số N (N ≥ 1) |
| 2 | Click vào card "Pending Bookings" | Navigate đến `/angel/admin/appointments` |
| 3 | Kiểm tra filter đã được áp dụng | Danh sách chỉ hiển thị bookings có status = PENDING |
| 4 | Đếm số dòng trong danh sách | Khớp với số N trên card Dashboard |

**Expected Result:** Navigation + auto-filter hoạt động đúng.

---

### TC-DASH-004 — Loading State khi fetch API

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-DASH-004 |
| **Title** | Loading spinner hiển thị khi fetch API chậm |
| **Priority** | P2 — Medium |
| **Type** | UX / Performance |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Mở DevTools Network → throttle xuống "Slow 3G" | Network chậm |
| 2 | Reload trang Dashboard | Loading skeleton hoặc spinner hiển thị trên toàn bộ cards và chart |
| 3 | Chờ data load xong | Skeleton/spinner biến mất, data hiển thị |
| 4 | Tắt throttle | Network bình thường |

**Expected Result:** Loading state rõ ràng, không bị blank trắng khi đang fetch.

---

### TC-DASH-005 — Error State khi API thất bại

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-DASH-005 |
| **Title** | Error state hiển thị khi API trả lỗi 500 |
| **Priority** | P1 — High |
| **Type** | Error Handling |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Mở DevTools Network → chặn request đến `/api/admin/stats` | Request fail |
| 2 | Reload Dashboard | Error message hoặc error state component hiển thị |
| 3 | Kiểm tra không có unhandled exception | Console không có uncaught error |
| 4 | Kiểm tra UI còn functional | Sidebar vẫn clickable, không crash toàn trang |

**Expected Result:** UI gracefully handle API error, hiển thị thông báo lỗi thân thiện.

---

### TC-DASH-006 — Danh sách Upcoming Appointments

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-DASH-006 |
| **Title** | Upcoming appointments hiển thị đúng thứ tự thời gian |
| **Priority** | P1 — High |
| **Type** | Functional |
| **Preconditions** | Có ≥3 bookings tương lai (CONFIRMED/PENDING) |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Quan sát section "Upcoming Appointments" trên Dashboard | List booking sắp tới hiển thị |
| 2 | Kiểm tra thứ tự | Sắp xếp tăng dần theo thời gian (gần nhất trước) |
| 3 | Kiểm tra mỗi item | Hiển thị: tên khách, dịch vụ, thời gian, tên thợ, trạng thái |
| 4 | Kiểm tra định dạng thời gian | Format đúng locale en-NZ (DD/MM/YYYY hoặc tương đương) |
| 5 | Click vào 1 booking | Navigate đến chi tiết booking trong Appointments module |

**Expected Result:** Danh sách upcoming đúng, đầy đủ thông tin, clickable.

---

### TC-DASH-007 — Cảnh báo Low Stock trên Dashboard

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-DASH-007 |
| **Title** | Low Stock alerts hiển thị đúng |
| **Priority** | P1 — High |
| **Type** | Functional |
| **Preconditions** | Có ≥1 inventory item dưới ngưỡng tồn kho tối thiểu |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Quan sát khu vực Low Stock | Alert/badge hiển thị màu đỏ / cảnh báo |
| 2 | Kiểm tra danh sách item | Tên item, số lượng hiện tại, số lượng tối thiểu |
| 3 | Click vào alert | Navigate đến `/angel/admin/inventory` với filter low-stock |

**Expected Result:** Cảnh báo kho hiển thị đúng, có thể drill-down vào Inventory.

---

### TC-DASH-008 — Kỹ thuật viên đang trực hôm nay

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-DASH-008 |
| **Title** | Danh sách kỹ thuật viên đang trực hiển thị đúng |
| **Priority** | P2 — Medium |
| **Type** | Functional |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Quan sát section "Staff On Today" / "Technicians Today" | Danh sách thợ có lịch hôm nay |
| 2 | Kiểm tra thông tin mỗi thợ | Avatar, tên, số booking hôm nay |
| 3 | So sánh với My Day hoặc Appointments | Dữ liệu nhất quán |

**Expected Result:** Hiển thị chính xác thợ có mặt hôm nay.
