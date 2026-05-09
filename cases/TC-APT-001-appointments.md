# TC-APT — Appointments (Lịch hẹn)

**Module:** Appointments Management  
**URL:** `https://project.vinapage.com/angel/admin/appointments`  
**Standard:** IEEE 829 / ISTQB  
**Version:** 1.0 | **Updated:** 2026-05-09  
**Roles:** ADMIN, MANAGER (full CRUD) | STAFF (view/update own)  

---

## Test Plan

### Scope
Kiểm thử module Appointments — calendar tuần, tạo/sửa/hủy booking, filter theo staff và trạng thái. Đây là module trung tâm của hệ thống, ảnh hưởng trực tiếp đến vận hành tiệm.

### Objectives
- Xác minh calendar tuần hiển thị đúng, navigation prev/next tuần
- Xác minh tạo booking mới từ slot trống (modal)
- Xác minh cập nhật trạng thái booking: CONFIRMED / COMPLETED / CANCELLED / NO_SHOW
- Xác minh filter theo staff và trạng thái
- Xác minh không cho tạo booking trùng giờ cùng staff

### Business Rules
- Booking status flow: PENDING → CONFIRMED → COMPLETED | CANCELLED | NO_SHOW
- Không tạo 2 booking cùng staff cùng giờ (conflict check)
- Hủy booking → status = CANCELLED, không xóa khỏi DB
- Múi giờ: Pacific/Auckland (NZST)

---

## Test Cases

---

### TC-APT-001 — Calendar tuần — Navigation Prev/Next

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-APT-001 |
| **Title** | Calendar navigation tuần hoạt động đúng |
| **Priority** | P1 — High |
| **Type** | Functional |
| **Preconditions** | Đăng nhập ADMIN, có bookings trong 2 tuần liên tiếp |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Truy cập `/angel/admin/appointments` | Calendar tuần hiện tại hiển thị |
| 2 | Kiểm tra header | Hiển thị khoảng ngày của tuần (VD: "Mon 5 May — Sun 11 May 2025") |
| 3 | Click nút "Next Week" / "→" | Calendar chuyển sang tuần tiếp theo |
| 4 | Kiểm tra header | Ngày đã tăng lên 7 ngày |
| 5 | Click nút "Prev Week" / "←" | Calendar quay lại tuần hiện tại |
| 6 | Click nút "Today" | Calendar nhảy về tuần chứa ngày hôm nay |
| 7 | Kiểm tra bookings hiển thị | Mỗi booking hiện trong đúng slot giờ của ngày |

**Expected Result:** Navigation tuần hoạt động chính xác, bookings hiển thị đúng vị trí time slot.

---

### TC-APT-002 — Tạo booking mới từ slot trống

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-APT-002 |
| **Title** | Tạo booking mới bằng cách click slot trống trên calendar |
| **Priority** | P0 — Critical |
| **Type** | Functional / Positive |
| **Preconditions** | Đăng nhập ADMIN/MANAGER, có slot trống trong tuần hiện tại |

**Test Data:**
- Khách: John Doe, john.doe@test.com, +64 21 000 0001
- Dịch vụ: Gel Manicure (60 min)
- Thợ: Bất kỳ thợ Available
- Ngày giờ: Ngày mai 10:00 AM

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click vào slot trống trên calendar (VD: Thứ 3, 10:00) | Modal "New Appointment" mở ra |
| 2 | Kiểm tra modal | Pre-filled ngày + giờ dựa trên slot đã click |
| 3 | Chọn Dịch vụ từ dropdown | Dropdown liệt kê đầy đủ dịch vụ Active |
| 4 | Chọn Thợ | Dropdown chỉ hiển thị thợ Available vào thời điểm đó |
| 5 | Nhập thông tin khách: Tên, Email, SĐT | Fields nhận input |
| 6 | Thêm ghi chú (optional) | Field nhận text |
| 7 | Click "Create Booking" / "Confirm" | Gọi `POST /api/admin/bookings` |
| 8 | Kiểm tra response | HTTP 201, booking ID được tạo |
| 9 | Kiểm tra calendar | Booking mới xuất hiện trên đúng slot |
| 10 | Kiểm tra Audit Log | Ghi nhận action CREATE booking |

**Expected Result:** Booking tạo thành công, hiển thị ngay trên calendar, ghi audit log.

---

### TC-APT-003 — Xem chi tiết booking & Đổi trạng thái

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-APT-003 |
| **Title** | Click booking → xem chi tiết + đổi trạng thái |
| **Priority** | P0 — Critical |
| **Type** | Functional |
| **Preconditions** | Có ≥1 booking CONFIRMED trên calendar |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click vào một booking có sẵn trên calendar | Detail modal/panel mở ra |
| 2 | Kiểm tra thông tin hiển thị | Tên khách, dịch vụ, thợ, ngày giờ, trạng thái, mã booking (AN-XXXXXXXXXX), SĐT, ghi chú |
| 3 | Click dropdown "Status" | Các option: PENDING, CONFIRMED, COMPLETED, CANCELLED, NO_SHOW |
| 4 | Chọn "COMPLETED" | Confirmation dialog hoặc trực tiếp update |
| 5 | Xác nhận | `PATCH /api/admin/bookings/{id}` được gọi |
| 6 | Kiểm tra calendar | Booking chip đổi màu/label tương ứng với COMPLETED |
| 7 | Mở lại booking | Status hiển thị COMPLETED |

