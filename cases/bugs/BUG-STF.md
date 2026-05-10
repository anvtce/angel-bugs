# BUG REPORTS — TC-STF (Staff Management)

**Module:** Staff Management  
**Tested by:** QA Automation  
**Test date:** 2026-05-09  
**Environment:** Chrome / Windows 10 / `https://project.vinapage.com/angel/admin/staff` / Role: ADMIN  

---

## BUG-STF-001 — Form tạo/sửa nhân viên không có field gán dịch vụ chuyên môn

**Bug ID:** BUG-STF-001  
**Test Case:** TC-STF-003  
**Severity:** High  
**Priority:** P1  
**Status:** Open  
**Summary:** Form tạo và sửa nhân viên không có section để gán dịch vụ mà nhân viên có thể thực hiện. Không có checkboxes services trong staff form. Việc gán staff-service chỉ có thể thực hiện từ phía quản lý dịch vụ (Services admin → "Who can perform this service?").

**Environment:**
- Browser: Chrome (Playwright)
- OS: Windows 10
- URL: `https://project.vinapage.com/angel/admin/staff`
- Role: ADMIN

**Steps to Reproduce:**
1. Vào `/angel/admin/staff`
2. Click "Thêm nhân viên" hoặc click "Edit" trên bất kỳ nhân viên nào
3. Kiểm tra tất cả các fields trong form

**Actual Result:**
- Form chỉ có: Họ và tên*, Vai trò/Chức danh*, Chuyên môn/Huy hiệu (free text), Giới thiệu, Ảnh, Available toggle
- **Không có checkboxes** để gán service nào nhân viên thực hiện được
- Không có Email, Phone fields trong form (không thể nhập thông tin liên lạc của nhân viên)

**Expected Result (theo TC-STF-003):**
- Form phải có section "Dịch vụ chuyên môn" với checkboxes list các services active
- Admin có thể chọn/bỏ chọn service từ staff form mà không phải vào từng service

**Impact:**
- Admin phải vào từng service, sửa "Who can perform this service?" để gán staff — workflow kém hiệu quả
- Nếu có nhiều services, việc gán staff cho từng service là tốn thời gian
- Không có field Email/Phone cho staff (khó liên lạc)

**Workaround:** Vào `/angel/admin/services` → edit từng service → check/uncheck staff trong "Who can perform this service?"

**Attachments:** `stf-003-edit-form.png`

---

## BUG-STF-002 — Xóa nhân viên có booking active không có cảnh báo hay ràng buộc

**Bug ID:** BUG-STF-002  
**Test Case:** TC-STF-005 (Step 2)  
**Severity:** High  
**Priority:** P1  
**Status:** Open  
**Summary:** Khi xóa nhân viên có booking đang active (PENDING/CONFIRMED), hệ thống chỉ hiện confirmation dialog chung "Delete X? This cannot be undone." — không có cảnh báo về bookings đang active và không chặn thao tác.

**Environment:**
- Browser: Chrome (Playwright)
- OS: Windows 10
- URL: `/angel/admin/staff`
- Role: ADMIN
- Test: Thử xóa "Elena Rossi" (23 lịch hẹn) — đã cancel để bảo toàn data

**Steps to Reproduce:**
1. Chọn nhân viên có nhiều lịch hẹn (VD: Elena Rossi — 23 lịch hẹn)
2. Click nút "delete" trên card hoặc trong bảng
3. Quan sát confirmation dialog

**Actual Result:**
- Dialog: `Delete "Elena Rossi"? This cannot be undone.` — giống với dialog xóa nhân viên không có booking
- Không có cảnh báo "Nhân viên có 23 lịch hẹn active"
- Nếu confirm: hệ thống có thể xóa staff, để lại orphaned bookings với staff_id không còn tồn tại

**Expected Result (theo TC-STF-005 Step 2):**
- Hệ thống kiểm tra xem staff có booking PENDING/CONFIRMED không
- Nếu có: hiển thị cảnh báo và chặn delete, hoặc yêu cầu reassign bookings trước
- VD: "Elena Rossi có 5 lịch hẹn đang chờ. Vui lòng reassign trước khi xóa."

**Risk:** Data integrity issue — xóa staff có booking active có thể gây broken references, lỗi hiển thị booking, và khó track lịch sử.

**Attachments:** `stf-005-deleted.png`

---

## TC-STF Summary — Pass/Fail Matrix

| TC ID | Title | Result | Bug |
|-------|-------|--------|-----|
| TC-STF-001 | Tạo nhân viên mới | ✅ PASS | — |
| TC-STF-002 | Upload avatar | ⏭️ SKIP | Không có file ảnh để upload trong môi trường test |
| TC-STF-003 | Gán dịch vụ chuyên môn | ❌ FAIL | BUG-STF-001 (no checkboxes in staff form) |
| TC-STF-004 | Available toggle → booking flow | ✅ PASS | — |
| TC-STF-005 | Xóa nhân viên + ràng buộc booking | ⚠️ PARTIAL | BUG-STF-002 (no warning for active bookings); step 1 (no bookings) ✅ |
| TC-STF-006 | Xem lịch nhân viên | ✅ PASS | — |

**Observations thêm:**
- Form tạo/sửa nhân viên không có fields Email và Phone — chỉ có Name, Role/Title, Specialty badge (free text), Bio, Avatar, Available
- "Chuyên môn / Huy hiệu" là free-text field (VD: "Senior Nail Artist") — khác với service assignment checkboxes
- Schedule modal hiển thị lịch làm việc theo tuần (Mon-Sun) với giờ bắt đầu/kết thúc — đầy đủ và hoạt động tốt
- Delete confirmation cho staff có/không có booking đều dùng cùng 1 dialog

**Summary:** 3 PASS, 1 FAIL, 1 PARTIAL, 1 SKIP  
**High bugs:** 2 (BUG-STF-001, BUG-STF-002)
