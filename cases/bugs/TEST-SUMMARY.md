# TEST EXECUTION REPORT — Angel Nail Salon (ALL ROLES)

**Build:** production — `https://project.vinapage.com/angel`  
**Environment:** Chrome / Windows 10 / Playwright MCP  
**Standard:** IEEE 829 / ISTQB  

---

## Session 1 — ADMIN Role

**Date:** 2026-05-09  
**Role tested:** ADMIN (elena@angelnail.co.nz)  

## Executive Summary — ADMIN Session

| Metric | Value |
|--------|-------|
| Modules tested | 8 |
| Total test cases executed | 56 |
| ✅ PASS | 33 |
| ❌ FAIL | 9 |
| ⚠️ PARTIAL | 8 |
| ⏭️ SKIP | 6 |
| **Pass Rate** | **~59%** (PASS / non-SKIP) |
| Total bugs found | **16** |
| Critical (P0) | 3 |
| High (P1) | 6 |
| Medium (P2) | 4 |
| Low (P3) | 3 |

---

## Module Results

| Module | TC Range | PASS | FAIL | PARTIAL | SKIP | Bugs |
|--------|----------|------|------|---------|------|------|
| TC-AUTH | 001~010 | 6 | 3 | 1 | 0 | 4 |
| TC-DASH | 001~008 | 4 | 1 | 1 | 2 | 1 |
| TC-APT | 001~008 | 3 | 2 | 1 | 1 | 2 |
| TC-SVC | 001~007 | 5 | 1 | 1 | 0 | 2 |
| TC-STF | 001~006 | 3 | 1 | 1 | 1 | 2 |
| TC-SET | 001~005 | 3 | 0 | 1 | 1 | 1 |
| TC-PUB | 001~007 | 5 | 0 | 2 | 0 | 2 |
| TC-BK  | 001~008 | 4 | 1 | 2 | 1 | 2 |
| **TOTAL** | **56 cases** | **33** | **9** | **10** | **6** | **16** |

---

## Bug Register — Full List

### 🔴 Critical (P0) — Must Fix Before Go-Live

| Bug ID | Module | Summary | Severity |
|--------|--------|---------|---------|
| [BUG-AUTH-003](BUG-AUTH.md) | Auth | Sign out button returns 405 — session không bị hủy | Critical |
| [BUG-APT-001](BUG-APT.md) | Appointments | Service dropdown hiển thị "— ( min)" — không thể tạo/sửa booking | Critical |
| [BUG-BK-001](BUG-BK.md) | Booking Flow | Thời gian booking hiển thị UTC (3:00 am) thay vì giờ địa phương (10:00 AM) | Critical |

### 🟠 High (P1) — Phải Fix Trước UAT

| Bug ID | Module | Summary | Severity |
|--------|--------|---------|---------|
| [BUG-AUTH-001](BUG-AUTH.md) | Auth | Wrong password: chỉ viền đỏ, không có text error message | High |
| [BUG-AUTH-004](BUG-AUTH.md) | Auth | Change password không yêu cầu xác minh mật khẩu hiện tại (Security) | High |
| [BUG-APT-002](BUG-APT.md) | Appointments | Edit form không pre-fill service đã chọn của booking | High |
| [BUG-STF-001](BUG-STF.md) | Staff | Form tạo/sửa nhân viên không có field gán dịch vụ chuyên môn | High |
| [BUG-STF-002](BUG-STF.md) | Staff | Xóa nhân viên có booking active không có cảnh báo hay ràng buộc | High |
| [BUG-BK-002](BUG-BK.md) | Booking Flow | Enhancement add-on ($15) không được tính vào tổng giá booking | High |

### 🟡 Medium (P2) — Fix Sau UAT

| Bug ID | Module | Summary | Severity |
|--------|--------|---------|---------|
| [BUG-AUTH-002](BUG-AUTH.md) | Auth | Submit form trống không hiện validation errors | Medium |
| [BUG-DASH-001](BUG-DASH.md) | Dashboard | URL param `?status=PENDING` không được áp dụng vào filter | Medium |
| [BUG-SVC-001](BUG-SVC.md) | Services | Form tạo/sửa dịch vụ không hiển thị validation error messages | Medium |
| [BUG-SVC-002](BUG-SVC.md) | Services | Không có chức năng đổi tên hoặc xóa Category | Medium |
| [BUG-PUB-001](BUG-PUB.md) | Public Site | Homepage không có section Testimonials/Reviews | Medium |

### 🟢 Low (P3) — Improvements

