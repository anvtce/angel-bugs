# BUG REPORTS — TC-SVC (Services)

**Module:** Services Management  
**Tested by:** QA Automation  
**Test date:** 2026-05-09  
**Environment:** Chrome / Windows 10 / `https://project.vinapage.com/angel/admin/services` / Role: ADMIN  

---

## BUG-SVC-001 — Form tạo/sửa dịch vụ không hiển thị validation error messages

**Bug ID:** BUG-SVC-001  
**Test Case:** TC-SVC-002  
**Severity:** Medium  
**Priority:** P1  
**Status:** Open  
**Summary:** Khi submit form "Thêm dịch vụ" hoặc "Sửa dịch vụ" với các trường bắt buộc để trống, form chặn submit nhưng không hiển thị bất kỳ error message nào. Người dùng không biết field nào bị lỗi và lý do tại sao.

**Environment:**
- Browser: Chrome (Playwright)
- OS: Windows 10
- URL: `https://project.vinapage.com/angel/admin/services`
- Role: ADMIN

**Steps to Reproduce:**
1. Vào `/angel/admin/services`
2. Click "Thêm dịch vụ" trong bất kỳ category section nào
3. Bỏ trống tất cả fields (TÊN, MÔ TẢ, THỜI GIAN, GIÁ)
4. Click nút "Lưu" / "Thêm"
5. Quan sát phản hồi của form

**Actual Result:**
- Form không submit (blocked) ✅
- Không có validation error message nào hiển thị ❌
- Không có đường viền đỏ hay highlight field lỗi ❌
- UI không thay đổi — người dùng không biết vì sao không submit được

**Sub-case — Category modal:**
- Click "Thêm danh mục" → modal "Danh mục mới" mở
- Không nhập tên, click "Tạo mới"
- Kết quả: modal vẫn mở, không submit, nhưng KHÔNG có error message

**Expected Result:**
- Hiển thị inline validation errors dưới mỗi field bắt buộc:
  - "Tên dịch vụ là bắt buộc"
  - "Danh mục là bắt buộc"
  - "Thời gian là bắt buộc"
  - "Giá là bắt buộc"
- Hoặc ít nhất: highlight field lỗi với border đỏ

**Note:** Đây là pattern lặp lại trong nhiều module. Xem thêm: BUG-AUTH-002 (login form), BUG-APT (tương tự trong appointment form).

**Attachments:** `svc-006-empty-validation.png`

---

## BUG-SVC-002 — Không có chức năng đổi tên hoặc xóa Category

**Bug ID:** BUG-SVC-002  
**Test Case:** TC-SVC-006 (Steps 5, 7, 8)  
**Severity:** Medium  
**Priority:** P2  
**Status:** Open  
**Summary:** Sau khi tạo category, admin không thể đổi tên hoặc xóa category từ UI. Header của mỗi category section chỉ có nút "Thêm dịch vụ" — không có nút Edit, Rename, hay Delete cho category.

**Environment:**
- Browser: Chrome (Playwright)
- OS: Windows 10
- URL: `https://project.vinapage.com/angel/admin/services`
- Role: ADMIN

**Steps to Reproduce:**
1. Tạo category mới tên "Test Category QA" (thành công)
2. Quan sát header của category section vừa tạo
3. Tìm nút Rename/Edit/Delete cho category

**Actual Result:**
- Category header chỉ có 1 button: "Thêm dịch vụ"
- Không có nút Rename, Edit, hay Delete cho category
- Không có context menu hay hover action

**Expected Result (theo TC-SVC-006):**
- Có thể đổi tên category (step 5: "Extensions" → "Nail Extensions")
- Có thể xóa category rỗng (step 7)
- Khi xóa category có dịch vụ: cảnh báo reassign hoặc từ chối (step 8)

**Impact:**
- Admin không thể sửa tên category đã tạo sai
- Category rỗng (như "Test Category QA") không thể xóa → tích lũy theo thời gian
- CRUD category chỉ có C (Create), thiếu R/U/D cho category

**Attachments:** `svc-006-new-category-visible.png`

---

## TC-SVC Summary — Pass/Fail Matrix

| TC ID | Title | Result | Bug |
|-------|-------|--------|-----|
| TC-SVC-001 | Tạo dịch vụ mới | ✅ PASS | — |
| TC-SVC-002 | Validation form tạo/sửa dịch vụ | ❌ FAIL | BUG-SVC-001 |
| TC-SVC-003 | Sửa dịch vụ — pre-fill + save | ✅ PASS | — |
| TC-SVC-004 | Active/Inactive toggle → public site | ✅ PASS | — |
| TC-SVC-005 | Giá cents → dollar hiển thị đúng | ✅ PASS | — |
| TC-SVC-006 | Quản lý Categories | ⚠️ PARTIAL | BUG-SVC-002 (add ✅; rename/delete ❌) |
| TC-SVC-007 | Xóa dịch vụ + confirmation dialog | ✅ PASS | — |

**Observations thêm:**
- Delete confirmation dùng native browser `confirm()` dialog — consistent với cancel booking; wording "Delete this service?" (không phải "Are you sure? This cannot be undone." như spec)
- NHÃN GIÁ là free-text field (manual label) — không auto-calculate từ GIÁ (CENTS); nếu nhập cents 8500 nhưng label "$65" thì hiển thị sai

**Summary:** 5 PASS, 1 FAIL, 1 PARTIAL  
**Medium bugs:** 2 (BUG-SVC-001, BUG-SVC-002)
