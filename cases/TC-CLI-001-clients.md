# TC-CLI — Clients (Khách hàng)

**Module:** Client Management  
**URL:** `https://project.vinapage.com/angel/admin/clients`  
**Standard:** IEEE 829 / ISTQB  
**Version:** 1.0 | **Updated:** 2026-05-09  
**Roles:** ADMIN, MANAGER (full) | STAFF (view only)  

---

## Test Plan

### Scope
Kiểm thử hồ sơ khách hàng: tìm kiếm, xem lịch sử, thêm ghi chú nội bộ, cảnh báo dị ứng.

### Objectives
- Tìm kiếm theo tên / email / SĐT hoạt động đúng
- Lịch sử booking và tổng chi tiêu hiển thị chính xác
- Ghi chú nội bộ có thể thêm/sửa
- Cảnh báo dị ứng hiển thị nổi bật

---

## Test Cases

---

### TC-CLI-001 — Tìm kiếm khách hàng

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-CLI-001 |
| **Title** | Tìm kiếm khách hàng theo tên, email, SĐT |
| **Priority** | P0 — Critical |
| **Type** | Functional |
| **Preconditions** | DB có ≥5 khách hàng với thông tin đa dạng |

**Test Data:**
- Client: Jane Smith, jane.smith@test.com, +64 21 111 2222

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Truy cập `/angel/admin/clients` | Danh sách khách hàng hiển thị (paginated) |
| 2 | Nhập "Jane" vào search box | Kết quả filter real-time hoặc sau Enter: "Jane Smith" xuất hiện |
| 3 | Xóa search, nhập "jane.smith@test.com" | Tìm đúng Jane Smith theo email |
| 4 | Xóa search, nhập "+64 21 111 2222" | Tìm đúng Jane Smith theo SĐT |
| 5 | Nhập "xyz_not_exist_9999" | Empty state: "No clients found" |
| 6 | Nhập từ khóa partial "jan" | Kết quả bao gồm tất cả client có "jan" trong tên/email |

**Expected Result:** Tìm kiếm chính xác theo tất cả 3 trường (tên, email, SĐT).

---

### TC-CLI-002 — Xem lịch sử booking và tổng chi tiêu

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-CLI-002 |
| **Title** | Hồ sơ khách hàng — lịch sử booking và tổng chi tiêu |
| **Priority** | P1 — High |
| **Type** | Functional / Data Accuracy |
| **Preconditions** | Khách "Jane Smith" có 3 bookings COMPLETED |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click vào "Jane Smith" trong danh sách | Trang hồ sơ client mở |
| 2 | Kiểm tra thông tin cơ bản | Họ tên, email, SĐT, ngày đăng ký |
| 3 | Xem section "Booking History" | Danh sách 3 bookings của Jane |
| 4 | Kiểm tra từng booking | Ngày, dịch vụ, thợ, giá, trạng thái |
| 5 | Kiểm tra "Total Spent" | Tổng = sum của tất cả bookings COMPLETED (đúng $) |
| 6 | Kiểm tra "Total Visits" | Đếm đúng số lần visit |
| 7 | Kiểm tra thứ tự lịch sử | Booking mới nhất ở trên |

**Expected Result:** Lịch sử chính xác, tổng chi tiêu tính đúng.

---

### TC-CLI-003 — Thêm ghi chú nội bộ

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-CLI-003 |
| **Title** | Thêm và sửa ghi chú nội bộ cho khách |
| **Priority** | P1 — High |
| **Type** | Functional |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Mở hồ sơ khách hàng | Profile page |
| 2 | Tìm section "Internal Notes" | Textarea hoặc note component |
| 3 | Nhập ghi chú: "VIP client, prefers OPI gel polish" | Text nhập vào |
| 4 | Click "Save Note" | Ghi chú được lưu |
| 5 | Reload trang | Ghi chú vẫn còn |
| 6 | Đăng nhập thợ khác (STAFF) | Thợ khác nhìn thấy ghi chú nội bộ |
| 7 | Kiểm tra ghi chú KHÔNG hiển thị trên public | Public site không có nội dung ghi chú nội bộ |

**Expected Result:** Ghi chú nội bộ persist, visible cho staff, không lộ ra public.

---

### TC-CLI-004 — Cảnh báo dị ứng / lưu ý đặc biệt

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-CLI-004 |
| **Title** | Cảnh báo dị ứng hiển thị nổi bật trên hồ sơ và booking |
| **Priority** | P0 — Critical |
| **Type** | Functional / Safety |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Mở hồ sơ khách, thêm allergy alert: "Allergic to acetone" | Field nhận input |
| 2 | Save | Alert được lưu |
| 3 | Kiểm tra hồ sơ | Banner/badge màu đỏ/vàng nổi bật với cảnh báo dị ứng |
| 4 | Mở booking của khách này từ Appointments | Chi tiết booking hiển thị cảnh báo dị ứng của khách |
| 5 | Tạo booking mới cho khách này | Modal booking có warning banner |

**Expected Result:** Cảnh báo dị ứng luôn hiển thị khi tương tác với khách đó.

---

### TC-CLI-005 — Phân trang danh sách khách hàng

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-CLI-005 |
| **Title** | Pagination danh sách clients |
| **Priority** | P2 — Medium |
| **Type** | Functional / UX |
| **Preconditions** | DB có >20 clients |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Mở `/angel/admin/clients` | Trang 1, hiển thị N clients/page (VD: 20) |
| 2 | Kiểm tra pagination controls | "Previous / 1 / 2 / 3 / Next" |
| 3 | Click page 2 | Danh sách clients tiếp theo |
| 4 | Click "Previous" | Quay lại page 1 |
| 5 | Thử scroll infinite hoặc "Load More" | Hoạt động đúng nếu dùng infinite scroll |

---

### TC-CLI-006 — Sắp xếp danh sách

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-CLI-006 |
| **Title** | Sort danh sách khách theo các trường |
| **Priority** | P2 — Medium |
| **Type** | Functional |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click header "Name" | Sort A→Z |
| 2 | Click lại "Name" | Sort Z→A |
| 3 | Click "Total Spent" | Sort theo tổng chi tiêu giảm dần |
| 4 | Click "Last Visit" | Sort theo lần visit gần nhất |