| Bug ID | Module | Summary | Severity |
|--------|--------|---------|---------|
| [BUG-SET-001](BUG-SET.md) | Settings | Opening hours subtitle "24h format" nhưng UI dùng 12h AM/PM | Low |
| [BUG-PUB-002](BUG-PUB.md) | Public Site | `/angel/staff` là PIN-protected schedule, không phải public staff listing | Low |

---

## Detailed Module Pass/Fail

### TC-AUTH (Authentication)
| TC ID | Title | Result |
|-------|-------|--------|
| TC-AUTH-001 | Login ADMIN thành công | ✅ PASS |
| TC-AUTH-002 | Login MANAGER | ✅ PASS |
| TC-AUTH-003 | Login STAFF | ✅ PASS |
| TC-AUTH-004 | Wrong password → error | ❌ FAIL — BUG-AUTH-001 |
| TC-AUTH-005 | Session persistence | ✅ PASS |
| TC-AUTH-006 | Validation: empty + invalid email | ❌ FAIL — BUG-AUTH-002 |
| TC-AUTH-007 | Session security (API 401) | ✅ PASS |
| TC-AUTH-008 | Đăng xuất | ❌ FAIL — BUG-AUTH-003 |
| TC-AUTH-009 | Change password | ⚠️ PARTIAL — BUG-AUTH-004 (security) |
| TC-AUTH-010 | RBAC matrix | ℹ️ INFO |

### TC-DASH (Dashboard)
| TC ID | Title | Result |
|-------|-------|--------|
| TC-DASH-001 | KPI Stats Cards | ✅ PASS |
| TC-DASH-002 | Revenue chart 7 ngày | ⚠️ PARTIAL — 1/7 ngày có data |
| TC-DASH-003 | Pending bookings link → filter | ❌ FAIL — BUG-DASH-001 |
| TC-DASH-004 | Loading state (Slow 3G) | ⏭️ SKIP |
| TC-DASH-005 | Error state (API 500) | ⏭️ SKIP |
| TC-DASH-006 | Upcoming appointments | ✅ PASS |
| TC-DASH-007 | Low stock | ✅ PASS |
| TC-DASH-008 | Staff section | ✅ PASS |

### TC-APT (Appointments)
| TC ID | Title | Result |
|-------|-------|--------|
| TC-APT-001 | List view, date filter | ✅ PASS |
| TC-APT-002 | Tạo lịch hẹn mới | ❌ FAIL — BUG-APT-001 |
| TC-APT-003 | Edit + status change | ⚠️ PARTIAL — BUG-APT-002 |
| TC-APT-004 | Huỷ booking | ✅ PASS |
| TC-APT-005 | Tìm kiếm | ✅ PASS |
| TC-APT-006 | Filter theo trạng thái | ✅ PASS |
| TC-APT-007 | Conflict detection | ⏭️ SKIP — blocked by BUG-APT-001 |
| TC-APT-008 | Edit/Reschedule | ❌ FAIL — BUG-APT-001, BUG-APT-002 |

### TC-SVC (Services)
| TC ID | Title | Result |
|-------|-------|--------|
| TC-SVC-001 | Tạo dịch vụ mới | ✅ PASS |
| TC-SVC-002 | Validation form | ❌ FAIL — BUG-SVC-001 |
| TC-SVC-003 | Sửa dịch vụ | ✅ PASS |
| TC-SVC-004 | Active/Inactive toggle | ✅ PASS |
| TC-SVC-005 | Giá cents → dollar | ✅ PASS |
| TC-SVC-006 | Quản lý Categories | ⚠️ PARTIAL — BUG-SVC-002 |
| TC-SVC-007 | Xóa dịch vụ | ✅ PASS |

### TC-STF (Staff Management)
| TC ID | Title | Result |
|-------|-------|--------|
| TC-STF-001 | Tạo nhân viên mới | ✅ PASS |
| TC-STF-002 | Upload avatar | ⏭️ SKIP |
| TC-STF-003 | Gán dịch vụ chuyên môn | ❌ FAIL — BUG-STF-001 |
| TC-STF-004 | Available toggle → booking | ✅ PASS |
| TC-STF-005 | Xóa nhân viên + ràng buộc | ⚠️ PARTIAL — BUG-STF-002 |
| TC-STF-006 | Xem lịch nhân viên | ✅ PASS |

### TC-SET (Settings)
| TC ID | Title | Result |
|-------|-------|--------|
| TC-SET-001 | Business info | ✅ PASS |
| TC-SET-002 | Opening hours | ✅ PASS — BUG-SET-001 (minor label) |
| TC-SET-003 | User management (Team tab) | ✅ PASS |
| TC-SET-004 | Email templates | ⚠️ PARTIAL — UI differs from spec |
| TC-SET-005 | Access control ADMIN-only | ⏭️ SKIP |

