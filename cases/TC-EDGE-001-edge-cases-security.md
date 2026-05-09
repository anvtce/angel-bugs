# TC-EDGE — Edge Cases, Security & Cross-cutting Concerns

**Module:** Cross-cutting / Non-functional  
**Standard:** IEEE 829 / ISTQB  
**Version:** 1.0 | **Updated:** 2026-05-09  

---

## Test Plan

### Scope
Kiểm thử các edge case khó, bảo mật, performance, responsive (mobile/tablet/desktop), đa ngôn ngữ VI/EN, và dữ liệu boundary.

---

## Section 1 — Security Testing

---

### TC-EDGE-001 — Bypass Auth bằng URL trực tiếp

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EDGE-001 |
| **Title** | Không bypass /admin bằng URL trực tiếp khi chưa đăng nhập |
| **Priority** | P0 — Critical |
| **Type** | Security |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Xóa tất cả cookie | Guest state |
| 2 | Truy cập trực tiếp `/angel/admin/appointments` | Redirect về `/angel/admin/login` |
| 3 | Truy cập `/angel/admin/reports` | Redirect về login |
| 4 | Truy cập `/angel/admin/audit-log` | Redirect về login |
| 5 | Manipulate cookie giả | Session validation từ chối |
| 6 | Dùng expired JWT | HTTP 401 |

---

### TC-EDGE-002 — XSS Prevention

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EDGE-002 |
| **Title** | Input sanitization — XSS không thực thi |
| **Priority** | P0 — Critical |
| **Type** | Security |

**Payloads để test:**
```
<script>alert('XSS')</script>
<img src=x onerror=alert(1)>
javascript:alert(1)
<svg onload=alert(1)>
```

**Test Cases:**

| Location | Payload | Expected |
|----------|---------|----------|
| Booking firstName | `<script>alert(1)</script>` | Stored as plain text, NOT executed |
| Booking notes | `<img src=x onerror=alert(1)>` | Sanitized or rejected |
| Admin service name | `<svg onload=alert(1)>` | Sanitized |
| Admin client note | `javascript:alert(1)` | Sanitized |
| Review reply | `<script>` | Sanitized |
| Search box | `<script>` | Not executed |

**Verify:** Console không có alert dialog, Browser console không có XSS error.

---

### TC-EDGE-003 — SQL Injection Prevention

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EDGE-003 |
| **Title** | API không bị SQL Injection |
| **Priority** | P0 — Critical |
| **Type** | Security |

**Payloads:**
```sql
' OR '1'='1
'; DROP TABLE bookings; --
1; SELECT * FROM users; --
```

**Test Cases:**

| Field | Payload | Expected |
|-------|---------|----------|
| Search client | `' OR '1'='1` | Empty result hoặc 400, KHÔNG dump toàn bộ DB |
| Login email | `admin'--` | 401 Unauthorized, NOT bypassed |
| Booking lookup email | `' UNION SELECT * FROM users --` | 400 Invalid email format |

---

### TC-EDGE-004 — Rate Limiting

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EDGE-004 |
| **Title** | Form public có rate limit — chặn spam booking |
| **Priority** | P1 — High |
| **Type** | Security / Performance |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Gửi 20 POST /api/bookings liên tục trong 10s | Các request đầu thành công |
| 2 | Request thứ 11+ | HTTP 429 Too Many Requests |
| 3 | Response có header | `Retry-After: XX` |
| 4 | Chờ cooldown | Requests tiếp theo được chấp nhận |
| 5 | Spam POST /api/auth/signin sai pass | Rate limit sau N lần thất bại |

---

### TC-EDGE-005 — CSRF Protection

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EDGE-005 |
| **Title** | CSRF token bảo vệ các form mutation |
| **Priority** | P1 — High |
| **Type** | Security |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Gửi POST /api/admin/bookings từ domain khác (cross-origin) | Bị chặn bởi CORS |
| 2 | POST không có CSRF token (nếu NextAuth dùng) | 403 Forbidden |
| 3 | Kiểm tra CORS headers | `Access-Control-Allow-Origin` chỉ whitelist domain |

