# TEST EXECUTION REPORT — Angel Nail Salon (ADMIN)

**Date:** 2026-05-09  
**Tester:** QA Automation (Claude)  
**Build:** production — `https://project.vinapage.com/angel`  
**Environment:** Chrome / Windows 10 / Playwright MCP  
**Role tested:** ADMIN (elena@angelnail.co.nz)  
**Standard:** IEEE 829 / ISTQB  

---

## Executive Summary

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