### TC-PUB (Public Site)
| TC ID | Title | Result |
|-------|-------|--------|
| TC-PUB-001 | Homepage | ⚠️ PARTIAL — BUG-PUB-001 |
| TC-PUB-002 | Services page | ✅ PASS |
| TC-PUB-003 | Gallery page | ✅ PASS |
| TC-PUB-004 | Contact page | ✅ PASS |
| TC-PUB-005 | Navbar + Mobile Nav | ✅ PASS |
| TC-PUB-006 | About và Staff pages | ⚠️ PARTIAL — BUG-PUB-002 |
| TC-PUB-007 | Public reviews | ✅ PASS |

### TC-BK (Booking Flow)
| TC ID | Title | Result |
|-------|-------|--------|
| TC-BK-001 | Bước 1: Chọn dịch vụ | ✅ PASS |
| TC-BK-002 | Bước 2: Chọn kỹ thuật viên | ✅ PASS |
| TC-BK-003 | Bước 3: Chọn ngày/giờ | ✅ PASS |
| TC-BK-004 | Bước 4: Thông tin khách | ⚠️ PARTIAL — general validation only |
| TC-BK-005 | Bước 6: Success page | ❌ FAIL — BUG-BK-001, BUG-BK-002 |
| TC-BK-006 | E2E: Booking → Admin | ⚠️ PARTIAL — BUG-BK-002; status CONFIRMED |
| TC-BK-007 | Conflict detection | ⏭️ SKIP |
| TC-BK-008 | Manage Booking — lookup + cancel | ✅ PASS |

---

## Key Findings

### 🚨 Blockers (Must Fix Before Go-Live)

1. **BUG-AUTH-003** — Đăng xuất bị vỡ (405 Not Allowed). Người dùng không thể đăng xuất qua UI — security risk nghiêm trọng.

2. **BUG-APT-001** — Service dropdown trong Create/Edit appointment hiển thị "— ( min)". Admin **không thể tạo mới hoặc chỉnh sửa bất kỳ booking nào** từ admin panel — core admin feature broken.

3. **BUG-BK-001** — Thời gian booking hiển thị sai (UTC 3:00 am thay vì NZ local 10:00 AM) trên success page và manage-booking page. Khách hàng nhận confirmation với giờ sai.

### ⚠️ Security Issues

- **BUG-AUTH-003**: Session không bị hủy khi logout — session hijacking risk
- **BUG-AUTH-004**: Change password không verify mật khẩu hiện tại — account takeover risk nếu session bị chiếm

### 💰 Business Impact

- **BUG-BK-002**: Enhancement add-ons không được tính vào tổng giá → doanh thu bị hụt $15 mỗi lần khách thêm Paraffin Wax
- **BUG-STF-002**: Xóa staff có active bookings không có cảnh báo → orphaned bookings gây data integrity issues

### 🔄 Recurrent Patterns

**Missing validation messages** (BUG-AUTH-002, BUG-SVC-001, BUG-BK-004): Pattern lặp lại qua 3+ modules — form validation chặn submit nhưng không hiển thị error message rõ ràng để người dùng biết field nào bị lỗi.

---

## Observations (Không Phải Bug)

| Module | Observation |
|--------|-------------|
| TC-APT | Status "NO_SHOW" trong dropdown — không được document trong spec |
| TC-SVC | NHÃN GIÁ là free-text — không auto-calculate từ price (cents) |
| TC-SET | Email templates tab khác với spec (editor thay vì toggle) |
| TC-PUB | About page "The Artisans" là hardcoded — không sync từ admin staff DB |
| TC-BK | Steps 4 & 5 gộp thành 1 trang; Online payment unavailable |
| TC-BK | "Test Category QA" xuất hiện trong booking tabs (rỗng, side-effect) |
| TC-DASH | Revenue chart chỉ hiển thị ngày có data — $0 bars cho ngày trống sẽ cải thiện UX |

---

## Skipped Modules (Out of Scope — ADMIN session)

Các modules sau chưa được test do thiếu dữ liệu test, cần role khác, hoặc nằm ngoài scope session này:

| Module | Lý do SKIP |
|--------|-----------|
| TC-MYDAY | Cần STAFF role để test My Day |
| TC-GAL | Gallery admin — scope P1 |
| TC-CLI | Clients — scope P1 |
| TC-INV | Inventory — scope P1 |
| TC-PAY | Payments — scope P1 |
| TC-GC | Gift Cards — scope P1 |
| TC-PRL | Payroll — scope P1 |
| TC-CLO | Closing — scope P0, cần end-of-day data |
| TC-EXP | Expenses — scope P1 |
| TC-PO | Purchase Orders — scope P1 |
| TC-REV | Reviews admin — scope P1 |
| TC-RPT | Reports — scope P1 |
| TC-ALOG | Audit Log — scope P0 |
| TC-VOICE | Voice Agent — scope P2 |
| TC-API | API testing — separate tooling needed |
| TC-EDGE | Edge Cases/Security — separate tooling needed |
| TC-RESP | Responsive — partially covered in TC-PUB-005 |