**Expected Result:** Đổi trạng thái thành công, phản ánh ngay trên UI.

**Test Status Flow to verify:**

| From | To | Expected |
|------|----|----------|
| PENDING | CONFIRMED | ✓ Allowed |
| PENDING | CANCELLED | ✓ Allowed |
| CONFIRMED | COMPLETED | ✓ Allowed |
| CONFIRMED | NO_SHOW | ✓ Allowed |
| CONFIRMED | CANCELLED | ✓ Allowed |
| COMPLETED | PENDING | ? (Business rule check) |
| CANCELLED | CONFIRMED | ? (Business rule check) |

---

### TC-APT-004 — Hủy booking

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-APT-004 |
| **Title** | Hủy booking — status CANCELLED, giữ lại trong DB |
| **Priority** | P0 — Critical |
| **Type** | Functional |
| **Preconditions** | Có booking PENDING hoặc CONFIRMED |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Mở chi tiết booking | Detail panel hiển thị |
| 2 | Click "Cancel Booking" | Confirmation dialog: "Are you sure?" |
| 3 | Click "Confirm Cancel" | `PATCH /api/admin/bookings/{id}` với status=CANCELLED |
| 4 | Kiểm tra calendar | Booking chip vẫn hiển thị (màu xám/khác biệt) với label CANCELLED |
| 5 | Kiểm tra database (qua API) | `GET /api/admin/bookings/{id}` → status=CANCELLED, không bị xóa |
| 6 | Kiểm tra Audit Log | Ghi nhận action UPDATE với trường status |
| 7 | Kiểm tra slot đó trên public booking | Slot giờ đó nay Available lại cho khách book |

**Expected Result:** Booking status = CANCELLED, data vẫn tồn tại trong DB, slot được giải phóng.

---

### TC-APT-005 — Filter theo Staff

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-APT-005 |
| **Title** | Filter calendar theo staff cụ thể |
| **Priority** | P1 — High |
| **Type** | Functional |
| **Preconditions** | Có ≥2 thợ, mỗi thợ có ≥1 booking |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Mở Appointments | Toàn bộ bookings hiển thị |
| 2 | Chọn Staff filter: "Nguyen Van A" | Calendar chỉ hiển thị bookings của Nguyen Van A |
| 3 | Chọn Staff filter: "Tran Thi B" | Calendar chỉ hiển thị bookings của Tran Thi B |
| 4 | Chọn "All Staff" | Toàn bộ bookings hiển thị lại |

**Expected Result:** Filter hoạt động đúng, không hiển thị nhầm booking của thợ khác.

---

### TC-APT-006 — Filter theo Trạng thái

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-APT-006 |
| **Title** | Filter danh sách theo trạng thái booking |
| **Priority** | P1 — High |
| **Type** | Functional |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Chuyển sang List View (nếu có) | Danh sách tất cả bookings |
| 2 | Chọn filter "PENDING" | Chỉ hiển thị bookings PENDING |
| 3 | Chọn filter "CONFIRMED" | Chỉ hiển thị bookings CONFIRMED |
| 4 | Chọn filter "COMPLETED" | Chỉ hiển thị bookings COMPLETED |
| 5 | Chọn filter "CANCELLED" | Chỉ hiển thị bookings CANCELLED |
| 6 | Chọn "All" | Tất cả bookings |

---

### TC-APT-007 — Chống tạo booking trùng giờ cùng staff

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-APT-007 |
| **Title** | Conflict detection — từ chối booking trùng giờ cùng staff |
| **Priority** | P0 — Critical |
| **Type** | Functional / Negative / Business Rule |
| **Preconditions** | Thợ A có booking 10:00-11:00 ngày mai |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Tạo booking mới: Thợ A, ngày mai 10:30 AM, dịch vụ 30 phút | Form điền đầy đủ |
| 2 | Submit | API trả lỗi conflict |
| 3 | Kiểm tra error message | "This time slot is already booked for this technician" hoặc tương đương |
| 4 | Kiểm tra calendar | Booking cũ vẫn nguyên vẹn, booking mới KHÔNG được tạo |
| 5 | Tạo lại booking cùng thợ A nhưng 11:30 AM | Không conflict → tạo thành công |

**Expected Result:** Hệ thống từ chối booking conflict, thông báo lỗi rõ ràng.

---

### TC-APT-008 — Sửa booking (Reschedule)

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-APT-008 |
| **Title** | Reschedule booking sang giờ/ngày khác |
| **Priority** | P1 — High |
| **Type** | Functional |
| **Preconditions** | Có booking CONFIRMED |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Mở chi tiết booking | Detail panel mở |
| 2 | Click "Edit" / "Reschedule" | Form chỉnh sửa với các field hiện tại pre-filled |
| 3 | Đổi ngày giờ | Date/time picker mở, có thể chọn slot trống mới |
| 4 | Kiểm tra conflict với slot mới | Nếu slot mới bị trùng → báo lỗi |
| 5 | Chọn slot không bị trùng, save | `PATCH /api/admin/bookings/{id}` |
| 6 | Kiểm tra calendar | Booking di chuyển sang slot mới trên calendar |

**Expected Result:** Reschedule thành công, calendar cập nhật đúng.
