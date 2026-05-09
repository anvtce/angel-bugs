# TC-BK — Booking Flow (Luồng đặt lịch 6 bước)

**Module:** Public Booking Flow  
**URL:** `https://project.vinapage.com/angel/booking`  
**Standard:** IEEE 829 / ISTQB  
**Version:** 1.0 | **Updated:** 2026-05-09  
**Roles:** Guest (public, không cần đăng nhập)  

---

## Test Plan

### Scope
Kiểm thử luồng đặt lịch 6 bước từ phía khách hàng — tính năng quan trọng nhất của hệ thống. Mỗi bước phải pass checklist riêng và chuyển bước mượt mà.

### Flow Overview

```
Bước 1: Chọn dịch vụ    → /angel/booking
Bước 2: Chọn thợ        → /angel/booking/artist
Bước 3: Chọn ngày/giờ  → /angel/booking/schedule
Bước 4: Thông tin khách → /angel/booking/review
Bước 5: Xác nhận        → /angel/booking/review (confirm)
Bước 6: Thành công      → /angel/booking/success
```

### Test Accounts (Public — không cần login)
- Tên: John Doe
- Email: john.doe.test@test.com
- SĐT: +64 21 000 1234

---

## Test Cases

---

### TC-BK-001 — Bước 1: Chọn dịch vụ

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-BK-001 |
| **Title** | Bước 1 — Chọn dịch vụ đúng, nút Next hoạt động |
| **Priority** | P0 — Critical |
| **Type** | Functional / UX |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Truy cập `/angel/booking` | Trang chọn dịch vụ với các tab nhóm |
| 2 | Click tab "Manicure" | Hiển thị các dịch vụ trong nhóm Manicure |
| 3 | Click tab "Pedicure" | Chuyển sang nhóm Pedicure |
| 4 | Click tab "Nail Art" | Chuyển sang Nail Art |
| 5 | Kiểm tra từng service card | Hiển thị đúng: Tên, Mô tả, Giá ($), Thời gian (min) |
| 6 | Click "Next Step" khi chưa chọn dịch vụ | Nút bị disabled hoặc báo "Please select a service" |
| 7 | Click chọn "Gel Manicure" | Card highlighted, nút "Next Step" sáng lên |
| 8 | Click "Next Step" | Navigate đến Bước 2 `/angel/booking/artist` |
| 9 | Kiểm tra progress bar | Bước 1 completed, Bước 2 active |

---

### TC-BK-002 — Bước 2: Chọn kỹ thuật viên

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-BK-002 |
| **Title** | Bước 2 — Chọn thợ, go back giữ state |
| **Priority** | P0 — Critical |
| **Type** | Functional |
| **Preconditions** | Đã chọn "Gel Manicure" ở Bước 1 |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Trang `/angel/booking/artist` | Danh sách thợ Available cho "Gel Manicure" |
| 2 | Kiểm tra thợ hiển thị | Chỉ thợ có Gel Manicure trong specialties VÀ available=true |
| 3 | Kiểm tra "No Preference" option | Có lựa chọn này — hệ thống tự gán |
| 4 | Chọn "No Preference" | Option highlighted |
| 5 | Click "Go Back" | Quay lại Bước 1, "Gel Manicure" VẪN được chọn |
| 6 | Click "Next Step" lại → Bước 2 | Lựa chọn trước vẫn giữ (nếu chưa đổi) |
| 7 | Chọn thợ cụ thể "Nguyen Thi Mai" | Card highlighted |
| 8 | Click "Continue to Schedule" | Navigate đến Bước 3 |

---

### TC-BK-003 — Bước 3: Chọn ngày và giờ

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-BK-003 |
| **Title** | Bước 3 — Calendar, slot trống/đã đặt, ngày quá khứ |
| **Priority** | P0 — Critical |
| **Type** | Functional |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Trang `/angel/booking/schedule` | Calendar tháng hiện tại + danh sách slots |
| 2 | Click vào ngày hôm qua | Không được chọn (disabled) |
| 3 | Click vào ngày hôm nay | Có thể chọn (nếu còn giờ trong ngày) |
| 4 | Click vào ngày mai | Selected, API `POST /api/bookings/availability` gọi |
| 5 | Kiểm tra slots hiển thị | Slots trong giờ mở cửa của tiệm |
| 6 | Slot đã có booking | Disabled (grey/strikethrough) |
| 7 | Slot trống | Clickable |
| 8 | Click slot 10:00 AM | Slot selected, highlight |
| 9 | Đổi ngày khác | Load lại slots mới |
| 10 | Click ngày Chủ Nhật (nếu đóng cửa) | Không có slot nào |
| 11 | Click "Continue" | Navigate đến Bước 4 |

---