---

## Recommended Fix Priority

```
SPRINT 1 — Pre-UAT Critical (1-2 days)
├── BUG-AUTH-003: Fix NextAuth basePath → enable proper logout
├── BUG-APT-001: Fix service dropdown (use services[], not categories[])
└── BUG-BK-001: Fix timezone display (convert UTC to NZ local time)

SPRINT 2 — Pre-UAT High (2-3 days)
├── BUG-AUTH-004: Add current password field to change password form
├── BUG-BK-002: Store enhancement as line item in booking total
├── BUG-APT-002: Pre-fill service in edit form (fix with APT-001 fix)
├── BUG-STF-001: Add service assignment checkboxes to staff form
└── BUG-STF-002: Add booking check before staff delete

SPRINT 3 — Post-UAT (next iteration)
├── BUG-AUTH-001/002: Improve validation error messages (cross-module)
├── BUG-DASH-001: Read URL params on appointments page mount
├── BUG-SVC-001: Add inline validation errors to service form
└── BUG-SVC-002: Add edit/delete for category headers

SPRINT 4 — UX Improvements
├── BUG-PUB-001: Add testimonials section to homepage
├── BUG-SET-001: Fix opening hours label (12h → 24h or vice versa)
└── BUG-PUB-002: Update spec or add public staff page
```

---

---

## Session 2 — STAFF Role

**Date:** 2026-05-10  
**Role tested:** STAFF (staff@angelnail.co.nz — Maya Chen, Lash Specialist)  

## Executive Summary — STAFF Session

| Metric | Value |
|--------|-------|
| Modules tested | 3 (TC-AUTH, TC-MYDAY, TC-RBAC) |
| Total test cases executed | 19 |
| ✅ PASS | 7 |
| ❌ FAIL | 9 |
| ⚠️ PARTIAL | 2 |
| ⏭️ SKIP | 1 |
| **Pass Rate** | **~39%** (PASS / non-SKIP) |
| Total bugs found | **9** |
| Critical (P0) | 3 |
| High (P1) | 4 |
| Medium (P2) | 2 |
| Low (P3) | 0 |

---

## Module Results — STAFF

| Module | TC Range | PASS | FAIL | PARTIAL | SKIP | Bugs |
|--------|----------|------|------|---------|------|------|
| TC-AUTH-STAFF | 001~004 | 2 | 1 | 1 | 0 | 2 (carry-over) |
| TC-MYDAY | 001~003 | 0 | 1 | 1 | 1 | 2 |
| TC-RBAC | 001~015 | 5 | 7 | 1 | 0 | 7 |
| **TOTAL** | **22 cases** | **7** | **9** | **3** | **1** | **9** |

---

## Bug Register — STAFF Session

### 🔴 Critical (P0) — Must Fix Before Go-Live

| Bug ID | Module | Summary | Severity |
|--------|--------|---------|---------|
| [BUG-RBAC-002](BUG-STAFF.md) | RBAC | STAFF tạo được nhân viên mới qua API (POST → 201) — privilege escalation | Critical |
| [BUG-RBAC-003](BUG-STAFF.md) | RBAC | STAFF tạo được khách hàng mới qua API (POST → 201) | Critical |
| [BUG-RBAC-001](BUG-STAFF.md) | RBAC | Không có frontend route guard — STAFF truy cập được 20/20 trang admin | Critical |

### 🟠 High (P1) — Phải Fix Trước UAT

| Bug ID | Module | Summary | Severity |
|--------|--------|---------|---------|
| [BUG-MYDAY-001](BUG-STAFF.md) | My Day | Clock Out button không gọi API — không có backend endpoint | High |
| [BUG-RBAC-004](BUG-STAFF.md) | RBAC | STAFF GET được toàn bộ bookings của mọi nhân viên | High |
| [BUG-RBAC-005](BUG-STAFF.md) | RBAC | STAFF xem được 30 records khách hàng (PII exposure) trên trang Clients | High |
| [BUG-RBAC-007](BUG-STAFF.md) | RBAC | Sidebar hiển thị toàn bộ 20 menu items cho STAFF | High |

### 🟡 Medium (P2) — Fix Sau UAT

