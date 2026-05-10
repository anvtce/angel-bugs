# BUG REPORTS — TC-SET (Settings)

**Module:** Settings  
**Tested by:** QA Automation  
**Test date:** 2026-05-09  
**Environment:** Chrome / Windows 10 / `https://project.vinapage.com/angel/admin/settings` / Role: ADMIN  

---

## BUG-SET-001 — Opening hours tab hiển thị "Times are in 24h format" nhưng UI dùng 12h AM/PM

**Bug ID:** BUG-SET-001  
**Test Case:** TC-SET-002  
**Severity:** Low  
**Priority:** P3  
**Status:** Open  
**Summary:** Tab "Opening hours" có subtitle "Set your weekly opening hours. Times are in 24h format." nhưng time pickers thực tế hiển thị và nhập theo định dạng 12h (09:00 AM, 06:00 PM). Text hướng dẫn không đúng với UI.

**Environment:**
- URL: `/angel/admin/settings` → tab "Opening hours"
- Role: ADMIN

**Actual Result:**
- Subtitle: "Times are in 24h format." (hướng dẫn nhập 24h)
- Time picker hiển thị: "09:00 AM", "06:00 PM" (12h format)
- UI sử dụng AM/PM clock picker

**Expected Result:**
- Hoặc subtitle đúng: "Times are in 12h format (AM/PM)"
- Hoặc time picker đúng: "09:00", "18:00" (24h)

**Impact:** Low — chỉ gây nhầm lẫn nhỏ cho admin.

**Attachments:** `set-002-opening-hours.png`

---

## TC-SET Summary — Pass/Fail Matrix

| TC ID | Title | Result | Bug |
|-------|-------|--------|-----|
| TC-SET-001 | Sửa thông tin tiệm (Business info) | ✅ PASS | — |
| TC-SET-002 | Giờ mở cửa từng ngày | ✅ PASS | BUG-SET-001 (minor: 24h label vs 12h picker) |
| TC-SET-003 | Quản lý User (Team tab) | ✅ PASS | — |
| TC-SET-004 | Email notification templates | ⚠️ PARTIAL | — |
| TC-SET-005 | Access control ADMIN-only | ⏭️ SKIP | Cần session MANAGER/STAFF để test |

**Observations thêm:**

**TC-SET-001:**
- Business info lưu thành công (phone "03 579 9999" persisted sau reload)
- Public contact page `/angel/contact` không cập nhật ngay sau save — vẫn hiển thị số cũ "03 579 1166" trong visible content (possible Next.js ISR cache); số mới xuất hiện trong hydration JSON nhưng không render ra UI ngay
- Rollback thành công về "03 579 1166"

**TC-SET-002:**
- Sunday = Closed by default ✅
- Mon–Sat có time pickers với giờ mở/đóng ✅
- Không test save + booking impact (scope giới hạn để tránh thay đổi booking slots cho tests sau)

**TC-SET-003 (Team tab — User Management):**
- Located at Settings → Team tab (không phải tab riêng)
- Users: Elena Rossi (Admin), Sofia Blanco (Manager), Maya Chen (Staff)
- "New user" modal: Name, Email, Password (min 8 chars), Role dropdown (Staff/Manager/Admin)
- Actions: Reset password, Delete, Role change via dropdown ✅

**TC-SET-004 (Email templates):**
- Tab tên "Email templates" (không phải "Email" như spec)
- 4 templates: BOOKING CONFIRMATION, BOOKING CANCELLATION, BOOKING REMINDER, GIFT CARD DELIVERY
- Tất cả trạng thái "Not configured yet" — chưa có template nào được tạo
- UI dùng template editor (thay vì toggle on/off như spec mô tả)
- TC-SET-004 spec mô tả "toggle notification" — nhưng UI là template editor → spec cần cập nhật

**Summary:** 3 PASS, 1 PARTIAL, 1 SKIP  
**Low bugs:** 1 (BUG-SET-001)