### TC-BK-004 — Bước 4: Nhập thông tin khách

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-BK-004 |
| **Title** | Bước 4 — Form thông tin + validation + summary đúng |
| **Priority** | P0 — Critical |
| **Type** | Functional / Validation |

**Test Data:**
- Tên: John Doe
- Email: john.doe.test@test.com
- SĐT: +64 21 000 1234
- Ghi chú: "Please use OPI gel, allergic to acrylic"

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Trang `/angel/booking/review` | Form + Summary bên phải |
| 2 | Kiểm tra Summary | Đúng: Dịch vụ, Thợ, Ngày, Giờ, Giá |
| 3 | Bỏ trống tất cả, click Confirm | Validation errors hiển thị |
| 4 | Nhập First Name, Last Name | Fields nhận input |
| 5 | Nhập email sai định dạng "john@" | Error: "Invalid email format" |
| 6 | Nhập email đúng "john.doe.test@test.com" | Valid |
| 7 | Nhập SĐT sai định dạng "abc" | Error: "Invalid phone number" |
| 8 | Nhập SĐT đúng "+64 21 000 1234" | Valid |
| 9 | Nhập ghi chú | Optional, không bắt buộc |
| 10 | Tất cả fields hợp lệ | Nút "Confirm Booking" active |
| 11 | Click "Confirm Booking" | `POST /api/bookings` |
| 12 | Kiểm tra response | HTTP 201, booking reference AN-XXXXXXXXXX |

---

### TC-BK-005 — Bước 6: Trang xác nhận thành công

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-BK-005 |
| **Title** | Success page hiển thị mã booking đúng |
| **Priority** | P0 — Critical |
| **Type** | Functional |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Sau khi Confirm Booking thành công | Redirect đến `/angel/booking/success` |
| 2 | Kiểm tra mã booking | Format AN-YYMMDDXXXX (VD: AN-2605091234) |
| 3 | Kiểm tra thông tin tóm tắt | Dịch vụ, Thợ, Ngày giờ, Giá |
| 4 | Click "Return to Home" | Redirect về `/angel` |
| 5 | Nhấn Back browser | Không cho quay lại form đã submit |
| 6 | Refresh trang success | Vẫn hiển thị mã booking (session/state preserved) |

---

### TC-BK-006 — Luồng E2E Complete — Happy Path

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-BK-006 |
| **Title** | End-to-End: Đặt lịch thành công + booking xuất hiện trong Admin |
| **Priority** | P0 — Critical |
| **Type** | E2E / Integration |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Thực hiện toàn bộ Bước 1→6 | Booking AN-XXXXXXXXXX tạo thành công |
| 2 | Đăng nhập Admin | ADMIN session |
| 3 | Mở Appointments | Booking mới xuất hiện với status PENDING |
| 4 | Kiểm tra thông tin | Đúng với những gì khách đã nhập |
| 5 | Kiểm tra slot đó trong Availability | Slot ngày/giờ đó đã bị block (không còn available) |
| 6 | Kiểm tra Clients | Khách "John Doe" được tạo hoặc cập nhật |
| 7 | Kiểm tra Audit Log | CREATE booking entry |

---

### TC-BK-007 — Trùng giờ — Booking bị từ chối

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-BK-007 |
| **Title** | Không cho tạo booking trùng giờ cùng thợ |
| **Priority** | P0 — Critical |
| **Type** | Functional / Negative |
| **Preconditions** | Thợ "Nguyen Thi Mai" đã có booking 10:00-11:00 ngày mai |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Bước 3: Chọn ngày mai, thợ Mai | Slot 10:00 bị disabled |
| 2 | Thử chọn 10:30 (nếu dịch vụ 60 phút overlap) | Slot bị disabled |
| 3 | Chọn slot 11:30 | Slot available |
| 4 | Nếu race condition: 2 user cùng book 10:00 đồng thời | Chỉ 1 booking được tạo, cái sau nhận lỗi 409 Conflict |

---

### TC-BK-008 — Tra cứu và Hủy Booking từ Public Site

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-BK-008 |
| **Title** | Manage Booking — tra cứu và hủy bằng email/SĐT |
| **Priority** | P1 — High |
| **Type** | Functional |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Truy cập `/angel/manage-booking` | Form tra cứu: Email + SĐT hoặc mã tham chiếu |
| 2 | Nhập email "john.doe.test@test.com" + SĐT "+64 21 000 1234" | `POST /api/bookings/lookup` |
| 3 | Xem danh sách booking | Các booking của John Doe |
| 4 | Click "Cancel Booking" trên booking PENDING | Confirmation dialog |
| 5 | Confirm cancel | Booking status = CANCELLED |
| 6 | Kiểm tra admin Appointments | Status cập nhật CANCELLED |
| 7 | Nhập mã tham chiếu AN-XXXXXXXXXX trực tiếp | Tìm đúng booking đó |
| 8 | Nhập thông tin sai | Empty state: "No bookings found" |
