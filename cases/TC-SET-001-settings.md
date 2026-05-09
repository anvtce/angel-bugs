# TC-SET — Settings (Cài đặt hệ thống)

**Module:** Settings  
**URL:** `https://project.vinapage.com/angel/admin/settings`  
**Standard:** IEEE 829 / ISTQB  
**Version:** 1.0 | **Updated:** 2026-05-09  
**Roles:** ADMIN only (MANAGER và STAFF bị chặn)  

---

## Test Plan

### Scope
Kiểm thử cài đặt hệ thống: thông tin tiệm, giờ mở cửa, quản lý người dùng + phân quyền, đổi mật khẩu, thông báo email.

### Business Rules
- Chỉ ADMIN mới truy cập được Settings
- Giờ mở cửa ảnh hưởng trực tiếp đến booking availability
- User management: tạo/sửa/xóa tài khoản nội bộ

---

## Test Cases

---

### TC-SET-001 — Sửa thông tin tiệm

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-SET-001 |
| **Title** | Cập nhật thông tin cơ bản của tiệm |
| **Priority** | P1 — High |
| **Type** | Functional |
| **Preconditions** | Đăng nhập ADMIN |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Truy cập `/angel/admin/settings` | Settings page với các tab/section |
| 2 | Tab "Salon Info" | Fields: Tên tiệm, Địa chỉ, SĐT, Email, Website |
| 3 | Sửa SĐT: "03 579 1166" → "03 579 9999" | Field nhận input |
| 4 | Save | API call thành công |
| 5 | Kiểm tra trang Contact public | SĐT mới hiển thị |
| 6 | Sửa lại về số cũ | Rollback |

---

### TC-SET-002 — Giờ mở cửa từng ngày

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-SET-002 |
| **Title** | Cấu hình giờ mở cửa ảnh hưởng đến booking availability |
| **Priority** | P0 — Critical |
| **Type** | Functional / Integration |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Tab "Business Hours" | Grid 7 ngày với Open time / Close time / toggle Closed |
| 2 | Đặt Chủ Nhật = "Closed" | Toggle off |
| 3 | Save | Business hours cập nhật |
| 4 | Mở booking flow, chọn Chủ Nhật | Không có slot nào (ngày đóng cửa) |
| 5 | Mở booking flow, chọn Thứ Hai | Slots từ giờ mở đến giờ đóng |
| 6 | Đặt Thứ 2: 9:00 - 17:00 | Slots chỉ trong khoảng 9-17 |
| 7 | Kiểm tra slot 8:00 | Không có |
| 8 | Kiểm tra slot 9:00 | Có |
| 9 | Kiểm tra slot 17:00 | Không có (đã đóng) |

---

### TC-SET-003 — Quản lý người dùng nội bộ (User Management)

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-SET-003 |
| **Title** | CRUD tài khoản nội bộ và phân quyền |
| **Priority** | P0 — Critical |
| **Type** | Functional / Security |
| **Preconditions** | Đăng nhập ADMIN |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Tab "Users" trong Settings | Danh sách tài khoản với role |
| 2 | Click "Invite User" / "Add User" | Form tạo tài khoản |
| 3 | Nhập email mới, chọn role STAFF | Fields hợp lệ |
| 4 | Save | Tài khoản tạo, email mời gửi (hoặc mật khẩu tạm thời) |
| 5 | Đổi role từ STAFF → MANAGER | Role update |
| 6 | Kiểm tra quyền mới | User đó giờ truy cập được module Manager |
| 7 | Deactivate user | User không thể đăng nhập |
| 8 | Delete user không có dữ liệu | Xóa thành công |
| 9 | MANAGER thử vào Settings Users | 403 Forbidden |

---

### TC-SET-004 — Bật/Tắt thông báo Email

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-SET-004 |
| **Title** | Email notification toggles hoạt động đúng |
| **Priority** | P2 — Medium |
| **Type** | Functional |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Tab "Notifications" | Danh sách loại email notification với toggle |
| 2 | Tắt "New Booking Notification" | Toggle OFF |
| 3 | Tạo booking mới | Admin KHÔNG nhận email thông báo |
| 4 | Bật lại | Toggle ON |
| 5 | Tạo booking mới | Admin nhận email thông báo |
| 6 | Tắt "Booking Cancellation" | Hủy booking → không gửi email |

---

### TC-SET-005 — Settings chỉ ADMIN truy cập được

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-SET-005 |
| **Title** | Access control — MANAGER và STAFF bị chặn Settings |
| **Priority** | P0 — Critical |
| **Type** | Security / Authorization |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Đăng nhập MANAGER | Session MANAGER |
| 2 | Truy cập `/angel/admin/settings` | 403 hoặc redirect |
| 3 | Gọi API `GET /api/admin/settings` | HTTP 403 |
| 4 | Đăng nhập STAFF | Session STAFF |
| 5 | Truy cập `/angel/admin/settings` | 403 hoặc redirect |
