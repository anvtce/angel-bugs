# BUG REPORTS — TC-DASH (Dashboard)

**Module:** Dashboard Admin  
**Tested by:** QA Automation  
**Test date:** 2026-05-09  
**Environment:** Chrome / Windows 10 / `https://project.vinapage.com/angel/admin` / Role: ADMIN  

---

## BUG-DASH-001 — URL param `?status=PENDING` không được áp dụng vào filter Appointments

**Bug ID:** BUG-DASH-001  
**Test Case:** TC-DASH-003  
**Severity:** Medium  
**Priority:** P1  
**Status:** Open  
**Summary:** Click "Pending bookings N" trên Dashboard navigate đến `/angel/admin/appointments?status=PENDING`, nhưng trang Appointments không đọc URL param và status dropdown vẫn hiển thị "All statuses" — filter không được áp dụng.

**Environment:**
- Browser: Chrome (Playwright)
- OS: Windows 10
- URL: `https://project.vinapage.com/angel/admin` → click "Pending bookings 2"
- Role: ADMIN

**Steps to Reproduce:**
1. Đăng nhập ADMIN, vào Dashboard
2. Trong section "Pending actions", quan sát "Pending bookings 2"
3. Click vào link "Pending bookings 2"
4. Quan sát trang Appointments sau khi navigate

**Actual Result:**
- URL chuyển đến `/angel/admin/appointments?status=PENDING` ✅
- Tuy nhiên status dropdown vẫn hiển thị **"All statuses"** (không pre-select PENDING)
- Danh sách hiển thị theo ngày hôm nay với 0 bookings (không filter PENDING)
- Counter cards: CHỜ XỬ LÝ = 0, XÁC NHẬN = 0 (vì date filter là today, không phải tất cả)

**Expected Result:**
- Trang Appointments đọc `?status=PENDING` từ URL
- Dropdown status tự động chọn "CHỜ XỬ LÝ (PENDING)"
- Danh sách hiển thị 2 bookings PENDING (confirmed by API `GET /api/admin/bookings?status=PENDING` → total: 2)

**API Verification:**
- `GET /angel/api/admin/bookings?status=PENDING` → HTTP 200, `total: 2` ✅ (data tồn tại)
- `GET /angel/api/admin/stats` → `lowStockCount: 1`, dashboard hiển thị "Pending bookings 2" ✅

**Root Cause (nghi ngờ):** Component Appointments không đọc `searchParams.status` từ URL khi mount.

**Attachments:** `dash-003-pending-filter.png`

---

## TC-DASH Summary — Pass/Fail Matrix

| TC ID | Title | Result | Bug |
|-------|-------|--------|-----|
| TC-DASH-001 | KPI Stats Cards (3 cards + Pending actions) | ✅ PASS | — |
| TC-DASH-002 | Revenue chart 7 ngày | ⚠️ PARTIAL | Chart chỉ hiển thị ngày có data (1/7 days) — xem ghi chú |
| TC-DASH-003 | Pending bookings link → filter | ❌ FAIL | BUG-DASH-001 |
| TC-DASH-004 | Loading state (Slow 3G) | ⏭️ SKIP | P2, cần throttle network |
| TC-DASH-005 | Error state (API 500) | ⏭️ SKIP | P1, cần block request |
| TC-DASH-006 | Upcoming appointments | ✅ PASS | — |
| TC-DASH-007 | Low stock 2 vị trí | ✅ PASS | — |
| TC-DASH-008 | Staff section | ✅ PASS | — |

**Ghi chú TC-DASH-002:** API `GET /api/admin/reports/revenue?from=2026-05-02&to=2026-05-09` trả về `daily: [{date: "2026-05-09", revenueCents: 6200}]` — chỉ 1 ngày có doanh thu. Chart render đúng theo data nhưng hiển thị 6/7 ngày trống, trông như chart bị lỗi. Không phải bug kỹ thuật nhưng có thể cải thiện UX bằng cách hiển thị $0 cho các ngày không có doanh thu.

**Summary:** 4 PASS, 1 FAIL, 2 SKIP, 1 PARTIAL  
**Medium bugs:** 1 (BUG-DASH-001)