---

## Section 2 — Performance & UX Testing

---

### TC-EDGE-010 — Page Load Performance

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EDGE-010 |
| **Title** | Trang load < 3 giây (LCP metric) |
| **Priority** | P1 — High |
| **Type** | Performance |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Mở Chrome DevTools → Lighthouse | Run Performance audit |
| 2 | Public homepage `/angel` | LCP < 3s, FID < 100ms |
| 3 | Admin Dashboard `/angel/admin` | Load < 3s |
| 4 | Booking step 1 `/angel/booking` | Interactive < 3s |
| 5 | Mở Network tab | Không có 404 asset, không có console error |
| 6 | Kiểm tra ảnh | Lazy loading hoạt động |

---

### TC-EDGE-011 — Empty State

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EDGE-011 |
| **Title** | Empty state hiển thị đúng khi không có dữ liệu |
| **Priority** | P2 — Medium |
| **Type** | UX |

**Test Cases:**

| Module | Empty Condition | Expected Empty State |
|--------|----------------|----------------------|
| Appointments | Không có booking trong tuần | "No appointments this week" |
| Clients | DB trống (fresh install) | "No clients yet" |
| Inventory | Không có sản phẩm | "No products in inventory" |
| Reviews | Chưa có review | "No reviews yet" |
| Reports | Range không có doanh thu | "No revenue in this period" |
| Booking availability | Ngày đóng cửa | "No available slots" |

---

### TC-EDGE-012 — API Error State

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EDGE-012 |
| **Title** | UI gracefully handle khi API trả lỗi 500 |
| **Priority** | P1 — High |
| **Type** | Error Handling |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | DevTools: Block request `/api/admin/stats` | Request fail |
| 2 | Reload Dashboard | Error state component, NOT blank white screen |
| 3 | Error message | Thân thiện: "Unable to load data. Please try again." |
| 4 | "Try Again" button | Retry request |
| 5 | Block booking availability API | Step 3 hiển thị error, không crash |
| 6 | Unblock | UI recover đúng |

---

## Section 3 — Responsive Testing

---

### TC-EDGE-020 — Mobile (≤ 768px)

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EDGE-020 |
| **Title** | Admin và Public site hoạt động đúng trên mobile |
| **Priority** | P1 — High |
| **Type** | Responsive / UI |

**Breakpoint:** 375px (iPhone 14), 390px (iPhone 15)

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Mở Admin Dashboard trên mobile | Responsive layout |
| 2 | Kiểm tra bottom nav mobile | Home, Book, +, Stock, Profile |
| 3 | Hamburger menu | Mở sidebar đầy đủ |
| 4 | Bảng dữ liệu (Appointments list) | Scroll ngang hoặc responsive columns |
| 5 | Form tạo booking | Fields không tràn ngang |
| 6 | Calendar Appointments | Có thể dùng được trên mobile |
| 7 | Luồng booking public | Toàn bộ 6 bước dùng được trên mobile |
| 8 | Button touch targets | Ít nhất 44x44px |

---

### TC-EDGE-021 — Tablet (769px - 1024px)

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EDGE-021 |
| **Title** | Layout tablet hiển thị đúng |
| **Priority** | P2 — Medium |
| **Type** | Responsive |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Admin trên iPad (768px) | Sidebar collapsed/hidden |
| 2 | 1024px | Sidebar có thể collapsed/expanded |
| 3 | Calendar không vỡ layout | Đủ không gian cho 7 cột ngày |
| 4 | Modal căn giữa | Không bị lệch |

---

### TC-EDGE-022 — Desktop (≥ 1280px)

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EDGE-022 |
| **Title** | Desktop layout chuẩn |
| **Priority** | P1 — High |
| **Type** | Responsive |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Admin (1280px) | Sidebar cố định bên trái |
| 2 | Content area | Sử dụng đủ không gian còn lại |
| 3 | Calendar 7 ngày | Hiển thị đủ tất cả ngày trong tuần |
| 4 | Grid 2 cột (Modules) | Hiển thị đúng |

