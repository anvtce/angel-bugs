# BUG REPORTS — TC-STAFF (STAFF Role Testing)

**Module:** STAFF Role — My Day, RBAC, Authentication  
**Tested by:** QA Automation  
**Test date:** 2026-05-10  
**Environment:** Chrome / Windows 10 / `https://project.vinapage.com/angel` / Role: STAFF  
**Account:** staff@angelnail.co.nz / staff123 (Maya Chen — Lash Specialist)  

---

## BUG-RBAC-001 — Không có frontend route guard: STAFF truy cập được toàn bộ trang admin

**Bug ID:** BUG-RBAC-001  
**Test Case:** TC-RBAC-001  
**Severity:** Critical  
**Priority:** P0  
**Status:** Open  
**Summary:** STAFF (Maya Chen) có thể điều hướng đến TẤT CẢ các trang admin mà không bị redirect hay chặn. Không có frontend route guard nào được triển khai. Toàn bộ 20 module admin đều hiển thị đầy đủ UI với các nút thao tác (Create, Edit, Delete, Export CSV...).

**Environment:**
- Browser: Chrome (Playwright)
- OS: Windows 10
- Role: STAFF (staff@angelnail.co.nz)

**Steps to Reproduce:**
1. Đăng nhập với tài khoản STAFF (staff@angelnail.co.nz / staff123)
2. Thử điều hướng đến `/angel/admin/clients`
3. Thử `/angel/admin/payroll`
4. Thử `/angel/admin/audit-log`
5. Thử `/angel/admin/settings`
6. Thử `/angel/admin/closing`

**Actual Result:**
Tất cả các URL trên đều load thành công với full UI, không có redirect về trang đăng nhập hay trang "Access Denied":

| URL | Kết quả | Ghi chú |
|-----|---------|---------|
| `/admin/clients` | ✅ Load đầy đủ | 30 khách hàng hiển thị + Import/Export CSV + CRUD buttons |
| `/admin/payroll` | ✅ Load đầy đủ | Payroll UI với date range + Export CSV |
| `/admin/audit-log` | ✅ Load đầy đủ | Audit Log UI (data trống do API 403) |
| `/admin/settings` | ✅ Load đầy đủ | Toàn bộ Settings tabs hiển thị |
| `/admin/closing` | ✅ Load đầy đủ | End of Day Closing UI |
| `/admin/staff` | ✅ Load đầy đủ | Danh sách nhân viên đầy đủ |
| `/admin/inventory` | ✅ Load đầy đủ | 145 sản phẩm + Add Product button |
| `/admin/services` | ✅ Load đầy đủ | Services + Edit/Delete/Add buttons |
| `/admin/gallery` | ✅ Load đầy đủ | Gallery + "Thêm ảnh" button |
| `/admin/appointments` | ✅ Load đầy đủ | Tất cả lịch hẹn của mọi nhân viên |

**Expected Result:**
- STAFF chỉ được truy cập: `/admin/my-day` (trang cá nhân)
- Tất cả các trang khác phải redirect về `/admin/my-day` hoặc hiển thị trang "403 Forbidden"

**Root Cause (nghi ngờ):**
Next.js middleware hoặc route-level auth check không được triển khai. Chỉ có session check cơ bản (có đăng nhập hay không) chứ không check role trước khi render trang.

**Security Impact:** CRITICAL — Mọi nhân viên đều có thể xem dữ liệu kinh doanh nhạy cảm, thông tin khách hàng, lương thưởng của nhân viên khác, cài đặt hệ thống, v.v.

**Attachments:** `staff-clients-page.png`, `staff-auditlog-page.png`, `staff-payroll-page.png`, `staff-closing-page.png`, `staff-settings-save-result.png`

---

## BUG-RBAC-002 — STAFF có thể tạo nhân viên mới qua API (POST /api/admin/staff → 201)

**Bug ID:** BUG-RBAC-002  
**Test Case:** TC-RBAC-002  
**Severity:** Critical  
**Priority:** P0  
**Status:** Open  
**Summary:** API endpoint `POST /angel/api/admin/staff` không kiểm tra role của người dùng. STAFF (Maya Chen) đã tạo thành công một nhân viên mới trong database với HTTP 201 Created.

**Environment:**
- URL: `/angel/api/admin/staff`
- Method: POST
- Role: STAFF (staff@angelnail.co.nz)

**Steps to Reproduce:**
1. Đăng nhập với STAFF account
2. Gọi API: `POST /angel/api/admin/staff` với body:
```json
{
  "name": "RBAC Test Staff",
  "email": "rbac@test.com",
  "role": "STAFF",
  "position": "QA Test",
  "commissionRate": 0
}
```
3. Quan sát response

