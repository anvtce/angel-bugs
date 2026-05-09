# TC-AUTH — Authentication & Authorization

**Module:** Authentication / Access Control  
**URL:** `https://project.vinapage.com/angel/admin/login`  
**Standard:** IEEE 829 / ISTQB  
**Version:** 1.0 | **Updated:** 2026-05-09  
**Tester:** _______________  

---

## Test Plan

### Scope
Kiểm thử toàn bộ luồng xác thực (đăng nhập, đăng xuất, phân quyền theo role) của Admin Panel Angel Nail Salon.

### Objectives
- Xác minh rằng hệ thống chỉ cho phép người dùng hợp lệ truy cập Admin Panel
- Xác minh rằng phân quyền ADMIN / MANAGER / STAFF hoạt động đúng
- Xác minh rằng session được quản lý an toàn

### Test Environment
| Item | Value |
|------|-------|
| Base URL | `https://project.vinapage.com/angel` |
| Login URL | `/angel/admin/login` |
| Browser | Chrome latest, Firefox latest |
| Timezone | Pacific/Auckland (NZST UTC+12) |

### Test Accounts
| Role | Email | Password | Scope |
|------|-------|----------|-------|
| ADMIN | elena@angelnail.co.nz | admin123 | Toàn bộ — cấu hình, users, audit log |
| MANAGER | manager@angelnail.co.nz | manager123 | Vận hành — lịch hẹn, kho, báo cáo, lương |
| STAFF | staff@angelnail.co.nz | staff123 | Cá nhân — My Day, lịch của bản thân |

### Entry Criteria
- Môi trường staging đang chạy
- Database có seed data (users, services, bookings)
- Browser không có cached session cũ

### Exit Criteria
- Tất cả test cases PASS hoặc có defect ticket tương ứng
- Không còn Critical/High defect chưa resolved

---

## Test Cases

---

### TC-AUTH-001 — Đăng nhập thành công với tài khoản ADMIN

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-001 |
| **Title** | Đăng nhập thành công — Role ADMIN |
| **Priority** | P0 — Critical |
| **Type** | Functional / Positive |
| **Preconditions** | Chưa đăng nhập, browser không có session |

**Test Data:**
- Email: `elena@angelnail.co.nz`
- Password: `admin123`

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Truy cập `https://project.vinapage.com/angel/admin/login` | Trang đăng nhập hiển thị với form Email + Password |
| 2 | Nhập Email: `elena@angelnail.co.nz` | Field nhận input |
| 3 | Nhập Password: `admin123` | Password được ẩn bằng ký tự ● |
| 4 | Click nút "ĐĂNG NHẬP" | Loading spinner hiển thị |
| 5 | Chờ response từ `/api/auth/signin` | Response 200 OK, redirect tới `/angel/admin` |
| 6 | Quan sát trang sau login | Dashboard hiển thị, sidebar có đủ **20 mục** (Tổng quan, Hôm nay, Lịch hẹn, Dịch vụ, Thư viện ảnh, Khách hàng, Nhân viên, Kho hàng, Thanh toán, Thẻ quà tặng, Lương & hoa hồng, Kết ca, Chi phí, Đơn đặt hàng, Đánh giá, Báo cáo, Nhật ký hệ thống, Tổng đài AI, **Tài liệu QA**, Cài đặt) |

**Expected Result:** Đăng nhập thành công, redirect về `/angel/admin` Dashboard, session cookie được set.

**Post-conditions:** User đang trong trạng thái logged-in với role ADMIN.

---

### TC-AUTH-002 — Đăng nhập thành công với tài khoản MANAGER

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-002 |
| **Title** | Đăng nhập thành công — Role MANAGER |
| **Priority** | P0 — Critical |
| **Type** | Functional / Positive |
| **Preconditions** | Chưa đăng nhập |