---

## Section 4 — i18n / Localization

---

### TC-EDGE-030 — Toggle Ngôn ngữ VI/EN

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EDGE-030 |
| **Title** | Toggle VI/EN — toàn bộ label admin chuyển ngôn ngữ |
| **Priority** | P1 — High |
| **Type** | i18n |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Admin mặc định: EN | Labels tiếng Anh |
| 2 | Toggle VI | Tất cả labels chuyển tiếng Việt ngay lập tức |
| 3 | Kiểm tra coverage | Không có label nào còn hiển thị key (VD: "booking.title" thay vì "Lịch hẹn") |
| 4 | Toggle EN lại | Chuyển ngay |
| 5 | Reload | Ngôn ngữ được persist (localStorage hoặc cookie) |

---

### TC-EDGE-031 — Định dạng Ngày và Tiền tệ

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EDGE-031 |
| **Title** | Format ngày/tiền theo locale en-NZ |
| **Priority** | P1 — High |
| **Type** | i18n / Data Accuracy |

**Test Cases:**

| Data | Expected en-NZ Format |
|------|----------------------|
| Date: 2026-05-09 | "9 May 2026" hoặc "09/05/2026" |
| Time: 14:00 | "2:00 PM" |
| Amount: 5500 cents | "$55.00" |
| Amount: 50 cents | "$0.50" |
| Amount: 100000 cents | "$1,000.00" |

---

## Section 5 — Data Boundary & Business Rules

---

### TC-EDGE-040 — Ngày giờ Edge Cases

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EDGE-040 |
| **Title** | Timezone và date boundary cases |
| **Priority** | P0 — Critical |
| **Type** | Functional / Data |

**Test Cases:**

| Scenario | Input | Expected |
|----------|-------|----------|
| Book đúng midnight | 23:59 | Xử lý đúng, không bị ngày sai |
| Book ngày hôm nay giờ đã qua | 09:00 khi đang 14:00 | Slot 09:00 disabled |
| Chuyển mùa hè/mùa đông NZ | Daylight saving | Giờ mở cửa điều chỉnh đúng |
| Book cuối năm | 31/12 → qua 01/01 | Mã booking AN-XXXXXX năm mới đúng |
| Ngày lễ NZ (Waitangi Day) | Tuỳ cấu hình "Closed" | Không có slot |

---

### TC-EDGE-041 — Đồng thời (Race Condition)

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EDGE-041 |
| **Title** | Race condition — 2 users book cùng slot đồng thời |
| **Priority** | P0 — Critical |
| **Type** | Concurrency |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Tab A: Chuẩn bị book Mai 10:00 ngày mai | Form ready |
| 2 | Tab B: Chuẩn bị book Mai 10:00 ngày mai | Form ready |
| 3 | Tab A submit (t=0ms) | HTTP 201 — booking thành công |
| 4 | Tab B submit (t=50ms) | HTTP 409 Conflict — slot đã bị lấy |
| 5 | Kiểm tra DB | Chỉ có 1 booking cho slot đó |

---

### TC-EDGE-042 — Chuỗi đặc biệt trong input

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-EDGE-042 |
| **Title** | Handle special characters trong input text |
| **Priority** | P1 — High |
| **Type** | Data Boundary |

**Test Cases:**

| Input | Field | Expected |
|-------|-------|----------|
| `Nguyễn Thị Bảo` | Client name | Lưu và hiển thị đúng UTF-8 |
| `O'Brien` | Client name | Lưu đúng apostrophe |
| `München` | Client name | Lưu đúng umlaut |
| 500 ký tự | Notes | Chấp nhận hoặc trim + notify |
| Empty string "" | Required field | Validation error |
| " " (spaces only) | Required field | Treated as empty → validation error |
| Số 0 | Price | Validation error "Must be > 0" |
| Emoji trong notes 😊 | Notes | Lưu và hiển thị đúng |