**Actual Result:**
```http
HTTP/1.1 201 Created
{
  "id": "cmoz7ch33000o2dntsjev6cc8",
  "name": "RBAC Test Staff",
  "email": "rbac@test.com",
  "role": "STAFF",
  ...
}
```
Record đã được tạo thực sự trong database — hiển thị trong admin staff list.

**Expected Result:**
```http
HTTP/1.1 403 Forbidden
{ "error": "Insufficient permissions" }
```

**Impact:**
- STAFF có thể tạo tài khoản mới với bất kỳ role nào (kể cả ADMIN, MANAGER)
- STAFF có thể tạo tài khoản "backdoor" với email tùy chọn
- **Privilege escalation risk**: tạo account ADMIN mới để có toàn quyền

**Cleanup needed:** Record `cmoz7ch33000o2dntsjev6cc8` cần xóa qua admin account.

**Attachments:** API response captured in previous session

---

## BUG-RBAC-003 — STAFF có thể tạo khách hàng mới qua API (POST /api/admin/clients → 201)

**Bug ID:** BUG-RBAC-003  
**Test Case:** TC-RBAC-003  
**Severity:** Critical  
**Priority:** P0  
**Status:** Open  
**Summary:** API endpoint `POST /angel/api/admin/clients` không kiểm tra role. STAFF đã tạo thành công client "Test RBAC" (rbac@test.com) trong database với HTTP 201 Created.

**Environment:**
- URL: `/angel/api/admin/clients`
- Method: POST
- Role: STAFF (staff@angelnail.co.nz)

**Steps to Reproduce:**
1. Đăng nhập với STAFF account
2. Gọi API: `POST /angel/api/admin/clients` với body:
```json
{
  "firstName": "Test",
  "lastName": "RBAC",
  "email": "rbac@test.com",
  "phone": "+84000000000"
}
```

**Actual Result:**
```http
HTTP/1.1 201 Created
{
  "id": "cmoz7ch66000p2dntw0t7gtr8",
  "firstName": "Test",
  "lastName": "RBAC",
  "email": "rbac@test.com",
  ...
}
```

**Expected Result:**
```http
HTTP/1.1 403 Forbidden
```

**Impact:**
- STAFF có thể tạo client giả, spam database
- STAFF có thể tạo client với email hợp lệ rồi thực hiện booking cho người không tồn tại

**Cleanup needed:** Client `cmoz7ch66000p2dntw0t7gtr8` (rbac@test.com) cần xóa qua admin.

---

## BUG-RBAC-004 — STAFF xem được toàn bộ lịch hẹn của mọi nhân viên qua API

**Bug ID:** BUG-RBAC-004  
**Test Case:** TC-RBAC-004  
**Severity:** High  
**Priority:** P1  
**Status:** Open  
**Summary:** API `GET /angel/api/admin/bookings` không lọc theo staffId của người đang đăng nhập. STAFF (Maya Chen, staffId: demo-staff-maya) nhận được toàn bộ lịch hẹn của mọi nhân viên trong hệ thống.

**Steps to Reproduce:**
1. Đăng nhập STAFF
2. Gọi `GET /angel/api/admin/bookings?date=2026-05-09`
3. Kiểm tra staffId trong response

**Actual Result:**
Response trả về booking của `staffId: "staff-sofia-blanco"` — không phải Maya Chen.
STAFF có thể đọc toàn bộ booking của tất cả nhân viên, bao gồm thông tin khách hàng (tên, số điện thoại, email, ghi chú).

**Expected Result:**
API chỉ trả về bookings có `staffId = "demo-staff-maya"` (hoặc yêu cầu role MANAGER/ADMIN để xem all).

**Impact:**
- Lộ thông tin cá nhân (PII) của khách hàng ra cho nhân viên khác
- Vi phạm nguyên tắc least-privilege

---

## BUG-RBAC-005 — STAFF xem được dữ liệu PII khách hàng đầy đủ (30 records) trên trang Clients

**Bug ID:** BUG-RBAC-005  
**Test Case:** TC-RBAC-005  
**Severity:** High  
**Priority:** P1  
**Status:** Open  
**Summary:** Trang `/admin/clients` hiển thị đầy đủ 30 khách hàng với thông tin liên hệ (email, số điện thoại, ghi chú nhạy cảm) cho STAFF. Ngoài ra còn có các nút "Import CSV", "Export CSV", "Thêm khách hàng" và Edit/Delete trên từng record.

