# BUG REPORTS — TC-APT (Appointments)

**Module:** Appointments Management  
**Tested by:** QA Automation  
**Test date:** 2026-05-09  
**Environment:** Chrome / Windows 10 / `https://project.vinapage.com/angel/admin/appointments` / Role: ADMIN  

---

## BUG-APT-001 — Service dropdown trong Create/Edit form hiển thị "— ( min)" — không có tên dịch vụ

**Bug ID:** BUG-APT-001  
**Test Case:** TC-APT-002, TC-APT-008  
**Severity:** Critical  
**Priority:** P0  
**Status:** Open  
**Summary:** Dropdown "Chọn dịch vụ" trong cả form "Tạo lịch hẹn" và "Edit appointment" hiển thị tất cả options dưới dạng "— ( min)" thay vì tên và thời lượng dịch vụ. Admin không thể tạo hoặc chỉnh sửa booking.

**Environment:**
- Browser: Chrome (Playwright)
- OS: Windows 10
- URL: `https://project.vinapage.com/angel/admin/appointments`
- Role: ADMIN

**Steps to Reproduce — Create:**
1. Vào `/angel/admin/appointments`
2. Click "+ Tạo lịch hẹn"
3. Modal mở → quan sát dropdown "Chọn dịch vụ *"
4. Click vào dropdown để xem các options

**Steps to Reproduce — Edit:**
1. Click nút "Edit" trên bất kỳ booking nào
2. Modal "Edit appointment" mở → quan sát dropdown dịch vụ
3. Service dropdown hiển thị placeholder "Chọn dịch vụ *" (không pre-filled)

**Actual Result:**
```
Option 1: value=cmn70drz90000kwve77j9wsr7  →  text: "— ( min)"
Option 2: value=cmn70dsq60001kwvevne3radp  →  text: "— ( min)"
Option 3: value=cmn70dtgz0002kwvewbhzhiie  →  text: "— ( min)"
Option 4: value=cmn70du7v0003kwve9taq9pfq  →  text: "— ( min)"
Option 5: value=cmn70duys0004kwveflmzbd9s  →  text: "— ( min)"
```
Trong Edit form: service hiện tại **không được pre-filled** (vẫn hiển thị placeholder)

**Expected Result:**
```
Option 1: value=seed-signature-gel-manicure  →  "Signature Gel Manicure 1 — 45 min"
Option 2: value=seed-classic-french-tip      →  "Classic French Tip — 60 min"
Option 3: value=seed-express-polish-change   →  "Express Polish Change — 20 min"
...
```

**Root Cause Analysis:**
- API `GET /angel/api/admin/services` trả về **categories** (5 records) với nested services — KHÔNG phải flat list of services
- Category IDs (`cmn70drz900...`) được dùng làm option values — sai, phải dùng service IDs
- Template dropdown dùng `service.title` và `service.duration` — nhưng category chỉ có `name` (không có `title`, `duration`)
- Do đó: `{service.title} — {service.duration} ( min)` render thành `undefined — undefined ( min)` → "— ( min)"

**API Evidence:**
```json
// GET /api/admin/services returns:
[{ id: "cmn70drz9...", name: "Manicure", services: [{id: "seed-signature-gel-manicure", title: "...", duration: 45}] }]
// Should use: categories[].services[] (flat), not categories[]
```

**Impact:** CRITICAL — Admin **không thể tạo hoặc chỉnh sửa booking** từ admin panel. Chức năng cốt lõi bị broken.

**Attachments:** `apt-002-create-form.png`, `apt-008-edit-form.png`

---

## BUG-APT-002 — Edit form không pre-fill service đã chọn của booking

**Bug ID:** BUG-APT-002  
**Test Case:** TC-APT-008  
**Severity:** High  
**Priority:** P1  
**Status:** Open  
**Summary:** Khi mở form "Edit appointment" từ một booking có sẵn, trường service (dịch vụ) hiển thị placeholder "Chọn dịch vụ *" thay vì hiển thị dịch vụ đã được đặt. Admin không thể xem hoặc thay đổi dịch vụ khi reschedule.

**Environment:**
- Browser: Chrome (Playwright)  
- URL: `/angel/admin/appointments` (27/03/2026)  
- Role: ADMIN

**Steps to Reproduce:**
1. Filter ngày 27/03/2026
2. Click "Edit" trên booking của Sophia Laurent (Signature Gel Manicure 1, 04:00 PM)
3. Modal "Edit appointment" mở

**Actual Result:**
- Fields pre-filled: Tên (Sophia Laurent), Email, SĐT, Staff (Elena Rossi), Ngày (03/27/2026), Giờ (04:00 PM)
- Field **dịch vụ**: hiển thị "Chọn dịch vụ *" (KHÔNG pre-filled)

**Expected Result:**
- Field dịch vụ phải hiển thị "Signature Gel Manicure 1" (dịch vụ đã đặt)

**Note:** Bug này liên quan đến BUG-APT-001 (service dropdown dùng sai data structure). Khi fix BUG-APT-001, bug này cũng cần được kiểm tra lại.

---

## TC-APT Summary — Pass/Fail Matrix

| TC ID | Title | Result | Bug |
|-------|-------|--------|-----|
| TC-APT-001 | List view, date filter chips | ✅ PASS | — |
| TC-APT-002 | Tạo lịch hẹn mới | ❌ FAIL | BUG-APT-001 |
| TC-APT-003 | Edit + status change (Xác nhận, Hoàn thành) | ⚠️ PARTIAL | BUG-APT-002 (edit); status change via button works |
| TC-APT-004 | Huỷ booking (cancel với dialog) | ✅ PASS | — |
| TC-APT-005 | Tìm kiếm theo tên, mã Ref | ✅ PASS | — |
| TC-APT-006 | Filter theo trạng thái dropdown | ✅ PASS | — |
| TC-APT-007 | Conflict detection | ⏭️ SKIP | Blocked by BUG-APT-001 (cannot create bookings to test) |
| TC-APT-008 | Edit/Reschedule | ❌ FAIL | BUG-APT-001, BUG-APT-002 |

**Observations thêm:**
- Status dropdown có thêm option "NO_SHOW" (No show) — không được document trong test cases; cần xác nhận đây là feature hay undocumented status
- Status change via "Xác nhận" button không có confirmation dialog (direct action); chỉ "Huỷ" mới có dialog
- Counter cards khi filter status hiển thị 0 cho các status khác (behavior có thể confusing cho user)

**Summary:** 3 PASS, 2 FAIL, 1 PARTIAL, 1 SKIP  
**Critical bugs:** 1 (BUG-APT-001)  
**High bugs:** 1 (BUG-APT-002)
