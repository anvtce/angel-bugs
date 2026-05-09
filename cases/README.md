# Angel Nail Salon — Test Cases Index

**Dự án:** Angel Nail Salon — Website đặt lịch & quản lý  
**Địa điểm:** Blenheim, New Zealand  
**Base URL:** `https://project.vinapage.com/angel`  
**Tiêu chuẩn:** IEEE 829 / ISTQB  
**Phiên bản:** 1.0 | **Ngày tạo:** 2026-05-09  
**Tác giả:** QA Team  

---

## 🔑 Test Accounts

| Role | Email | Password | Phạm vi |
|------|-------|----------|---------|
| **ADMIN** | elena@angelnail.co.nz | admin123 | Toàn bộ hệ thống |
| **MANAGER** | manager@angelnail.co.nz | manager123 | Vận hành, không có Settings/Audit |
| **STAFF** | staff@angelnail.co.nz | staff123 | My Day, lịch cá nhân |

> ⚠️ Chỉ dùng trên môi trường test/staging. Thay đổi trước go-live.

---

## 📁 Danh sách Test Case Files

### 🔐 Authentication & Authorization
| File | Mô tả | Cases | Priority |
|------|-------|-------|----------|
| [TC-AUTH-001-admin-login.md](./TC-AUTH-001-admin-login.md) | Đăng nhập, đăng xuất, RBAC, đổi mật khẩu | TC-AUTH-001 ~ 010 | P0 |

### 🖥️ Admin Panel — 19 Modules

| File | Module | URL | Cases | Priority |
|------|--------|-----|-------|----------|
| [TC-DASH-001-dashboard.md](./TC-DASH-001-dashboard.md) | Dashboard | /admin | TC-DASH-001~008 | P0 |
| [TC-MYDAY-001-my-day.md](./TC-MYDAY-001-my-day.md) | My Day | /admin/my-day | TC-MYDAY-001~003 | P0 |
| [TC-APT-001-appointments.md](./TC-APT-001-appointments.md) | Appointments | /admin/appointments | TC-APT-001~008 | P0 |
| [TC-SVC-001-services.md](./TC-SVC-001-services.md) | Services | /admin/services | TC-SVC-001~007 | P0 |
| [TC-GAL-001-gallery.md](./TC-GAL-001-gallery.md) | Gallery | /admin/gallery | TC-GAL-001~004 | P1 |
| [TC-CLI-001-clients.md](./TC-CLI-001-clients.md) | Clients | /admin/clients | TC-CLI-001~006 | P1 |
| [TC-STF-001-staff.md](./TC-STF-001-staff.md) | Staff | /admin/staff | TC-STF-001~006 | P0 |
| [TC-INV-001-inventory.md](./TC-INV-001-inventory.md) | Inventory | /admin/inventory | TC-INV-001~006 | P0 |
| [TC-PAY-001-payments.md](./TC-PAY-001-payments.md) | Payments | /admin/payments | TC-PAY-001~004 | P1 |
| [TC-GC-001-gift-cards.md](./TC-GC-001-gift-cards.md) | Gift Cards | /admin/gift-cards | TC-GC-001~005 | P1 |
| [TC-PRL-001-payroll.md](./TC-PRL-001-payroll.md) | Payroll | /admin/payroll | TC-PRL-001~003 | P1 |
| [TC-CLO-001-closing.md](./TC-CLO-001-closing.md) | Closing | /admin/closing | TC-CLO-001~003 | P0 |
| [TC-EXP-001-expenses.md](./TC-EXP-001-expenses.md) | Expenses | /admin/expenses | TC-EXP-001~004 | P1 |
| [TC-PO-001-purchase-orders.md](./TC-PO-001-purchase-orders.md) | Purchase Orders | /admin/purchase-orders | TC-PO-001~003 | P1 |
| [TC-REV-001-reviews.md](./TC-REV-001-reviews.md) | Reviews | /admin/reviews | TC-REV-001~003 | P1 |
| [TC-RPT-001-reports.md](./TC-RPT-001-reports.md) | Reports | /admin/reports | TC-RPT-001~004 | P1 |
| [TC-ALOG-001-audit-log.md](./TC-ALOG-001-audit-log.md) | Audit Log | /admin/audit-log | TC-ALOG-001~004 | P0 |
| [TC-VOICE-001-voice-agent.md](./TC-VOICE-001-voice-agent.md) | Voice Agent | /admin/voice | TC-VOICE-001~003 | P2 |
| [TC-SET-001-settings.md](./TC-SET-001-settings.md) | Settings | /admin/settings | TC-SET-001~005 | P0 |