**Steps to Reproduce:**
1. Đăng nhập STAFF
2. Điều hướng đến `/angel/admin/clients`

**Actual Result:**
- 30 khách hàng hiển thị đầy đủ với tên, email, số điện thoại
- Ghi chú khách hàng hiển thị (ví dụ: "Please use OPI gel, allergic to acrylic")
- Các nút CRUD (view 👁️, edit ✏️, delete 🗑️) đều hiển thị
- "Import CSV" và "Export CSV" buttons hiển thị

**Expected Result:**
STAFF không được truy cập trang này. Redirect về `/admin/my-day`.

**Impact:**
- GDPR/Privacy violation: nhân viên có thể xem, export, hoặc xóa dữ liệu khách hàng
- Potential data leak qua Export CSV

---

## BUG-MYDAY-001 — Clock Out button không có backend: click không gọi API, status không đổi

**Bug ID:** BUG-MYDAY-001  
**Test Case:** TC-MYDAY-002  
**Severity:** High  
**Priority:** P1  
**Status:** Open  
**Summary:** Nút "Clock Out" trên trang My Day click được nhưng không gọi bất kỳ API nào. Clock status vẫn hiển thị "On shift" sau khi click. Tương tự, "Clock In" cũng không có backend endpoint.

**Environment:**
- URL: `/angel/admin/my-day`
- Role: STAFF (Maya Chen)

**Steps to Reproduce:**
1. Đăng nhập STAFF
2. Mở `/angel/admin/my-day`
3. Quan sát "Clock Status: On shift since 03:17 pm"
4. Click nút "Clock Out"
5. Quan sát kết quả và network requests

**Actual Result:**
- Không có network request nào được gửi (fetch interceptor xác nhận 0 API calls)
- Clock Status vẫn hiển thị "On shift since 03:17 pm"
- Không có success toast, không có error message
- Tương tự với Clock In

**API Investigation:**
Các endpoint đã thử:
- `POST /angel/api/admin/clock` → 404 Not Found
- `POST /angel/api/admin/my-day/clock` → 404 Not Found
- `PATCH /angel/api/admin/staff/demo-staff-maya/clock` → 404 Not Found

**Expected Result:**
- Click "Clock Out" → `POST /api/admin/staff/{staffId}/clock-out` → 200
- Status chuyển thành "Off shift"
- Button chuyển thành "Clock In"

**Impact:**
- Tính năng clock-in/clock-out hoàn toàn không hoạt động
- Không thể theo dõi giờ làm việc của nhân viên
- Dữ liệu payroll dựa trên timesheet sẽ không chính xác

**Attachments:** `staff-clockout-result.png`

---

## BUG-MYDAY-002 — Weekly schedule của Maya Chen hiển thị tất cả "Off" — không có ca làm việc

**Bug ID:** BUG-MYDAY-002  
**Test Case:** TC-MYDAY-001  
**Severity:** Medium  
**Priority:** P2  
**Status:** Open  
**Summary:** Section "My weekly schedule" trên trang My Day hiển thị tất cả 7 ngày trong tuần là "Off" cho Maya Chen. Không có ca làm việc nào được cấu hình.

**Steps to Reproduce:**
1. Đăng nhập STAFF (staff@angelnail.co.nz)
2. Mở `/angel/admin/my-day`
3. Quan sát section "My weekly schedule"

**Actual Result:**
```
Sun: Off | Mon: Off | Tue: Off | Wed: Off | Thu: Off | Fri: Off | Sat: Off
```

**Expected Result:**
Maya Chen phải có ít nhất một số ngày làm việc (ví dụ: Mon–Sat 9:00–17:00).

**Root Cause:**
Có thể liên quan đến BUG-STF-001 (Admin session): Staff form không có field gán ca làm việc/dịch vụ chuyên môn. Dữ liệu seed không khởi tạo schedule cho Maya.

**Impact:**
- STAFF không thể xem lịch làm việc của mình
- Bookings không được phân công đúng cho Maya nếu không có schedule

---

## BUG-RBAC-006 — Settings page (Business info) có Save button nhưng không gọi API

**Bug ID:** BUG-RBAC-006  
**Test Case:** TC-SET-STAFF-001  
**Severity:** Medium  
**Priority:** P2  
**Status:** Open  
**Summary:** STAFF có thể truy cập `/admin/settings` và thấy toàn bộ form Business info với nút "Save business info". Tuy nhiên khi click, không có API call nào được thực hiện — form không thực sự lưu (do API `GET /api/admin/config` trả về 403). Đây là UX bug kết hợp với RBAC issue.

