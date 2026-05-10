# BUG REPORTS — TC-AUTH (Authentication)

**Module:** Authentication  
**Tested by:** QA Automation  
**Test date:** 2026-05-09  
**Environment:** Chrome / Windows 10 / `https://project.vinapage.com/angel` / Role: ADMIN  

---

## BUG-AUTH-001 — Login: Wrong password không hiện thông báo lỗi

**Bug ID:** BUG-AUTH-001  
**Test Case:** TC-AUTH-004  
**Severity:** High  
**Priority:** P1  
**Status:** Open  
**Summary:** Khi đăng nhập với mật khẩu sai, form chỉ hiển thị viền đỏ trên field password, không có text error message nào được hiển thị.

**Environment:**
- Browser: Chrome (Playwright)
- OS: Windows 10
- URL: `https://project.vinapage.com/angel/admin/login`
- Role: N/A (unauthenticated)

**Steps to Reproduce:**
1. Truy cập `/angel/admin/login`
2. Nhập email hợp lệ: `elena@angelnail.co.nz`
3. Nhập password sai: `wrongpassword`
4. Click nút "ĐĂNG NHẬP"

**Actual Result:**
- Field password hiển thị viền đỏ (pink/rose border)
- **Không có text error message** nào xuất hiện (không có "Invalid credentials", "Sai mật khẩu", hay bất kỳ thông báo văn bản nào)
- Form không có accessibility: screen reader không thể đọc lý do thất bại

**Expected Result:**
- Hiển thị error message rõ ràng, ví dụ: "Email hoặc mật khẩu không đúng" / "Invalid email or password"
- Message phải có ARIA role="alert" hoặc tương đương

**Attachments:** `auth-004-wrong-password.png`

---

## BUG-AUTH-002 — Login: Submit form trống không hiện validation errors

**Bug ID:** BUG-AUTH-002  
**Test Case:** TC-AUTH-006  
**Severity:** Medium  
**Priority:** P1  
**Status:** Open  
**Summary:** Khi click "ĐĂNG NHẬP" với tất cả fields để trống, không có validation error message nào xuất hiện trong giao diện.

**Environment:**
- Browser: Chrome (Playwright)
- OS: Windows 10
- URL: `https://project.vinapage.com/angel/admin/login`
- Role: N/A (unauthenticated)

**Steps to Reproduce:**
1. Truy cập `/angel/admin/login`
2. Không nhập gì vào bất kỳ field nào
3. Click nút "ĐĂNG NHẬP"

**Actual Result:**
- Không có error message nào hiển thị trong UI
- Page không thay đổi visual gì (không có viền đỏ, không có text lỗi)
- Hành động submit dường như bị chặn ngầm nhưng không thông báo tại sao

**Sub-case — Invalid email format:**
- Nhập email sai định dạng ("john@") → chỉ kích hoạt browser native HTML5 tooltip ("Please include an '@' in the email address")
- Không có custom UI validation message trong trang

**Expected Result:**
- Hiển thị validation errors dưới mỗi field: "Email là bắt buộc", "Mật khẩu là bắt buộc"
- Hoặc ít nhất: 1 error message tổng hợp ở đầu form

**Attachments:** `auth-006-empty-validation.png`

---

## BUG-AUTH-003 — Đăng xuất: Nút "Sign out" dẫn đến 405 Not Allowed, session không bị hủy

**Bug ID:** BUG-AUTH-003  
**Test Case:** TC-AUTH-008  
**Severity:** Critical  
**Priority:** P0  
**Status:** Open  
**Summary:** Click "Sign out" từ account menu chuyển đến trang xác nhận NextAuth, nhưng submit trang đó trả về 405 Not Allowed và session **không** bị hủy — user vẫn đang đăng nhập.

**Environment:**
- Browser: Chrome (Playwright)
- OS: Windows 10
- URL: `https://project.vinapage.com/angel/admin`
- Role: ADMIN (elena@angelnail.co.nz)

**Steps to Reproduce:**
1. Đăng nhập với ADMIN account
2. Click icon avatar (Account menu) ở góc trên phải
3. Click "Sign out" trong dropdown
4. Trang xác nhận NextAuth hiển thị tại `/angel/api/auth/signout?callbackUrl=/angel/admin/login`
5. Click nút "Sign out" trên trang xác nhận
6. Quan sát kết quả