**Test Data:**
- Email: `manager@angelnail.co.nz`
- Password: `manager123`

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Truy cập `/angel/admin/login` | Form đăng nhập hiển thị |
| 2 | Nhập email + password MANAGER | Fields nhận input |
| 3 | Submit form | Redirect thành công |
| 4 | Kiểm tra sidebar menu | Sidebar hiển thị các module vận hành, KHÔNG có Settings > User Management |
| 5 | Kiểm tra user info | Hiển thị role MANAGER |

**Expected Result:** Đăng nhập thành công, sidebar ẩn các module ADMIN-only.

---

### TC-AUTH-003 — Đăng nhập thành công với tài khoản STAFF

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-003 |
| **Title** | Đăng nhập thành công — Role STAFF |
| **Priority** | P1 — High |
| **Type** | Functional / Positive |
| **Preconditions** | Chưa đăng nhập |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Đăng nhập bằng `staff@angelnail.co.nz` / `staff123` | Đăng nhập thành công |
| 2 | Kiểm tra menu | Chỉ thấy: My Day, Appointments (view-only), Profile |
| 3 | Thử truy cập `/angel/admin/settings` | Redirect về 403 hoặc trang "Không có quyền" |
| 4 | Thử truy cập `/angel/admin/audit-log` | Redirect về 403 |
| 5 | Thử truy cập `/angel/admin/payroll` | Redirect về 403 |

**Expected Result:** STAFF chỉ truy cập được module phạm vi cá nhân.

---

### TC-AUTH-004 — Đăng nhập sai mật khẩu

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-004 |
| **Title** | Đăng nhập sai mật khẩu — hiển thị lỗi rõ ràng |
| **Priority** | P0 — Critical |
| **Type** | Functional / Negative |
| **Preconditions** | Chưa đăng nhập |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Truy cập `/angel/admin/login` | Form đăng nhập hiển thị |
| 2 | Nhập email hợp lệ, mật khẩu sai: `wrongpassword` | Fields nhận input |
| 3 | Submit form | Loading rồi hiển thị error message |
| 4 | Kiểm tra error message | Thông báo lỗi rõ ràng (VD: "Incorrect email or password"), KHÔNG redirect |
| 5 | Kiểm tra URL | Vẫn ở `/angel/admin/login` |
| 6 | Kiểm tra session | Không có session cookie mới |

**Expected Result:** Hiển thị thông báo lỗi rõ ràng, không đăng nhập được.

---

### TC-AUTH-005 — Đăng nhập với email không tồn tại

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-005 |
| **Title** | Đăng nhập với email không tồn tại |
| **Priority** | P1 — High |
| **Type** | Functional / Negative |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Nhập email `notexist@test.com` + password bất kỳ | Fields nhận input |
| 2 | Submit | Error message hiển thị |
| 3 | Kiểm tra error message | Không tiết lộ email có tồn tại hay không (security best practice) |

**Expected Result:** Thông báo lỗi chung, không expose thông tin user.

---

### TC-AUTH-006 — Submit form với fields bỏ trống

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-006 |
| **Title** | Validation form đăng nhập — bỏ trống fields |
| **Priority** | P1 — High |
| **Type** | Functional / Negative |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Bỏ trống Email, bỏ trống Password, click "ĐĂNG NHẬP" | Validation error hiển thị (VI: "Vui lòng nhập địa chỉ email" / EN: "Email is required") |
| 2 | Nhập Email nhưng bỏ trống Password, click "ĐĂNG NHẬP" | Validation error (VI: "Vui lòng nhập mật khẩu" / EN: "Password is required") |
| 3 | Nhập Email sai định dạng (không có @), click "ĐĂNG NHẬP" | Validation error (VI: "Địa chỉ email không hợp lệ" / EN: "Invalid email format") |
| 4 | Chuyển sang ngôn ngữ EN (click nút "EN" góc phải) rồi lặp bước 1–3 | Error messages hiển thị bằng tiếng Anh tương ứng |

**Expected Result:** Client-side validation hoạt động trước khi gọi API. Thông báo lỗi ngôn ngữ tương ứng với cài đặt VI/EN đang active.

---