**Steps to Reproduce:**
1. Đăng nhập STAFF
2. Điều hướng đến `/angel/admin/settings`
3. Sửa một field (ví dụ: Phone → "03 579 1166 TEST")
4. Click "Save business info"
5. Quan sát network requests

**Actual Result:**
- `GET /api/admin/config` → **403** (dữ liệu config không load được)
- Form hiển thị hardcoded/cached values
- Click "Save business info" → **0 API calls** — button hoàn toàn không làm gì
- Không có success/error feedback

**Expected Result (cho RBAC):**
STAFF không được truy cập trang Settings → redirect về My Day

**Impact:**
Nhân viên thấy Settings page nhưng form bị "dead" — confusing UX, và tiềm ẩn nguy cơ nếu Save button được fix nhưng RBAC chưa được triển khai.

---

## BUG-RBAC-007 — STAFF thấy toàn bộ sidebar navigation (20 items) thay vì chỉ thấy "Hôm nay"

**Bug ID:** BUG-RBAC-007  
**Test Case:** TC-RBAC-001  
**Severity:** Medium  
**Priority:** P2  
**Status:** Open  
**Summary:** Sidebar navigation cho STAFF hiển thị đầy đủ 20 menu items (giống ADMIN) thay vì chỉ hiện "Hôm nay" (My Day) là trang được phép. Điều này confuse người dùng và tạo điểm vào cho tất cả các trang restricted.

**Steps to Reproduce:**
1. Đăng nhập STAFF
2. Quan sát sidebar bên trái

**Actual Result:**
Sidebar hiển thị 20 items:
- Tổng quan, Hôm nay, Lịch hẹn, Dịch vụ, Thư viện ảnh, Khách hàng,
- Nhân viên, Kho hàng, Thanh toán, Thẻ quà tặng, Lương & hoa hồng,
- Kết ca, Chi phí, Đơn đặt hàng, Đánh giá, Báo cáo, Nhật ký hệ thống,
- Tổng đài AI, Tài liệu QA, Cài đặt

**Expected Result:**
STAFF chỉ thấy: "Hôm nay" (My Day) — có thể thêm "Lịch hẹn" (chỉ lịch cá nhân)

---

## TC-STAFF Summary — Pass/Fail Matrix

### TC-AUTH (STAFF Role)

| TC ID | Title | Result | Bug |
|-------|-------|--------|-----|
| TC-AUTH-001 | Login STAFF thành công | ✅ PASS | — |
| TC-AUTH-002 | Đăng xuất | ❌ FAIL | BUG-AUTH-003 (carry-over từ ADMIN session) |
| TC-AUTH-003 | Change password | ⚠️ PARTIAL | BUG-AUTH-004 (carry-over) |
| TC-AUTH-004 | Session persistence | ✅ PASS | — |

### TC-MYDAY (My Day — STAFF Primary Page)

| TC ID | Title | Result | Bug |
|-------|-------|--------|-----|
| TC-MYDAY-001 | My Day overview — greeting, stats, schedule | ⚠️ PARTIAL | BUG-MYDAY-002 (weekly schedule all Off) |
| TC-MYDAY-002 | Clock In / Clock Out | ❌ FAIL | BUG-MYDAY-001 (no backend endpoint) |
| TC-MYDAY-003 | Cập nhật trạng thái booking từ My Day | ⏭️ SKIP | Không có booking được gán cho Maya hôm nay |

### TC-RBAC (STAFF Role Access Control)

