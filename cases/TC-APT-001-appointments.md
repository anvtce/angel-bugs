# TC-APT — Appointments (Lịch hẹn)

**Module:** Appointments Management  
**URL:** `https://project.vinapage.com/angel/admin/appointments`  
**Standard:** IEEE 829 / ISTQB  
**Version:** 1.1 | **Updated:** 2026-05-09  
**Roles:** ADMIN, MANAGER (full CRUD) | STAFF (view/update own)  

---

## Test Plan

### Scope
Kiểm thử module Appointments — danh sách lịch hẹn theo ngày, tạo/sửa/hoàn thành/huỷ booking, filter theo trạng thái và tìm kiếm.

> **Ghi chú UI (v1.1):** Module Appointments sử dụng **list view** (không phải weekly calendar). Giao diện gồm: bộ lọc ngày (chip buttons), thanh tìm kiếm, dropdown trạng thái, 4 counter cards (CHỜ XỬ LÝ / XÁC NHẬN / HOÀN THÀNH / ĐÃ HUỶ), và danh sách booking theo ngày.

### Objectives
- Xác minh danh sách booking hiển thị đúng theo ngày đã chọn
- Xác minh tạo booking mới qua nút "+ Tạo lịch hẹn"
- Xác minh cập nhật trạng thái booking: XÁC NHẬN → HOÀN THÀNH | ĐÃ HUỶ
- Xác minh filter và tìm kiếm hoạt động đúng
- Xác minh không cho tạo booking trùng giờ cùng staff

### Business Rules
- Booking status flow: CHỜ XỬ LÝ → XÁC NHẬN → HOÀN THÀNH | ĐÃ HUỶ
- Không tạo 2 booking cùng staff cùng giờ (conflict check)
- Huỷ booking → status = ĐÃ HUỶ, không xóa khỏi DB
- Múi giờ: Pacific/Auckland (NZST)

### Status Labels (UI → API)
| UI (tiếng Việt) | API value | Màu |
|-----------------|-----------|-----|
| CHỜ XỬ LÝ | PENDING | - |
| XÁC NHẬN | CONFIRMED | xanh lá |
| HOÀN THÀNH | COMPLETED | - |
| ĐÃ HUỶ | CANCELLED | - |

---

## Test Cases

---

### TC-APT-001 — List View — Lọc theo ngày

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-APT-001 |
| **Title** | Danh sách lịch hẹn — lọc ngày bằng chip buttons |
| **Priority** | P1 — High |
| **Type** | Functional |
| **Preconditions** | Đăng nhập ADMIN, có bookings trong nhiều ngày |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Truy cập `/angel/admin/appointments` | Trang "Lịch hẹn" hiển thị với date picker và chip buttons |
| 2 | Quan sát khu vực "Lọc theo ngày:" | Chip "Hôm nay" + các ngày gần đây + date input (dd/mm/yyyy) |
| 3 | Click chip "Hôm nay" | Danh sách chỉ hiển thị bookings ngày hôm nay, tiêu đề "N lịch hẹn ngày [Thứ], [D] [Month]" |
| 4 | Nhập ngày cụ thể vào date input | Danh sách lọc đúng ngày đó |
| 5 | Click chip ngày khác | Danh sách cập nhật theo ngày mới |
| 6 | Kiểm tra mỗi booking item | Hiển thị: avatar+tên khách, trạng thái badge, "Pay in salon", SĐT, tên dịch vụ, giờ·thời lượng, giá, tên KTV, mã Ref: AN-XXXXXX |
| 7 | Kiểm tra nút actions | Mỗi booking có nút: Edit (bút), Hoàn thành (✓), Huỷ (✗) |

**Expected Result:** Lọc ngày hoạt động chính xác, mỗi booking hiển thị đầy đủ thông tin.

---

### TC-APT-002 — Tạo lịch hẹn mới

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-APT-002 |
| **Title** | Tạo lịch hẹn mới qua nút "+ Tạo lịch hẹn" |
| **Priority** | P0 — Critical |
| **Type** | Functional / Positive |
| **Preconditions** | Đăng nhập ADMIN/MANAGER |