**Actual Result:**
- Bước 5 → trình duyệt điều hướng đến `https://project.vinapage.com/api/auth/signout?callbackUrl=...` (thiếu `/angel` basePath prefix)
- Response: **405 Not Allowed**
- Session **KHÔNG** bị hủy
- Điều hướng đến `/angel/admin` → vẫn truy cập được (đã xác nhận bằng navigation test)

**Root Cause (nghi ngờ):**
NextAuth không được cấu hình đúng `basePath: '/angel'`. Form action trên trang xác nhận NextAuth submit đến `/api/auth/signout` thay vì `/angel/api/auth/signout`.

**Workaround (kỹ thuật):**
Gọi trực tiếp `POST /angel/api/auth/signout` với CSRF token → trả về 200 và redirect đúng đến `/angel/admin/login`. Session bị hủy thành công.

**Expected Result:**
- Click "Sign out" → session hủy → redirect đến `/angel/admin/login`
- Truy cập `/angel/admin` sau đó → redirect về login page

**Risk:** Đây là lỗ hổng bảo mật — user không thể đăng xuất đúng cách qua UI, session tồn tại vô thời hạn cho đến khi hết hạn.

**Attachments:** `auth-008-after-signout.png`

---

## BUG-AUTH-004 — Change Password: Không yêu cầu xác minh mật khẩu hiện tại (Security)

**Bug ID:** BUG-AUTH-004  
**Test Case:** TC-AUTH-009  
**Severity:** High  
**Priority:** P1  
**Status:** Open  
**Summary:** Form "Change password" chỉ có 2 fields: "New password" và "Confirm new password". Không có field "Current password". Bất kỳ ai có session hợp lệ đều có thể thay đổi mật khẩu mà không cần biết mật khẩu hiện tại.

**Environment:**
- Browser: Chrome (Playwright)
- OS: Windows 10
- URL: `https://project.vinapage.com/angel/admin` (modal)
- Role: ADMIN

**Steps to Reproduce:**
1. Đăng nhập với bất kỳ tài khoản nào
2. Click Account menu → "Change password"
3. Quan sát form: chỉ có "New password" và "Confirm new password"
4. Nhập mật khẩu mới (không cần biết mật khẩu cũ)
5. Click "Change password" → thành công

**Actual Result:**
- Mật khẩu thay đổi thành công mà không cần nhập mật khẩu hiện tại
- Đã xác nhận: thay đổi `admin123` → `admin123new` → thành công; login với `admin123new` → thành công

**Expected Result:**
- Form phải có field "Current password" (mật khẩu hiện tại)
- Backend phải xác minh current password trước khi cho phép thay đổi

**Security Impact:**
Nếu session bị chiếm (session hijacking, XSS, v.v.), kẻ tấn công có thể đổi mật khẩu và chiếm quyền kiểm soát tài khoản mà không cần biết mật khẩu gốc.

**Attachments:** `auth-009-success.png`

---

## TC-AUTH Summary — Pass/Fail Matrix

| TC ID | Title | Result | Bug |
|-------|-------|--------|-----|
| TC-AUTH-001 | Login ADMIN thành công | ✅ PASS | — |
| TC-AUTH-002 | Login MANAGER | ✅ PASS | — |
| TC-AUTH-003 | Login STAFF | ✅ PASS | — |
| TC-AUTH-004 | Wrong password → error message | ❌ FAIL | BUG-AUTH-001 |
| TC-AUTH-005 | Session persistence | ✅ PASS | — |
| TC-AUTH-006 | Validation: empty + invalid email | ❌ FAIL | BUG-AUTH-002 |
| TC-AUTH-007 | Session security (API 401) | ✅ PASS | — |
| TC-AUTH-008 | Đăng xuất | ❌ FAIL | BUG-AUTH-003 |
| TC-AUTH-009 | Change password | ⚠️ PASS w/ Security Issue | BUG-AUTH-004 |
| TC-AUTH-010 | RBAC matrix | ℹ️ INFO | No frontend route guard (by design or bug — needs clarification) |

**Summary:** 6 PASS, 3 FAIL, 1 Security Finding  
**Critical bugs:** 1 (BUG-AUTH-003)  
**High bugs:** 2 (BUG-AUTH-001, BUG-AUTH-004)  
**Medium bugs:** 1 (BUG-AUTH-002)