### TC-AUTH-007 — Truy cập trang admin khi chưa đăng nhập

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-007 |
| **Title** | Unauthorized access redirect về login |
| **Priority** | P0 — Critical |
| **Type** | Security |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Xóa toàn bộ cookie/session | Trạng thái guest |
| 2 | Truy cập trực tiếp `/angel/admin` | Redirect về `/angel/admin/login` |
| 3 | Truy cập `/angel/admin/appointments` | Redirect về `/angel/admin/login` |
| 4 | Truy cập `/angel/admin/settings` | Redirect về `/angel/admin/login` |
| 5 | Gọi API `GET /api/admin/stats` không có session | HTTP 401 Unauthorized |
| 6 | Gọi API `GET /api/admin/bookings` không có session | HTTP 401 Unauthorized |

**Expected Result:** Toàn bộ route `/admin/*` redirect về login khi chưa xác thực.

---

### TC-AUTH-008 — Đăng xuất

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-008 |
| **Title** | Đăng xuất — session bị xóa hoàn toàn |
| **Priority** | P0 — Critical |
| **Type** | Functional |
| **Preconditions** | Đang đăng nhập với bất kỳ role nào |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click avatar/profile ở header hoặc sidebar | Dropdown menu xuất hiện |
| 2 | Click "Sign Out" / "Đăng xuất" | Gọi `POST /api/auth/signout` |
| 3 | Chờ response | Redirect về `/angel/admin/login` |
| 4 | Kiểm tra cookies | Session cookie bị xóa |
| 5 | Nhấn Back trên browser | Redirect lại về `/angel/admin/login`, không vào được dashboard |
| 6 | Gọi `/api/auth/session` | Trả về null session |

**Expected Result:** Session bị hủy hoàn toàn, không thể truy cập lại admin mà không đăng nhập lại.

---

### TC-AUTH-009 — Đổi mật khẩu

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-009 |
| **Title** | Đổi mật khẩu từ modal Profile |
| **Priority** | P1 — High |
| **Type** | Functional |
| **Preconditions** | Đang đăng nhập |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click avatar/profile → "Change Password" | Modal đổi mật khẩu mở ra |
| 2 | Nhập mật khẩu hiện tại sai | Error "Incorrect current password" |
| 3 | Nhập mật khẩu hiện tại đúng, mật khẩu mới, xác nhận mật khẩu mới | Fields hợp lệ |
| 4 | Nhập mật khẩu mới ≠ xác nhận | Error "Passwords do not match" |
| 5 | Nhập đầy đủ hợp lệ, submit | Success toast "Password changed successfully" |
| 6 | Đăng xuất rồi đăng nhập lại bằng mật khẩu mới | Đăng nhập thành công |

**Expected Result:** Mật khẩu được thay đổi thành công.

---

### TC-AUTH-010 — RBAC — STAFF không truy cập module ADMIN-only

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-010 |
| **Title** | Role-Based Access Control — STAFF bị chặn module nhạy cảm |
| **Priority** | P0 — Critical |
| **Type** | Security / Authorization |
| **Preconditions** | Đang đăng nhập với role STAFF |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Truy cập `/angel/admin/settings` | 403 Forbidden hoặc redirect |
| 2 | Truy cập `/angel/admin/audit-log` | 403 Forbidden |
| 3 | Truy cập `/angel/admin/payroll` | 403 Forbidden |
| 4 | Truy cập `/angel/admin/reports` | 403 Forbidden |
| 5 | Gọi `DELETE /api/admin/services/1` | HTTP 403 |
| 6 | Gọi `GET /api/admin/audit-log` | HTTP 403 |

**Expected Result:** STAFF bị chặn hoàn toàn, không có cách bypass qua URL trực tiếp.

---

## Defect Reporting Template

```
**Bug ID:** BUG-AUTH-XXX
**Test Case:** TC-AUTH-XXX
**Severity:** Critical / High / Medium / Low
**Summary:** [Mô tả ngắn]
**Steps to Reproduce:**
  1. ...
**Actual Result:** ...
**Expected Result:** ...
**Environment:** Chrome 136 / Windows 11 / Staging
**Attachments:** [Screenshot / Video]
```