**Test Data:**
- Khách: John Doe, john.doe@test.com, +64 21 000 0001
- Dịch vụ: Gel Manicure (60 min)
- Thợ: Bất kỳ thợ Available
- Ngày giờ: Ngày mai 10:00 AM

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click nút "+ Tạo lịch hẹn" (góc trên phải) | Modal/form "Tạo lịch hẹn mới" mở ra |
| 2 | Kiểm tra form | Có fields: Khách, Dịch vụ, KTV, Ngày, Giờ, Ghi chú |
| 3 | Chọn Dịch vụ từ dropdown | Dropdown liệt kê đầy đủ dịch vụ Active |
| 4 | Chọn KTV | Dropdown chỉ hiển thị thợ Available |
| 5 | Nhập thông tin khách: Tên, Email, SĐT | Fields nhận input |
| 6 | Chọn ngày giờ | Date/time picker hoạt động |
| 7 | Thêm ghi chú (optional) | Field nhận text |
| 8 | Click "Lưu" / "Tạo" | Gọi `POST /api/admin/bookings` |
| 9 | Kiểm tra response | HTTP 201, booking ID được tạo |
| 10 | Kiểm tra danh sách | Booking mới xuất hiện khi lọc ngày tương ứng |
| 11 | Kiểm tra Audit Log | Ghi nhận action CREATE booking |

**Expected Result:** Booking tạo thành công, hiển thị trong danh sách, ghi audit log.

---

### TC-APT-003 — Xem chi tiết booking & Đổi trạng thái

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-APT-003 |
| **Title** | Click Edit → xem chi tiết + đổi trạng thái qua nút actions |
| **Priority** | P0 — Critical |
| **Type** | Functional |
| **Preconditions** | Có ≥1 booking XÁC NHẬN trong danh sách |

> **Ghi chú UI:** Không có status dropdown trực tiếp trên card. Thay đổi trạng thái qua nút "Hoàn thành" (COMPLETED) và "Huỷ" (CANCELLED) trực tiếp, hoặc qua modal Edit.

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Tìm booking có status "XÁC NHẬN" | Booking card hiển thị trong danh sách |
| 2 | Kiểm tra thông tin trên card | Tên khách, dịch vụ, KTV, ngày giờ, giá, mã Ref (AN-XXXXXX), SĐT |
| 3 | Click nút "Edit" (bút chì) | Modal sửa booking mở với data pre-filled |
| 4 | Kiểm tra modal edit | Có trường trạng thái với options: CHỜ XỬ LÝ, XÁC NHẬN, HOÀN THÀNH, ĐÃ HUỶ |
| 5 | Click nút "Hoàn thành" (✓) trực tiếp trên card | Confirmation dialog: "Xác nhận hoàn thành lịch hẹn?" |
| 6 | Xác nhận | `PATCH /api/admin/bookings/{id}` với status=COMPLETED |
| 7 | Kiểm tra card | Badge status đổi sang "HOÀN THÀNH" |

**Expected Result:** Đổi trạng thái thành công, phản ánh ngay trên UI.

**Test Status Flow to verify:**

| From | To | Button/Action | Expected |
|------|----|---------------|----------|
| CHỜ XỬ LÝ | XÁC NHẬN | Edit modal | ✓ Allowed |
| CHỜ XỬ LÝ | ĐÃ HUỶ | Nút Huỷ | ✓ Allowed |
| XÁC NHẬN | HOÀN THÀNH | Nút Hoàn thành | ✓ Allowed |
| XÁC NHẬN | ĐÃ HUỶ | Nút Huỷ | ✓ Allowed |
| HOÀN THÀNH | CHỜ XỬ LÝ | Edit modal | ? (Business rule check) |
| ĐÃ HUỶ | XÁC NHẬN | Edit modal | ? (Business rule check) |

---

### TC-APT-004 — Huỷ booking

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-APT-004 |
| **Title** | Huỷ booking — status ĐÃ HUỶ, giữ lại trong DB |
| **Priority** | P0 — Critical |
| **Type** | Functional |
| **Preconditions** | Có booking CHỜ XỬ LÝ hoặc XÁC NHẬN |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Tìm booking cần huỷ trong danh sách | Booking card hiển thị |
| 2 | Click nút "Huỷ" (✗ màu đỏ) | Confirmation dialog: "Xác nhận huỷ lịch hẹn?" |
| 3 | Click "Xác nhận" | `PATCH /api/admin/bookings/{id}` với status=CANCELLED |
| 4 | Kiểm tra danh sách | Booking vẫn hiển thị với badge "ĐÃ HUỶ" |
| 5 | Kiểm tra counter card "ĐÃ HUỶ" | Số tăng lên 1 |
| 6 | Kiểm tra database (qua API) | `GET /api/admin/bookings/{id}` → status=CANCELLED, không bị xóa |
| 7 | Kiểm tra Audit Log | Ghi nhận action UPDATE với trường status |