| Bug ID | Module | Summary | Severity |
|--------|--------|---------|---------|
| [BUG-MYDAY-002](BUG-STAFF.md) | My Day | Weekly schedule của Maya Chen hiển thị tất cả "Off" | Medium |
| [BUG-RBAC-006](BUG-STAFF.md) | Settings | Settings Save button non-functional khi STAFF truy cập | Medium |

---

## Detailed Module Pass/Fail — STAFF

### TC-AUTH (STAFF Role)
| TC ID | Title | Result |
|-------|-------|--------|
| TC-AUTH-001-STAFF | Login STAFF thành công | ✅ PASS |
| TC-AUTH-002-STAFF | Đăng xuất | ❌ FAIL — BUG-AUTH-003 (carry-over) |
| TC-AUTH-003-STAFF | Change password | ⚠️ PARTIAL — BUG-AUTH-004 (carry-over) |
| TC-AUTH-004-STAFF | Session persistence | ✅ PASS |

### TC-MYDAY (My Day)
| TC ID | Title | Result |
|-------|-------|--------|
| TC-MYDAY-001 | My Day overview (greeting, stats, schedule) | ⚠️ PARTIAL — BUG-MYDAY-002 |
| TC-MYDAY-002 | Clock In / Clock Out | ❌ FAIL — BUG-MYDAY-001 |
| TC-MYDAY-003 | Cập nhật booking status từ My Day | ⏭️ SKIP — Không có booking cho Maya |

### TC-RBAC (Access Control)
| TC ID | Title | Result |
|-------|-------|--------|
| TC-RBAC-001 | Frontend route guard | ❌ FAIL — BUG-RBAC-001 |
| TC-RBAC-002 | API: POST /api/admin/staff | ❌ FAIL — BUG-RBAC-002 |
| TC-RBAC-003 | API: POST /api/admin/clients | ❌ FAIL — BUG-RBAC-003 |
| TC-RBAC-004 | API: GET /api/admin/bookings | ❌ FAIL — BUG-RBAC-004 |
| TC-RBAC-005 | Clients page PII exposure | ❌ FAIL — BUG-RBAC-005 |
| TC-RBAC-006 | API: Payments → 403 | ✅ PASS |
| TC-RBAC-007 | API: Reports → 403 | ✅ PASS |
| TC-RBAC-008 | API: Expenses → 403 | ✅ PASS |
| TC-RBAC-009 | API: Audit Log → 403 | ✅ PASS |
| TC-RBAC-010 | API: Config → 403 | ✅ PASS |
| TC-RBAC-011 | Settings Save button (STAFF) | ❌ FAIL — BUG-RBAC-006 |
| TC-RBAC-012 | Sidebar navigation filtering | ❌ FAIL — BUG-RBAC-007 |
| TC-RBAC-013 | Services edit/add (STAFF) | ⚠️ PARTIAL — Buttons visible, click silent |
| TC-RBAC-014 | Inventory page access | ❌ FAIL — BUG-RBAC-001 |
| TC-RBAC-015 | Gallery "Thêm ảnh" (STAFF) | ❌ FAIL — BUG-RBAC-001 |

---

## Key Findings — STAFF Session

### 🚨 Security Blockers (Must Fix Before Go-Live)

1. **BUG-RBAC-002** — STAFF có thể tạo nhân viên mới qua API với bất kỳ role nào, kể cả ADMIN. **Privilege escalation risk nghiêm trọng.**

2. **BUG-RBAC-003** — STAFF có thể tạo client records tùy ý vào database production.

3. **BUG-RBAC-001** — Toàn bộ admin panel accessible cho STAFF không bị chặn. Không có middleware route guard.

### ⚠️ RBAC Pattern Issues

**API-level protection không nhất quán:**
- ✅ Được bảo vệ đúng: payments, reports, expenses, audit-log, config (403)
- ❌ Không được bảo vệ: bookings GET, staff GET/POST, clients GET/POST, inventory GET

**Nhận xét:** Có vẻ chỉ một số endpoints được bảo vệ chủ động, phần còn lại bị bỏ sót. Cần audit toàn bộ API routes với danh sách whitelist/blacklist theo role.

### 💰 Business Impact — STAFF

- **BUG-MYDAY-001**: Không thể track giờ làm — dữ liệu payroll không chính xác
- **BUG-RBAC-005**: GDPR/Privacy risk — nhân viên truy cập PII 30 khách hàng
- **BUG-RBAC-002/003**: Integrity risk — nhân viên có thể ghi vào DB

---

## Combined Bug Register (Cả 2 Session)

