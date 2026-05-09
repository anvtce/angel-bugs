# BUG REPORTS — TC-BK (Booking Flow)

**Module:** Public Booking Flow  
**Tested by:** QA Automation  
**Test date:** 2026-05-09  
**Environment:** Chrome / Windows 10 / `https://project.vinapage.com/angel/booking` / Role: Guest  

---

## BUG-BK-001 — Booking time hiển thị sai (UTC thay vì giờ địa phương)

**Bug ID:** BUG-BK-001  
**Test Case:** TC-BK-005, TC-BK-008  
**Severity:** Critical  
**Priority:** P0  
**Status:** Open  
**Summary:** Sau khi tạo booking với giờ "10:00 AM" (ngày 11/05/2026), trang success và trang manage-booking đều hiển thị "3:00 am" thay vì "10:00 AM". Thời gian được lưu là `2026-05-11T03:00:00.000Z` (UTC) trong khi user chọn 10:00 AM giờ địa phương.

**Environment:**
- URL: `/angel/booking/success`, `/angel/manage-booking`
- Role: Guest

**Steps to Reproduce:**
1. Thực hiện booking flow đầy đủ: chọn service, staff (No Preference), chọn ngày 11/05/2026, chọn slot 10:00 AM
2. Điền thông tin và confirm booking
3. Quan sát thời gian hiển thị trên trang success

**Actual Result:**
- Success page hiển thị: `TIME: 3:00 am`
- Manage booking page hiển thị: `TIME: 3:00 am`
- API `GET /api/admin/bookings?date=2026-05-11` trả về: `date: "2026-05-11T03:00:00.000Z"`

**Expected Result:**
- Thời gian phải hiển thị là: `10:00 AM` (đúng với slot user đã chọn)

**Root Cause Analysis:**
- Server có múi giờ UTC+7 (Asia/Ho_Chi_Minh)
- User chọn "10:00 AM" → server xử lý như local time UTC+7 → lưu vào DB là `10:00 - 7h = 03:00 UTC`
- Trang success/manage-booking render trực tiếp UTC timestamp thay vì convert về múi giờ địa phương NZ (UTC+12/+13)
- **Hậu quả:** Khách ở NZ thấy thời gian sai 7 giờ trên confirmation

**Impact:** CRITICAL — Khách hàng nhận được confirmation với giờ sai → có thể đến sai giờ hẹn. Đây là core UX flow của ứng dụng.

**API Evidence:**
```json
// POST /api/bookings (slot selected: 10:00 AM)
// Stored: "2026-05-11T03:00:00.000Z" (UTC)
// Displayed: "3:00 am" (raw UTC instead of local NZ time)
```

**Attachments:** `bk-005-success-page.png`

---

## BUG-BK-002 — Enhancement add-on không được tính vào tổng giá booking

**Bug ID:** BUG-BK-002  
**Test Case:** TC-BK-001 (Step 9), TC-BK-004 (Step 12), TC-BK-005  
**Severity:** High  
**Priority:** P1  
**Status:** Open  
**Summary:** Khi thêm Enhancement "Add a Paraffin Wax Treatment" ($15) trong bước 1, giá trong footer cập nhật thành $77 (62+15), nhưng khi booking được tạo, totalPrice chỉ là $6200 ($62). Enhancement không được lưu như line item riêng mà chỉ được append vào field `notes`.

**Environment:**
- URL: `/angel/booking` → `/angel/booking/success`
- Role: Guest

**Steps to Reproduce:**
1. Bước 1: Chọn "Signature Gel Manicure 1" ($62)
2. Click "Add to Booking" trên Enhancement (Paraffin Wax, $15)
3. Footer hiển thị: "TOTAL ESTIMATE (1 ITEM) $77.00" ✅
4. Hoàn thành toàn bộ booking flow
5. Kiểm tra booking trong admin hoặc API

**Actual Result:**
- Success page: chỉ hiển thị "Signature Gel Manicure 1, $62" — Enhancement không hiển thị
- Admin API: `totalPrice: 6200` ($62 only)
- Enhancement được lưu ở `notes`: "Please use OPI gel, allergic to acrylic\n+ Paraffin Wax Treatment ($15, 15 mins)"

**Expected Result:**
- `totalPrice: 7700` ($77) — bao gồm cả enhancement
- Success page hiển thị cả service + enhancement
- Enhancement là line item riêng trong booking, không chỉ là text note

**Impact:**
- Doanh thu bị tính thiếu ($15 per enhancement booking)
- Staff và admin không biết enhancement có phí riêng (chỉ thấy text note)
- Báo cáo doanh thu sẽ bị sai

**Attachments:** `bk-005-success-page.png`

---

## TC-BK Summary — Pass/Fail Matrix

| TC ID | Title | Result | Bug |
|-------|-------|--------|-----|
| TC-BK-001 | Bước 1: Chọn dịch vụ | ✅ PASS | — |
| TC-BK-002 | Bước 2: Chọn kỹ thuật viên | ✅ PASS | — |
| TC-BK-003 | Bước 3: Chọn ngày và giờ | ✅ PASS | — |
| TC-BK-004 | Bước 4: Nhập thông tin khách | ⚠️ PARTIAL | Validation: general error only, no per-field errors (same pattern as BUG-SVC-001) |
| TC-BK-005 | Bước 6: Success page | ❌ FAIL | BUG-BK-001 (wrong time), BUG-BK-002 (enhancement not in total) |
| TC-BK-006 | E2E: Booking → Admin verification | ⚠️ PARTIAL | Booking appears in admin ✅; status CONFIRMED not PENDING (may be by design for Pay-in-salon); BUG-BK-002 |
| TC-BK-007 | Conflict detection | ⏭️ SKIP | No existing bookings to test overlap |
| TC-BK-008 | Manage Booking — lookup + cancel | ✅ PASS | BUG-BK-001 (time shows wrong in manage page, but cancel flow works) |

**Observations thêm:**

**TC-BK-001:**
- "Test Category QA" tab xuất hiện trong booking flow (tab rỗng, không có service) — side effect từ TC-SVC-006 testing (BUG-SVC-002: không xóa được category)
- Enhancement "Add a Paraffin Wax Treatment" là hardcoded card — không phải dynamic từ DB

**TC-BK-002:**
- 5 staff hiển thị trong booking artist page: Elena Rossi, Maya Chen, Jordan Smith, Sofia Blanco, Lila Vance
- "Jordan Smith" và "Lila Vance" không có trong admin staff list (seed/fixture data)
- Booking flow không filter staff theo service specialties (tất cả staff hiển thị bất kể service được chọn)

**TC-BK-003:**
- Past dates disabled ✅
- Sundays disabled ✅ (matches Settings opening hours)
- 16 slots (9:00 AM - 4:30 PM, 30-min intervals) cho ngày không có booking ✅

**TC-BK-004:**
- Steps 4 & 5 được gộp thành 1 trang duy nhất ("STEP 4 & 5 OF 6")
- Online payment unavailable — chỉ có "Pay in salon"
- New booking tự động status CONFIRMED (không phải PENDING như spec) — có thể là business rule cho Pay-in-salon

**TC-BK-008:**
- Tìm theo booking reference ✅
- Cancel dialog: native browser confirm "Are you sure you want to cancel this booking?" ✅
- Status cập nhật CANCELLED ngay lập tức (UI + API) ✅

**Summary:** 4 PASS, 1 FAIL, 2 PARTIAL, 1 SKIP  
**Critical bugs:** 1 (BUG-BK-001)  
**High bugs:** 1 (BUG-BK-002)