| TC ID | Title | Result | Bug |
|-------|-------|--------|-----|
| TC-RBAC-001 | Frontend route guard | ❌ FAIL | BUG-RBAC-001 (no guards — all 20 pages accessible) |
| TC-RBAC-002 | API: POST /api/admin/staff | ❌ FAIL | BUG-RBAC-002 (201 Created — privilege escalation) |
| TC-RBAC-003 | API: POST /api/admin/clients | ❌ FAIL | BUG-RBAC-003 (201 Created) |
| TC-RBAC-004 | API: GET /api/admin/bookings | ❌ FAIL | BUG-RBAC-004 (sees all staff bookings) |
| TC-RBAC-005 | Trang Clients — PII exposure | ❌ FAIL | BUG-RBAC-005 (30 client records visible) |
| TC-RBAC-006 | API: GET/POST /api/admin/payments | ✅ PASS | 403 correctly returned |
| TC-RBAC-007 | API: GET /api/admin/reports | ✅ PASS | 403 correctly returned |
| TC-RBAC-008 | API: GET /api/admin/expenses | ✅ PASS | 403 correctly returned |
| TC-RBAC-009 | API: GET /api/admin/audit-log | ✅ PASS | 403 correctly returned |
| TC-RBAC-010 | API: GET /api/admin/config | ✅ PASS | 403 correctly returned |
| TC-RBAC-011 | Settings Save button (STAFF) | ❌ FAIL | BUG-RBAC-006 (Save non-functional + RBAC bypass) |
| TC-RBAC-012 | Sidebar navigation filtering | ❌ FAIL | BUG-RBAC-007 (shows all 20 items) |
| TC-RBAC-013 | Services edit/add buttons (STAFF) | ⚠️ PARTIAL | Buttons visible but click silently does nothing |
| TC-RBAC-014 | Inventory page access | ❌ FAIL | BUG-RBAC-001 (accessible, Add Product visible) |
| TC-RBAC-015 | Gallery "Thêm ảnh" button | ❌ FAIL | BUG-RBAC-001 (accessible, Add button visible) |

---

## API Access Matrix — STAFF Role

| Endpoint | Method | Status | Expected | Result |
|----------|--------|--------|----------|--------|
| `/api/admin/bookings` | GET | **200** | 403 (own only) | ❌ FAIL |
| `/api/admin/staff` | GET | **200** | 403 | ❌ FAIL |
| `/api/admin/staff` | POST | **201** | 403 | 🔴 CRITICAL |
| `/api/admin/clients` | GET | **200** | 403 | ❌ FAIL |
| `/api/admin/clients` | POST | **201** | 403 | 🔴 CRITICAL |
| `/api/admin/services` | GET | **200** | 200 (read-only OK) | ✅ OK |
| `/api/admin/inventory` | GET | **200** | 403 | ❌ FAIL |
| `/api/admin/payments` | GET | **403** | 403 | ✅ PASS |
| `/api/admin/expenses` | GET | **403** | 403 | ✅ PASS |
| `/api/admin/audit-log` | GET | **403** | 403 | ✅ PASS |
| `/api/admin/config` | GET | **403** | 403 | ✅ PASS |
| `/api/admin/reports/revenue` | GET | **403** | 403 | ✅ PASS |
| `/api/admin/payroll` | GET | **404** | 403 | ⚠️ PARTIAL |

---

## Observations (Không Phải Bug)

| Observation | Module |
|-------------|--------|
| My Day "Revenue earned" và "Tips today" cập nhật đúng ($0 hôm nay — Sunday, salon closed) | TC-MYDAY |
| Clock Status "On shift since 03:17 pm" được lưu trong session — persist qua page reload | TC-MYDAY |
| STAFF thấy notification bell với 9+ notifications (toàn bộ system notifications, không filter theo role) | Global |
| Services edit/add buttons visible nhưng click silently does nothing — partial client-side guard | TC-SVC |
| "Jordan Smith" và "Lila Vance" xuất hiện trong booking artist list nhưng không có trong Admin staff list | TC-BK (carry-over) |

---

## Recommended Fix Priority

```
SPRINT 1 — Pre-UAT Critical (1-2 days)
├── BUG-RBAC-002: Add role check to POST /api/admin/staff (STAFF → 403)
├── BUG-RBAC-003: Add role check to POST /api/admin/clients (STAFF → 403)
└── BUG-RBAC-001: Implement Next.js middleware route guards for STAFF role

SPRINT 2 — Pre-UAT High (2-3 days)
├── BUG-MYDAY-001: Implement clock-in/clock-out backend endpoint
├── BUG-RBAC-004: Filter GET /api/admin/bookings by staffId for STAFF role
├── BUG-RBAC-005: Add API-level auth to GET /api/admin/clients (STAFF → 403)
└── BUG-RBAC-007: Filter sidebar navigation by role

SPRINT 3 — Post-UAT (next iteration)
├── BUG-MYDAY-002: Initialize working schedule for staff accounts (seed data fix)
├── BUG-RBAC-006: Settings Save button — fix UX or properly restrict access
└── BUG-RBAC-001: Complete cleanup of all admin/write API endpoints for STAFF role
```

---

## Cleanup Required

| Record | ID | Action |
|--------|-----|--------|
| Staff "RBAC Test Staff" | `cmoz7ch33000o2dntsjev6cc8` | DELETE via ADMIN account |
| Client "Test RBAC" (rbac@test.com) | `cmoz7ch66000p2dntw0t7gtr8` | DELETE via ADMIN account |
