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

> **⚠️ BUG-RBAC-001 [CRITICAL]:** Sidebar hiện tại KHÔNG lọc theo role — MANAGER thấy đủ 20 mục giống ADMIN. Test này phản ánh **hành vi thực tế** và đánh dấu điểm cần fix.

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Truy cập `/angel/admin/login` | Form đăng nhập hiển thị |
| 2 | Nhập email + password MANAGER | Fields nhận input |
| 3 | Submit form | Redirect thành công về `/angel/admin` |
| 4 | Kiểm tra sidebar menu | **[ACTUAL]** Sidebar hiển thị đủ **20 mục** — giống hệt ADMIN, không có lọc theo role |
| 5 | Kiểm tra user info (click account_circle) | Hiển thị tên "Sofia Blanco", role MANAGER |
| 6 | Truy cập `/angel/admin/settings` | **[ACTUAL]** Trang Settings mở bình thường (không bị chặn) |
| 7 | Truy cập `/angel/admin/audit-log` | **[ACTUAL]** Trang Audit Log mở, dữ liệu rỗng (API trả 403) |
| 8 | Gọi `GET /api/admin/audit-log` | **[ACTUAL]** HTTP 403 — API chặn đúng |
| 9 | Gọi `GET /api/admin/payments` | **[ACTUAL]** HTTP 403 — API chặn đúng |

**Expected Result (hành vi hiện tại):** MANAGER đăng nhập thành công, thấy toàn bộ sidebar, truy cập được tất cả trang UI. API block một phần (audit-log, payments, expenses).

**Expected Result (sau khi fix RBAC):** Sidebar ẩn các module ADMIN-only; route `/admin/settings`, `/admin/audit-log` redirect 403.

---

### TC-AUTH-003 — Đăng nhập thành công với tài khoản STAFF

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-003 |
| **Title** | Đăng nhập thành công — Role STAFF |
| **Priority** | P1 — High |
| **Type** | Functional / Positive |
| **Preconditions** | Chưa đăng nhập |

> **⚠️ BUG-RBAC-001 [CRITICAL]:** Sidebar và route không lọc theo role — STAFF thấy đủ 20 mục và truy cập được tất cả trang. Test này phản ánh **hành vi thực tế**.

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Đăng nhập bằng `staff@angelnail.co.nz` / `staff123` | Đăng nhập thành công về `/angel/admin` |
| 2 | Kiểm tra sidebar | **[ACTUAL]** Hiển thị đủ **20 mục** — giống ADMIN, không có lọc |
| 3 | Kiểm tra session API | `GET /api/auth/session` → `role: "STAFF"`, name: "Maya Chen" |
| 4 | Truy cập `/angel/admin/settings` | **[ACTUAL]** Trang mở bình thường, không bị chặn ở UI |
| 5 | Truy cập `/angel/admin/audit-log` | **[ACTUAL]** Trang mở, nhưng dữ liệu rỗng (API → 403) |
| 6 | Truy cập `/angel/admin/payroll` | **[ACTUAL]** Trang mở, nhưng dữ liệu rỗng (API → 404) |
| 7 | Gọi `GET /api/admin/audit-log` | **[ACTUAL]** HTTP **403** — API chặn đúng |
| 8 | Gọi `GET /api/admin/payments` | **[ACTUAL]** HTTP **403** — API chặn đúng |
| 9 | Gọi `GET /api/admin/expenses` | **[ACTUAL]** HTTP **403** — API chặn đúng |
| 10 | Gọi `GET /api/admin/bookings` | **[ACTUAL]** HTTP **200** — STAFF đọc được bookings |
| 11 | Gọi `GET /api/admin/staff` | **[ACTUAL]** HTTP **200** — STAFF đọc được danh sách nhân viên |
| 12 | Gọi `POST /api/admin/services` (body rỗng) | **[ACTUAL]** HTTP **400** (bad request) — KHÔNG phải 403, STAFF có thể gọi write API! |

**Expected Result (hành vi hiện tại):** STAFF đăng nhập, thấy 20 mục sidebar, vào được mọi trang. API chặn một phần (audit-log/payments/expenses = 403), còn lại cho phép.

**Expected Result (sau khi fix RBAC):** Sidebar chỉ hiện My Day + Appointments; route STAFF-only redirect 403; toàn bộ write API trả 403 với STAFF.

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

### TC-AUTH-010 — RBAC — Kiểm tra phân quyền API theo role

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-AUTH-010 |
| **Title** | RBAC — Mapping trạng thái phân quyền thực tế (UI + API) |
| **Priority** | P0 — Critical |
| **Type** | Security / Authorization |
| **Preconditions** | Lần lượt đăng nhập từng role |

> **Kết quả kiểm tra thực tế (2026-05-09):** Frontend KHÔNG có route guard. API chặn một phần không nhất quán. Xem chi tiết bên dưới.

**Trạng thái RBAC hiện tại — Route (UI):**

| Trang | ADMIN | MANAGER | STAFF | Bug? |
|-------|:-----:|:-------:|:-----:|------|
| Tất cả 20 trang | ✅ | ✅ | ✅ | 🔴 BUG — STAFF/MANAGER truy cập hết |

**Trạng thái RBAC hiện tại — API (STAFF):**

| API | Method | STAFF | Đúng? |
|-----|--------|:-----:|-------|
| `/api/admin/stats` | GET | 200 ✅ | ⚠️ nên review |
| `/api/admin/bookings` | GET | 200 ✅ | ⚠️ nên review |
| `/api/admin/staff` | GET | 200 ✅ | ⚠️ nên review |
| `/api/admin/services` | GET | 200 ✅ | ⚠️ nên review |
| `/api/admin/inventory` | GET | 200 ✅ | ⚠️ nên review |
| `/api/admin/clients` | GET | 200 ✅ | ⚠️ nên review |
| `/api/admin/audit-log` | GET | **403** 🔒 | ✅ đúng |
| `/api/admin/payments` | GET | **403** 🔒 | ✅ đúng |
| `/api/admin/expenses` | GET | **403** 🔒 | ✅ đúng |
| `/api/admin/services` | POST | **400** ⚠️ | 🔴 BUG — nên là 403 |
| `/api/admin/staff` | POST | **400** ⚠️ | 🔴 BUG — nên là 403 |

**Test Steps (regression sau khi fix):**

| Step | Action | Expected Result (sau fix) |
|------|--------|--------------------------|
| 1 | STAFF truy cập `/angel/admin/settings` | Redirect 403 hoặc "Không có quyền" |
| 2 | STAFF truy cập `/angel/admin/audit-log` | Redirect 403 |
| 3 | STAFF truy cập `/angel/admin/payroll` | Redirect 403 |
| 4 | STAFF truy cập `/angel/admin/reports` | Redirect 403 |
| 5 | STAFF gọi `POST /api/admin/services` | HTTP 403 |
| 6 | STAFF gọi `DELETE /api/admin/services/1` | HTTP 403 |
| 7 | STAFF gọi `GET /api/admin/audit-log` | HTTP 403 |
| 8 | MANAGER truy cập `/angel/admin/settings` | Redirect 403 |
| 9 | Sidebar STAFF | Chỉ hiện: Tổng quan, Hôm nay, Lịch hẹn, Hồ sơ |
| 10 | Sidebar MANAGER | Ẩn: Cài đặt, Nhật ký hệ thống |

**Expected Result (sau fix):** Frontend có route guard; STAFF bị chặn ở cả UI route lẫn API write operations.

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