| Session | Total Bugs | P0 | P1 | P2 | P3 |
|---------|------------|-----|-----|-----|-----|
| ADMIN | 16 | 3 | 6 | 4 | 3 |
| STAFF | 9 | 3 | 4 | 2 | 0 |
| **TOTAL** | **25** | **6** | **10** | **6** | **3** |

---

## Recommended Fix Priority — STAFF Session

```
SPRINT 1 — Pre-UAT Critical (1-2 days)
├── BUG-RBAC-002: Add role middleware to POST /api/admin/staff
├── BUG-RBAC-003: Add role middleware to POST /api/admin/clients
└── BUG-RBAC-001: Implement Next.js middleware — STAFF → redirect to /admin/my-day

SPRINT 2 — Pre-UAT High (2-3 days)
├── BUG-MYDAY-001: Build clock-in/clock-out backend endpoint
├── BUG-RBAC-004: Filter GET /api/admin/bookings by staffId for STAFF role
├── BUG-RBAC-005: Add 403 to GET /api/admin/clients for STAFF
└── BUG-RBAC-007: Filter sidebar nav items by role

SPRINT 3 — Post-UAT
├── BUG-MYDAY-002: Seed working schedule for staff accounts
└── BUG-RBAC-006: Fix Settings page RBAC or restrict access
```

## Cleanup Required (Production DB) — STAFF Session

| Record | ID | How to cleanup |
|--------|-----|---------------|
| Staff "RBAC Test Staff" | `cmoz7ch33000o2dntsjev6cc8` | DELETE via ADMIN → Nhân viên → Delete |
| Client "Test RBAC" (rbac@test.com) | `cmoz7ch66000p2dntw0t7gtr8` | DELETE via ADMIN → Khách hàng → Delete |

---

---

## Session 3 — MANAGER Role

**Date:** 2026-05-10  
**Role tested:** MANAGER (manager@angelnail.co.nz — Sofia Blanco, Artistic Director)

## Executive Summary — MANAGER Session

| Metric | Value |
|--------|-------|
| Modules tested | 7 (Auth, Dashboard, Appointments, Services, Staff, OPS, RBAC) |
| Total test cases executed | 33 |
| ✅ PASS | 19 |
| ❌ FAIL | 9 |
| ⚠️ PARTIAL | 3 |
| ⏭️ SKIP | 2 |
| **Pass Rate** | **~61%** (PASS / non-SKIP) |
| Total bugs found | **10** (mới) + cross-ref |
| Critical (P0) | 2 |
| High (P1) | 4 |
| Medium (P2) | 3 |
| Low (P3) | 1 |

---

## Module Results — MANAGER

| Module | TC Range | PASS | FAIL | PARTIAL | SKIP | Bugs |
|--------|----------|------|------|---------|------|------|
| TC-AUTH-MGR | 001~002 | 2 | 0 | 0 | 0 | — |
| TC-DASH-MGR | 001~004 | 2 | 2 | 0 | 0 | 2 |
| TC-APT-MGR | 001~006 | 2 | 3 | 1 | 0 | 3 |
| TC-SVC-MGR | 001~005 | 3 | 0 | 2 | 0 | — (cross-ref) |
| TC-STF-MGR | 001~004 | 2 | 1 | 1 | 0 | 1 |
| TC-OPS-MGR | 001~008 | 6 | 2 | 0 | 0 | 1 |
| TC-SET-MGR + TC-RBAC-MGR | 001~004 | 2 | 2 | 0 | 2 | 4 |
| **TOTAL** | **31 cases** | **19** | **9** | **3** | **2** | **10** |

---

## Bug Register — MANAGER Session

### 🔴 Critical (P0) — Must Fix Before Go-Live

| Bug ID | Module | Summary | Severity |
|--------|--------|---------|---------|
| [BUG-MGR-RBAC-001](BUG-MANAGER.md) | RBAC | MANAGER truy cập được Settings và ghi config (API keys exposed) | Critical |
| [BUG-MGR-APT-001](BUG-MANAGER.md) | Appointments | Service dropdown hiển thị "— ( min)" — không tạo/sửa được booking | Critical |

### 🟠 High (P1) — Phải Fix Trước UAT

| Bug ID | Module | Summary | Severity |
|--------|--------|---------|---------|
| [BUG-MGR-RBAC-002](BUG-MANAGER.md) | RBAC | Audit Log UI accessible cho MANAGER (không redirect) | High |
| [BUG-MGR-APT-002](BUG-MANAGER.md) | Appointments | POST /api/admin/bookings → 404 "Service not found" | High |
| [BUG-MGR-SYS-001](BUG-MANAGER.md) | System | 3× duplicate API calls trên mọi mutation (race condition) | High |
| [BUG-MGR-SYS-002](BUG-MANAGER.md) | System | Payroll/Closing/Reports-Staff API chưa implement (404) | High |

