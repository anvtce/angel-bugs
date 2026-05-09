# TC-STF — Staff (Kỹ thuật viên)

**Module:** Staff Management  
**URL:** `https://project.vinapage.com/angel/admin/staff`  
**Standard:** IEEE 829 / ISTQB  
**Version:** 1.0 | **Updated:** 2026-05-09  
**Roles:** ADMIN, MANAGER (CRUD) | STAFF (view own profile)  

---

## Test Plan

### Scope
Kiểm thử quản lý kỹ thuật viên: thêm/sửa/xóa staff, upload avatar, gán dịch vụ chuyên môn, bật/tắt nhận booking.

### Business Rules
- Staff Available=false → không hiển thị trên booking flow
- Staff phải có ít nhất 1 service chuyên môn để nhận booking
- Không thể xóa staff có booking active (PENDING/CONFIRMED)

---

## Test Cases

---

### TC-STF-001 — Thêm kỹ thuật viên mới

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-STF-001 |
| **Title** | Tạo staff mới với đầy đủ thông tin |
| **Priority** | P0 — Critical |
| **Type** | Functional / Positive |
| **Preconditions** | Đăng nhập ADMIN/MANAGER |

**Test Data:**
| Field | Value |
|-------|-------|
| Name | Nguyen Thi Mai |
| Email | mai.nguyen@angelnail.co.nz |
| Phone | +64 21 999 8888 |
| Specialties | Gel Manicure, Nail Art, Pedicure |
| Available | Yes |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Truy cập `/angel/admin/staff` | Danh sách staff hiển thị |
| 2 | Click "Add Staff" | Form/modal tạo staff mở |
| 3 | Nhập đầy đủ thông tin | Fields nhận input |
| 4 | Upload avatar: ảnh JPG 2MB | Preview avatar hiển thị |
| 5 | Gán specialties: chọn 3 dịch vụ | Services được chọn |
| 6 | Bật Available toggle | Staff sẽ nhận booking |
| 7 | Click Save | `POST /api/admin/staff` |
| 8 | Kiểm tra danh sách | Staff mới xuất hiện |
| 9 | Kiểm tra booking flow | Staff mới có trong tùy chọn chọn thợ |
| 10 | Kiểm tra trang public `/angel/staff` | Staff mới hiển thị |

---

### TC-STF-002 — Upload Avatar

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-STF-002 |
| **Title** | Upload avatar — validate file type và size |
| **Priority** | P1 — High |
| **Type** | Functional / Validation |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Upload ảnh JPG 500KB | Preview hiển thị, upload thành công |
| 2 | Upload ảnh PNG 1MB | Upload thành công |
| 3 | Upload file PDF | Error: "Only image files allowed" |
| 4 | Upload ảnh 15MB | Error: "File size exceeds limit (10MB)" |
| 5 | Upload ảnh GIF động | Chấp nhận hoặc báo lỗi (tùy business rule) |
| 6 | Sau upload thành công | Avatar hiển thị trên trang public staff và trong booking |

---

### TC-STF-003 — Gán dịch vụ chuyên môn (Specialties)

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-STF-003 |
| **Title** | Gán và cập nhật specialties cho staff |
| **Priority** | P1 — High |
| **Type** | Functional / Integration |
| **Preconditions** | Có staff "Nguyen Thi Mai", có 5 services active |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Mở sửa profile "Nguyen Thi Mai" | Form với checkboxes services |
| 2 | Bỏ chọn service "Pedicure" | Checkbox unchecked |
| 3 | Thêm service "Nail Art" | Checkbox checked |
| 4 | Save | Specialties cập nhật |
| 5 | Trong booking flow: chọn service "Pedicure" | Mai KHÔNG xuất hiện trong danh sách thợ |
| 6 | Trong booking flow: chọn service "Nail Art" | Mai XUẤT HIỆN trong danh sách thợ |

---

### TC-STF-004 — Bật/Tắt Available (Nhận booking)

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-STF-004 |
| **Title** | Available flag kiểm soát staff trong booking flow |
| **Priority** | P0 — Critical |
| **Type** | Functional / Integration |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Staff "Nguyen Thi Mai": Available=true | Xuất hiện trong booking step 2 |
| 2 | Toggle Available OFF | `PUT /api/admin/staff/{id}` với available=false |
| 3 | Mở booking flow step 2 | "Nguyen Thi Mai" KHÔNG xuất hiện |
| 4 | Toggle Available ON | Staff hiện lại trong booking flow |
| 5 | Kiểm tra "No preference" option | Vẫn available, hệ thống tự gán thợ available |

---

### TC-STF-005 — Xóa staff

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-STF-005 |
| **Title** | Xóa staff — kiểm tra ràng buộc booking active |
| **Priority** | P1 — High |
| **Type** | Functional / Negative |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Xóa staff không có booking nào | Confirmation → xóa thành công |
| 2 | Xóa staff có booking PENDING/CONFIRMED | Warning: "Staff has active bookings, cannot delete" HOẶC yêu cầu reassign |
| 3 | Xóa staff có booking COMPLETED only | Confirmation → xóa thành công (bookings lịch sử giữ lại) |

---

### TC-STF-006 — Xem My Day của Staff cụ thể

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-STF-006 |
| **Title** | Admin xem lịch của một staff cụ thể |
| **Priority** | P2 — Medium |
| **Type** | Functional |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Mở hồ sơ staff | Profile page |
| 2 | Click "View Schedule" / "My Day" | Navigate hoặc modal với lịch hôm nay của thợ |
| 3 | Kiểm tra số booking | Đúng với Appointments module |