**Expected Result:** Booking status = ĐÃ HUỶ, data vẫn tồn tại trong DB, slot được giải phóng.

---

### TC-APT-005 — Tìm kiếm booking

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-APT-005 |
| **Title** | Tìm kiếm booking theo tên, email, SĐT, mã tham chiếu |
| **Priority** | P1 — High |
| **Type** | Functional |
| **Preconditions** | Có ≥3 bookings với thông tin khác nhau |

> **Ghi chú UI:** Thanh tìm kiếm có placeholder "Search by reference, name, email, phone..."

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Nhập tên khách vào thanh tìm kiếm | Danh sách lọc real-time, chỉ hiển thị bookings khớp tên |
| 2 | Nhập email khách | Lọc đúng |
| 3 | Nhập SĐT | Lọc đúng |
| 4 | Nhập mã Ref (VD: AN-260506ABHL) | Tìm đúng booking đó |
| 5 | Xóa hết nội dung tìm kiếm | Danh sách hiển thị lại tất cả bookings của ngày đó |

---

### TC-APT-006 — Filter theo Trạng thái

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-APT-006 |
| **Title** | Filter danh sách theo trạng thái booking |
| **Priority** | P1 — High |
| **Type** | Functional |

> **Ghi chú UI:** Dropdown filter "All statuses" ở góc phải thanh tìm kiếm. Counter cards (CHỜ XỬ LÝ / XÁC NHẬN / HOÀN THÀNH / ĐÃ HUỶ) hiển thị số liệu nhưng không phải filter button.

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Mở Appointments | Dropdown "All statuses" hiển thị toàn bộ bookings ngày hiện tại |
| 2 | Chọn "CHỜ XỬ LÝ" / "PENDING" trong dropdown | Chỉ hiển thị bookings CHỜ XỬ LÝ |
| 3 | Chọn "XÁC NHẬN" / "CONFIRMED" | Chỉ hiển thị bookings XÁC NHẬN |
| 4 | Chọn "HOÀN THÀNH" / "COMPLETED" | Chỉ hiển thị bookings HOÀN THÀNH |
| 5 | Chọn "ĐÃ HUỶ" / "CANCELLED" | Chỉ hiển thị bookings ĐÃ HUỶ |
| 6 | Chọn "All statuses" | Tất cả bookings hiển thị lại |

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
| 1 | Click "+ Tạo lịch hẹn" | Modal tạo booking mở |
| 2 | Chọn: Thợ A, ngày mai 10:30 AM, dịch vụ 30 phút | Form điền đầy đủ |
| 3 | Submit | API trả lỗi conflict |
| 4 | Kiểm tra error message | "This time slot is already booked for this technician" hoặc tương đương |
| 5 | Kiểm tra danh sách | Booking cũ vẫn nguyên vẹn, booking mới KHÔNG được tạo |
| 6 | Tạo lại booking cùng thợ A nhưng 11:30 AM | Không conflict → tạo thành công |

**Expected Result:** Hệ thống từ chối booking conflict, thông báo lỗi rõ ràng.

---

### TC-APT-008 — Sửa booking (Reschedule)

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-APT-008 |
| **Title** | Reschedule booking sang giờ/ngày khác qua nút Edit |
| **Priority** | P1 — High |
| **Type** | Functional |
| **Preconditions** | Có booking XÁC NHẬN |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click nút "Edit" (bút chì) trên booking | Modal chỉnh sửa mở với data pre-filled |
| 2 | Kiểm tra modal | Tất cả fields được điền sẵn đúng |
| 3 | Đổi ngày giờ | Date/time picker mở, có thể chọn ngày/giờ mới |
| 4 | Chọn slot không bị trùng, save | `PATCH /api/admin/bookings/{id}` |
| 5 | Kiểm tra danh sách | Booking cập nhật thời gian mới khi lọc ngày mới |
| 6 | Đổi sang slot đang có booking khác cùng KTV | Error conflict hiển thị |

**Expected Result:** Reschedule thành công, danh sách cập nhật đúng.