### 🟡 Medium (P2) — Fix Sau UAT

| Bug ID | Module | Summary | Severity |
|--------|--------|---------|---------|
| [BUG-MGR-APT-003](BUG-MANAGER.md) | Appointments | URL ?status=PENDING không được apply vào filter | Medium |
| [BUG-MGR-DASH-001](BUG-MANAGER.md) | Dashboard | "Pending bookings" link không navigate khi click | Medium |
| [BUG-MGR-DASH-002](BUG-MANAGER.md) | Dashboard | Revenue chart "No revenue" mâu thuẫn với KPI $3,140 | Medium |

### 🟢 Low (P3) — Improvements

| Bug ID | Module | Summary | Severity |
|--------|--------|---------|---------|
| [BUG-MGR-STF-001](BUG-MANAGER.md) | Staff | Search nhân viên không filter (trả về tất cả) | Low |

---

## Detailed Module Pass/Fail — MANAGER

### TC-AUTH (MANAGER Role)
| TC ID | Title | Result |
|-------|-------|--------|
| TC-AUTH-MGR-001 | Login MANAGER | ✅ PASS |
| TC-AUTH-MGR-002 | Session / role check | ✅ PASS |

### TC-DASH (Dashboard — MANAGER)
| TC ID | Title | Result |
|-------|-------|--------|
| TC-DASH-MGR-001 | KPI cards (bookings 54, revenue $3,140, clients 5) | ✅ PASS |
| TC-DASH-MGR-002 | Revenue chart (last 7 days) | ❌ FAIL — BUG-MGR-DASH-002 |
| TC-DASH-MGR-003 | Pending actions navigation | ❌ FAIL — BUG-MGR-DASH-001 |
| TC-DASH-MGR-004 | Upcoming appointments + inventory alert | ✅ PASS |

### TC-APT (Appointments — MANAGER)
| TC ID | Title | Result |
|-------|-------|--------|
| TC-APT-MGR-001 | List + date filter | ✅ PASS |
| TC-APT-MGR-002 | Create appointment (UI) | ❌ FAIL — BUG-MGR-APT-001, BUG-MGR-APT-002 |
| TC-APT-MGR-003 | Edit appointment (UI) | ⚠️ PARTIAL — BUG-MGR-APT-001 (service dropdown empty) |
| TC-APT-MGR-004 | Complete appointment | ✅ PASS — BUG-MGR-SYS-001 noted |
| TC-APT-MGR-005 | Cancel appointment | ✅ PASS |
| TC-APT-MGR-006 | Status filter (URL param) | ❌ FAIL — BUG-MGR-APT-003 |

### TC-SVC (Services — MANAGER)
| TC ID | Title | Result |
|-------|-------|--------|
| TC-SVC-MGR-001 | List services + categories | ✅ PASS — 6 services in 3 categories |
| TC-SVC-MGR-002 | Edit service (form + save) | ✅ PASS — PUT 200 |
| TC-SVC-MGR-003 | Add service (modal) | ⚠️ PARTIAL — modal opens ✅; Save blocked (React state) |
| TC-SVC-MGR-004 | Delete service | ✅ PASS — native confirm dialog |
| TC-SVC-MGR-005 | Add category | ✅ PASS — modal "Danh mục mới" opens |

### TC-STF (Staff — MANAGER)
| TC ID | Title | Result |
|-------|-------|--------|
| TC-STF-MGR-001 | List staff (7 members) | ✅ PASS |
| TC-STF-MGR-002 | Edit staff (form + save) | ✅ PASS — PUT 200 |
| TC-STF-MGR-003 | Add staff (modal) | ⚠️ PARTIAL — modal opens ✅ |
| TC-STF-MGR-004 | Search staff | ❌ FAIL — BUG-MGR-STF-001 |

### TC-OPS (Operations — MANAGER)
| TC ID | Title | Result |
|-------|-------|--------|
| TC-OPS-MGR-001 | Clients (list + add modal) | ✅ PASS — 31 clients, PII accessible |
| TC-OPS-MGR-002 | Inventory | ✅ PASS — 4 items, low stock 1 |
| TC-OPS-MGR-003 | Payments | ✅ PASS — GET 200 |
| TC-OPS-MGR-004 | Gift Cards | ✅ PASS — 6 cards |
| TC-OPS-MGR-005 | Expenses (view + create) | ✅ PASS — POST 201 |
| TC-OPS-MGR-006 | Reports / Revenue | ✅ PASS — GET 200 |
| TC-OPS-MGR-007 | Payroll | ❌ FAIL — BUG-MGR-SYS-002 (404) |
| TC-OPS-MGR-008 | Closing / End-of-day | ❌ FAIL — BUG-MGR-SYS-002 (404) |