### 🌐 Public Site
| File | Mô tả | Cases | Priority |
|------|-------|-------|----------|
| [TC-PUB-001-public-site.md](./TC-PUB-001-public-site.md) | 9 trang public + Navbar + Footer | TC-PUB-001~007 | P1 |

### 📅 Booking Flow
| File | Mô tả | Cases | Priority |
|------|-------|-------|----------|
| [TC-BK-001-booking-flow.md](./TC-BK-001-booking-flow.md) | Luồng đặt lịch 6 bước E2E | TC-BK-001~008 | P0 |

### 🔌 API Testing
| File | Mô tả | Cases | Priority |
|------|-------|-------|----------|
| [TC-API-001-api-testing.md](./TC-API-001-api-testing.md) | Booking, Auth, Admin, Gift Card APIs | TC-API-001~010 | P0 |

### ⚠️ Edge Cases & Security
| File | Mô tả | Cases | Priority |
|------|-------|-------|----------|
| [TC-EDGE-001-edge-cases-security.md](./TC-EDGE-001-edge-cases-security.md) | XSS, SQLi, Rate Limit, Race Condition, Data Boundary | TC-EDGE-001~042 | P0 |
| [TC-RESP-001-responsive-i18n.md](./TC-RESP-001-responsive-i18n.md) | Responsive, Cross-browser, a11y | TC-RESP-001~006 | P1 |

---

## 📊 Tổng kết

| Hạng mục | Số lượng |
|----------|---------|
| Tổng file test case | **22 files** |
| Tổng test cases | **~120+ cases** |
| Admin modules covered | **19/19** |
| Public pages covered | **9/9** |
| API endpoints covered | **15+ endpoints** |

---

## 🎯 Test Execution Priority

### Sprint 1 — Core (Phải Pass trước Go-Live)
```
P0: AUTH, BOOKING-FLOW, APPOINTMENTS, DASHBOARD, API-SECURITY
→ TC-AUTH-001~010
→ TC-BK-001~008 (E2E)
→ TC-APT-001~008
→ TC-DASH-001~005
→ TC-API-001~008
→ TC-EDGE-001~005 (Security)
```

### Sprint 2 — Business Critical
```
P1: SERVICES, STAFF, INVENTORY, CLOSING, AUDIT-LOG, SETTINGS
→ TC-SVC-001~007
→ TC-STF-001~006
→ TC-INV-001~006
→ TC-CLO-001~003
→ TC-ALOG-001~004
→ TC-SET-001~005
```

### Sprint 3 — Secondary Features
```
P1-P2: CLIENTS, PAYMENTS, GIFT-CARDS, PAYROLL, REPORTS, REVIEWS
→ Còn lại P1 modules
→ Responsive testing
→ i18n VI/EN
→ Performance (Lighthouse)
```

---

## 📝 Test Result Template

```markdown
## Test Execution Report
**Date:** YYYY-MM-DD
**Tester:** [Tên]
**Build:** [version/commit]
**Environment:** Staging — https://project.vinapage.com/angel

### Summary
| Status | Count |
|--------|-------|
| PASS ✅ | X |
| FAIL ❌ | X |
| SKIP ⏭️ | X |
| BLOCKED 🚫 | X |

### Failed Cases
| TC ID | Title | Severity | Bug ID |
|-------|-------|----------|--------|
| TC-XXX | ... | Critical | BUG-XXX |
```

---

## 🐛 Bug Report Template

```markdown
**Bug ID:** BUG-[MODULE]-[NUMBER]
**Test Case:** TC-XXX-XXX
**Severity:** Critical / High / Medium / Low
**Priority:** P0 / P1 / P2
**Status:** Open / In Progress / Resolved

**Summary:** [Mô tả ngắn trong 1 câu]

**Environment:**
- Browser: Chrome 136 / Windows 11
- URL: https://project.vinapage.com/angel/...
- Role: ADMIN / MANAGER / STAFF

**Steps to Reproduce:**
1. ...
2. ...
3. ...

**Actual Result:** [Điều gì thực sự xảy ra]
**Expected Result:** [Điều gì phải xảy ra]

**Attachments:** [Screenshot / Video / HAR file]
```