### TC-SET-MGR + TC-RBAC-MGR (RBAC — MANAGER)
| TC ID | Title | Result |
|-------|-------|--------|
| TC-SET-MGR-001 | Settings page blocked for MANAGER | ❌ FAIL — BUG-MGR-RBAC-001 |
| TC-SET-MGR-002 | Config API (GET/POST) blocked | ❌ FAIL — BUG-MGR-RBAC-001 |
| TC-RBAC-MGR-001 | Audit Log API → 403 | ✅ PASS |
| TC-RBAC-MGR-002 | Audit Log UI → blocked | ❌ FAIL — BUG-MGR-RBAC-002 |

---

## Key Findings — MANAGER Session

### 🚨 Security Blockers

1. **BUG-MGR-RBAC-001** — MANAGER truy cập Settings và đọc được `DEEPSEEK_API_KEY`, `RESEND_API_KEY` từ `GET /api/admin/config`. Hơn nữa `POST /api/admin/config` → 200 cho phép MANAGER ghi đè cấu hình hệ thống. **Critical security breach.**

2. **BUG-MGR-APT-001** — Service dropdown broken trong Create/Edit appointment → không thể quản lý lịch hẹn qua admin UI. Core operations function bị blocked.

### MANAGER API Access Summary

| Category | Access | Verdict |
|----------|--------|---------|
| Operational endpoints (bookings/staff/clients/inventory/payments/expenses/gift-cards) | ✅ 200 | Correct |
| Config (GET/POST) | ❌ 200 | Should be 403 |
| Audit Log (API) | ✅ 403 | Correct |
| Audit Log (UI) | ❌ Accessible | Should redirect |
| Settings (UI) | ❌ Accessible | Should redirect |
| Payroll / Closing | ⚠️ 404 | Not implemented |

---

## Combined Bug Register (Tất Cả 3 Sessions)

| Session | Total Bugs | P0 | P1 | P2 | P3 |
|---------|------------|-----|-----|-----|-----|
| Session 1 — ADMIN | 16 | 3 | 6 | 4 | 3 |
| Session 2 — STAFF | 9 | 3 | 4 | 2 | 0 |
| Session 3 — MANAGER | 10 | 2 | 4 | 3 | 1 |
| **TOTAL** | **35** | **8** | **14** | **9** | **4** |

> Note: BUG-MGR-APT-001 = same root cause as BUG-APT-001 (cross-role). BUG-MGR-DASH-001 = same as BUG-DASH-001. Cross-role unique issues counted separately by session.

---

## Recommended Fix Priority — MANAGER Session

```
SPRINT 1 — Pre-UAT Critical
├── BUG-MGR-RBAC-001: Add ADMIN-only guard to GET/POST /api/admin/config
└── BUG-MGR-APT-001: Fix service dropdown in appointment form (shared fix with BUG-APT-001)

SPRINT 2 — Pre-UAT High
├── BUG-MGR-RBAC-002: Add frontend redirect for MANAGER on /admin/settings + /admin/audit-log
├── BUG-MGR-SYS-001: Fix duplicate API calls (remove StrictMode double-invoke or debounce handlers)
└── BUG-MGR-SYS-002: Implement payroll + closing API endpoints

SPRINT 3 — Post-UAT
├── BUG-MGR-APT-003: Read URL ?status= param in appointments page mount
├── BUG-MGR-DASH-001: Fix SPA navigation on dashboard action links
├── BUG-MGR-DASH-002: Fix revenue chart data source
└── BUG-MGR-STF-001: Implement server-side search for staff API
```

## Cleanup Required (Production DB) — MANAGER Session

| Record | ID | How to cleanup |
|--------|-----|---------------|
| Staff "Test" | `cmoz96jij000x2dnt9djf2p2o` | DELETE via ADMIN → Nhân viên → Delete |
| Expense (RBAC test, $50) | `cmoz96jkr000y2dntmxe6dl7a` | DELETE via ADMIN → Chi phí → Delete |
| Client "MGR TestCreate" | `cmoz8mwhh000s2dntpj45ba95` | DELETE via ADMIN → Khách hàng → Delete |
| Staff "RBAC Test Staff" (Session 2) | `cmoz7ch33000o2dntsjev6cc8` | DELETE via ADMIN → Nhân viên → Delete |
| Client "Test RBAC" (Session 2) | `cmoz7ch66000p2dntw0t7gtr8` | DELETE via ADMIN → Khách hàng → Delete |
