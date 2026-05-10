# BUG REPORTS — TC-MGR (Manager Role)

**Module:** Admin Panel — MANAGER role (Sofia Blanco, `manager@angelnail.co.nz`)  
**Tested by:** QA Automation  
**Test date:** 2026-05-10  
**Environment:** Chrome / Windows 10 / `https://project.vinapage.com/angel/admin` / Role: MANAGER  
**Spec reference:** MANAGER = "Vận hành, không có Settings/Audit" (Operations only, no Settings/Audit Log access)

---

## BUG-MGR-RBAC-001 — MANAGER có thể truy cập trang Settings (không bị chặn)

**Bug ID:** BUG-MGR-RBAC-001  
**Severity:** Critical  
**Priority:** P0  
**Status:** Open  
**Summary:** MANAGER (Sofia Blanco) truy cập được `/angel/admin/settings` không bị redirect, thấy đầy đủ form Business Info, Opening Hours, Booking Rules, Integrations, Email Templates, Team — và có thể Save thành công (POST /api/admin/config → 200).

**Environment:**
- URL: `/angel/admin/settings`
- Role: MANAGER

**Steps to Reproduce:**
1. Đăng nhập với tài khoản MANAGER (`manager@angelnail.co.nz / manager123`)
2. Điều hướng đến `/angel/admin/settings`
3. Quan sát nội dung trang
4. Click "Save business info"

**Actual Result:**
- Trang Settings load hoàn toàn, không có redirect
- Thấy tất cả tab: Business info, Opening hours, Booking rules, Integrations, Email templates, Team
- "Save business info" → `POST /api/admin/config` → **200 OK** — lưu thành công
- `GET /api/admin/config` → **200** — trả về toàn bộ config bao gồm `DEEPSEEK_API_KEY`, `RESEND_API_KEY`

**Expected Result:**
- MANAGER bị redirect về `/angel/admin` hoặc nhận 403 khi truy cập `/angel/admin/settings`
- `GET /api/admin/config` → 403 Forbidden cho MANAGER
- `POST /api/admin/config` → 403 Forbidden cho MANAGER

**Root Cause Analysis:**
- Không có middleware route guard tại frontend (Next.js middleware không kiểm tra role)
- API `GET /api/admin/config` và `POST /api/admin/config` không enforce role ADMIN
- Tương đương BUG-RBAC-001 từ session STAFF nhưng nghiêm trọng hơn vì API còn hoạt động

**Impact:** CRITICAL
- MANAGER có thể đọc và ghi **API keys nhạy cảm** (DeepSeek, Resend)
- MANAGER có thể thay đổi cấu hình hệ thống (booking rules, opening hours, email templates)
- Vi phạm nguyên tắc Least Privilege

**API Evidence:**
```
GET  /angel/api/admin/config → 200 (MANAGER)
     Response: {"DEEPSEEK_API_KEY":"sk-d756c7...","RESEND_API_KEY":"..."}
POST /angel/api/admin/config → 200 (MANAGER) — ghi thành công
GET  /angel/api/admin/audit-log → 403 (MANAGER) ✅ — đây là đúng
```

**Attachments:** `mgr-settings-integrations.png`

---

## BUG-MGR-RBAC-002 — Audit Log UI accessible nhưng API blocked (inconsistency)

**Bug ID:** BUG-MGR-RBAC-002  
**Severity:** High  
**Priority:** P1  
**Status:** Open  
**Summary:** MANAGER có thể truy cập trang `/angel/admin/audit-log` (không redirect), thấy đầy đủ UI bao gồm filter entity, filter action, filter user email. Tuy nhiên bảng log trống vì `GET /api/admin/audit-log` → 403. Tạo ra UX confusing và vi phạm spec.

**Environment:**
- URL: `/angel/admin/audit-log`
- Role: MANAGER

**Steps to Reproduce:**
1. Đăng nhập MANAGER
2. Truy cập `/angel/admin/audit-log`

**Actual Result:**
- Trang render: heading "Audit Log", filters (Entity, Action, User email), bảng rỗng, pagination "Page 1 / 1"
- API: `GET /api/admin/audit-log` → 403 Forbidden
- Sidebar vẫn hiển thị "Nhật ký hệ thống" link cho MANAGER

**Expected Result:**
- Redirect về `/angel/admin` hoặc hiển thị "Không có quyền truy cập"
- Sidebar ẩn "Nhật ký hệ thống" với MANAGER role

**Impact:** High — UX confusing, MANAGER thấy trang trống không có thông báo lỗi rõ ràng; sidebar hiển thị link sai

---

## BUG-MGR-APT-001 — Service dropdown trong Create/Edit Appointment hiển thị "— ( min)"

**Bug ID:** BUG-MGR-APT-001  
**Severity:** Critical  
**Priority:** P0  
**Status:** Open  
**Summary:** Khi MANAGER mở form Tạo lịch hẹn hoặc Edit lịch hẹn, dropdown chọn dịch vụ hiển thị tất cả options là `— ( min)` thay vì tên dịch vụ thực. Button "Save changes" / "Tạo mới" bị disabled do service value rỗng → không thể tạo hoặc sửa lịch hẹn qua UI.

**Environment:**
- URL: `/angel/admin/appointments`
- Role: MANAGER (cũng reproduce được với ADMIN)

**Steps to Reproduce:**
1. Đăng nhập MANAGER
2. Truy cập Lịch hẹn → click "Tạo lịch hẹn"
3. Quan sát dropdown "Chọn dịch vụ *"
4. Hoặc click "Edit" trên một lịch hẹn có sẵn

**Actual Result:**
```
Dropdown options:
  - "Chọn dịch vụ *"
  - "— ( min)"
  - "— ( min)"
  - "— ( min)"
  - "— ( min)"
  ...
```
- Service value = `""` (empty)
- Button "Tạo mới" / "Save changes" = `disabled`

**Expected Result:**
- Dropdown hiển thị: "Signature Gel Manicure 1 (45 min)", "Classic French Tip (60 min)", ...
- Button enabled khi điền đầy đủ thông tin

**Root Cause Analysis:**
- API `GET /api/admin/services` trả về đúng dữ liệu (6 services với name, duration)
- Component load services nhưng không map đúng field (có thể field `name` vs `title` mismatch)
- Hoặc component dùng sai API endpoint để fetch services cho dropdown

**Impact:** CRITICAL — Không thể tạo hoặc sửa lịch hẹn qua admin UI. Core CRUD bị broken hoàn toàn.

**API Evidence:**
```json
GET /api/admin/services → 200
[{"id":"cmn70drz90000kwve77j9wsr7","name":"Manicure",...},...]

Appointment form dropdown:
<select><option>— ( min)</option>...</select>  // name not rendered
```

---

## BUG-MGR-APT-002 — POST /api/admin/bookings trả về 404 "Service not found"

**Bug ID:** BUG-MGR-APT-002  
**Severity:** High  
**Priority:** P1  
**Status:** Open  
**Summary:** API `POST /angel/api/admin/bookings` trả về 404 với lỗi "Service not found" ngay cả khi dùng service ID hợp lệ từ `GET /angel/api/admin/services`. Không thể tạo booking qua admin API.

**Environment:**
- URL: `POST /angel/api/admin/bookings`
- Role: MANAGER (cũng reproduce với ADMIN, STAFF)

**Steps to Reproduce:**
1. GET /angel/api/admin/services → lấy ID dịch vụ đầu tiên: `cmn70drz90000kwve77j9wsr7`
2. POST /angel/api/admin/bookings với body:
```json
{
  "firstName": "Test", "lastName": "User",
  "email": "test@qa.test",
  "serviceId": "cmn70drz90000kwve77j9wsr7",
  "date": "2026-05-15", "time": "10:00"
}
```

**Actual Result:**
```json
HTTP 404 {"error": "Service not found"}
```

**Expected Result:**
```json
HTTP 201 {"id": "...", "reference": "AN-...", ...}
```

**Root Cause Analysis:**
- Admin services endpoint và admin bookings endpoint sử dụng khác nhau để lookup service
- Có thể `POST /api/admin/bookings` lookup service theo `slug` thay vì `id`
- Hoặc admin bookings API dùng bảng service khác với admin services API

**Impact:** High — Admin không thể tạo booking mới từ admin panel qua API. Phải dùng public booking flow.

---

## BUG-MGR-APT-003 — URL query `?status=PENDING` không được apply vào filter

**Bug ID:** BUG-MGR-APT-003  
**Severity:** Medium  
**Priority:** P2  
**Status:** Open  
**Summary:** Dashboard link "Pending bookings 1" trỏ đến `/angel/admin/appointments?status=PENDING`. Khi navigate đến URL này, filter status không được apply — trang hiển thị tất cả booking của ngày được chọn bất kể status.

**Environment:**
- URL: `/angel/admin/appointments?status=PENDING`
- Role: MANAGER

**Steps to Reproduce:**
1. Từ Dashboard, click "Pending bookings 1"
2. (Do SPA navigation bug, navigate trực tiếp đến URL `?status=PENDING`)
3. Chọn ngày 2026-05-13

**Actual Result:**
- Hiển thị booking có status CONFIRMED (không phải PENDING)
- Status tab "CHỜ XỬ LÝ" = 0, "XÁC NHẬN" = 1

**Expected Result:**
- Chỉ hiển thị PENDING bookings
- URL parameter `?status=PENDING` được dùng để pre-filter combobox

---

## BUG-MGR-DASH-001 — Dashboard "Pending bookings" link không navigate khi click

**Bug ID:** BUG-MGR-DASH-001  
**Severity:** Medium  
**Priority:** P2  
**Status:** Open  
**Summary:** Trên Dashboard, link "pending Pending bookings 1" có `href=/angel/admin/appointments?status=PENDING` nhưng khi click vẫn ở nguyên trang Dashboard (không navigate).

**Environment:**
- URL: `/angel/admin`
- Role: MANAGER

**Steps to Reproduce:**
1. Vào Dashboard
2. Trong ô "Pending actions", click "Pending bookings 1"

**Actual Result:**
- URL không thay đổi — vẫn là `/angel/admin`
- Không navigate sang appointments page

**Expected Result:**
- Navigate đến `/angel/admin/appointments?status=PENDING`

**Root Cause Analysis:**
- Link element render đúng href nhưng có thể bị chặn bởi event handler của parent component
- Hoặc Next.js `<Link>` component có điều kiện render sai

---

## BUG-MGR-DASH-002 — Revenue chart "No revenue this week" trong khi KPI hiển thị $3,140

**Bug ID:** BUG-MGR-DASH-002  
**Severity:** Medium  
**Priority:** P2  
**Status:** Open  
**Summary:** Dashboard KPI card hiển thị "Doanh thu $3,140.00" nhưng Revenue chart (last 7 days) hiển thị "No revenue this week". Hai giá trị mâu thuẫn nhau.

**Environment:**
- URL: `/angel/admin`
- Role: MANAGER (cũng reproduce với ADMIN)

**Steps to Reproduce:**
1. Đăng nhập và vào Dashboard
2. Quan sát KPI card "Doanh thu" và chart "Revenue — last 7 days"

**Actual Result:**
- KPI: `$3,140.00`
- Chart: `"No revenue this week"`

**Expected Result:**
- Chart phải hiển thị revenue data khớp với KPI
- Hoặc cả hai đều hiển thị "No data"

**Impact:** Medium — Admin tin vào KPI nhưng chart cho thấy ngược lại → không tin tưởng được báo cáo

---

## BUG-MGR-SYS-001 — Duplicate API calls (3x) khi Save/Complete/Cancel

**Bug ID:** BUG-MGR-SYS-001  
**Severity:** High  
**Priority:** P1  
**Status:** Open  
**Summary:** Khi MANAGER thực hiện các hành động mutation (PUT service, PUT staff, PUT booking status), API call được gửi **3 lần** thay vì 1 lần. Tương tự, GET refresh cũng gọi 3 lần sau mỗi mutation.

**Environment:**
- URL: `/angel/admin/services`, `/angel/admin/staff`, `/angel/admin/appointments`
- Role: MANAGER (cũng reproduce với ADMIN)

**Steps to Reproduce:**
1. Mở edit form bất kỳ (service, staff, appointment)
2. Click Save / Complete / Cancel
3. Observe network tab

**Actual Result:**
```
PUT /angel/api/admin/services/seed-signature-gel-manicure  → 200 (call 1)
PUT /angel/api/admin/services/seed-signature-gel-manicure  → 200 (call 2, duplicate)
PUT /angel/api/admin/services/seed-signature-gel-manicure  → 200 (call 3, duplicate)
GET /angel/api/admin/services → 200 (refresh 1)
GET /angel/api/admin/services → 200 (refresh 2)
GET /angel/api/admin/services → 200 (refresh 3)
```

**Expected Result:**
- Mỗi action chỉ gọi API đúng 1 lần

**Root Cause Analysis:**
- React StrictMode trong development có thể gây double-invoke effect
- Hoặc event handler bị đăng ký nhiều lần (missing cleanup trong useEffect)
- Cần kiểm tra production build

**Impact:** High
- Gây dư thừa DB writes (idempotent hiện tại nhưng không đảm bảo trong tương lai)
- Performance overhead
- Potential race condition với concurrent requests

---

## BUG-MGR-STF-001 — Search nhân viên không filter theo query

**Bug ID:** BUG-MGR-STF-001  
**Severity:** Low  
**Priority:** P3  
**Status:** Open  
**Summary:** `GET /angel/api/admin/staff?search=Elena` trả về tất cả 7 nhân viên thay vì chỉ kết quả khớp với "Elena".

**Environment:**
- URL: `GET /angel/api/admin/staff?search=<term>`
- Role: MANAGER

**Steps to Reproduce:**
1. GET /angel/api/admin/staff?search=Elena

**Actual Result:**
```json
// 7 records returned (all staff)
```

**Expected Result:**
```json
// 1 record: Elena Rossi
```

**Root Cause Analysis:**
- API handler bỏ qua query parameter `search` — không implement filter logic

---

## BUG-MGR-SYS-002 — Payroll và Closing API chưa được implement (404)

**Bug ID:** BUG-MGR-SYS-002  
**Severity:** High  
**Priority:** P1  
**Status:** Open  
**Summary:** `GET /angel/api/admin/payroll` và `GET /angel/api/admin/closing` đều trả về 404. Trang Payroll và Closing trong admin không có dữ liệu thực. Đây là tính năng chưa hoàn chỉnh.

**Affected endpoints:**
- `GET /angel/api/admin/payroll` → 404
- `GET /angel/api/admin/closing` → 404
- `GET /angel/api/admin/reports/staff` → 404

**Expected Result:**
- 200 với dữ liệu payroll, closing summary, staff performance

**Impact:** High — MANAGER không thể xem thông tin lương/hoa hồng và kết ca — chức năng core của operations.

---

## MANAGER API Access Matrix

| Endpoint | Method | Expected (spec) | Actual | Result |
|----------|--------|-----------------|--------|--------|
| /api/admin/config | GET | 403 (ADMIN-only) | **200** | ❌ FAIL |
| /api/admin/config | POST | 403 (ADMIN-only) | **200** | ❌ FAIL |
| /api/admin/audit-log | GET | 403 | 403 | ✅ PASS |
| /api/admin/bookings | GET | 200 | 200 | ✅ PASS |
| /api/admin/bookings/:id | PATCH/PUT | 200 | 200 | ✅ PASS |
| /api/admin/services | GET | 200 | 200 | ✅ PASS |
| /api/admin/services/:id | PUT | 200 | 200 | ✅ PASS |
| /api/admin/staff | GET | 200 | 200 | ✅ PASS |
| /api/admin/staff/:id | PUT | 200 | 200 | ✅ PASS |
| /api/admin/staff | POST | 200 | 201 | ✅ PASS |
| /api/admin/clients | GET | 200 | 200 | ✅ PASS |
| /api/admin/clients | POST | 200 | 201 | ✅ PASS |
| /api/admin/inventory | GET | 200 | 200 | ✅ PASS |
| /api/admin/payments | GET | 200 | 200 | ✅ PASS |
| /api/admin/gift-cards | GET | 200 | 200 | ✅ PASS |
| /api/admin/expenses | GET | 200 | 200 | ✅ PASS |
| /api/admin/expenses | POST | 200 | 201 | ✅ PASS |
| /api/admin/reports/revenue | GET | 200 | 200 | ✅ PASS |
| /api/admin/reports/staff | GET | 200 | **404** | ⚠️ NOT IMPL |
| /api/admin/payroll | GET | 200 | **404** | ⚠️ NOT IMPL |
| /api/admin/closing | GET | 200 | **404** | ⚠️ NOT IMPL |

---

## TC-MGR Summary — Pass/Fail Matrix

| TC ID | Module | Title | Result | Bug |
|-------|--------|-------|--------|-----|
| TC-AUTH-MGR-001 | Auth | Login MANAGER | ✅ PASS | — |
| TC-AUTH-MGR-002 | Auth | Session / role check | ✅ PASS | — |
| TC-DASH-MGR-001 | Dashboard | KPI cards (bookings, revenue, clients) | ✅ PASS | — |
| TC-DASH-MGR-002 | Dashboard | Revenue chart | ❌ FAIL | BUG-MGR-DASH-002 |
| TC-DASH-MGR-003 | Dashboard | Pending actions navigation | ❌ FAIL | BUG-MGR-DASH-001 |
| TC-DASH-MGR-004 | Dashboard | Upcoming appointments list | ✅ PASS | — |
| TC-APT-MGR-001 | Appointments | List + date filter | ✅ PASS | — |
| TC-APT-MGR-002 | Appointments | Create new (UI) | ❌ FAIL | BUG-MGR-APT-001, BUG-MGR-APT-002 |
| TC-APT-MGR-003 | Appointments | Edit appointment (UI) | ⚠️ PARTIAL | BUG-MGR-APT-001 (service dropdown) |
| TC-APT-MGR-004 | Appointments | Complete appointment | ✅ PASS | BUG-MGR-SYS-001 (3x calls) |
| TC-APT-MGR-005 | Appointments | Cancel appointment | ✅ PASS | — |
| TC-APT-MGR-006 | Appointments | Status filter (URL param) | ❌ FAIL | BUG-MGR-APT-003 |
| TC-SVC-MGR-001 | Services | List services + categories | ✅ PASS | — |
| TC-SVC-MGR-002 | Services | Edit service | ✅ PASS | BUG-MGR-SYS-001 (3x calls) |
| TC-SVC-MGR-003 | Services | Add service | ⚠️ PARTIAL | Modal opens ✅; Save blocked by React state |
| TC-SVC-MGR-004 | Services | Delete service | ✅ PASS | Native confirm dialog |
| TC-SVC-MGR-005 | Services | Add category | ✅ PASS | Modal opens |
| TC-STF-MGR-001 | Staff | List staff | ✅ PASS | 7 staff |
| TC-STF-MGR-002 | Staff | Edit staff | ✅ PASS | PUT 200 |
| TC-STF-MGR-003 | Staff | Add staff | ⚠️ PARTIAL | Modal opens ✅ |
| TC-STF-MGR-004 | Staff | Search staff | ❌ FAIL | BUG-MGR-STF-001 |
| TC-OPS-MGR-001 | Clients | List + Add | ✅ PASS | 31 clients, PII visible |
| TC-OPS-MGR-002 | Inventory | View inventory | ✅ PASS | 4 items, low stock 1 |
| TC-OPS-MGR-003 | Payments | View payments | ✅ PASS | GET 200 |
| TC-OPS-MGR-004 | Gift Cards | View gift cards | ✅ PASS | 6 cards |
| TC-OPS-MGR-005 | Expenses | View + create expense | ✅ PASS | POST 201 |
| TC-OPS-MGR-006 | Reports/Revenue | View revenue report | ✅ PASS | GET 200 |
| TC-OPS-MGR-007 | Payroll | View payroll | ❌ FAIL | BUG-MGR-SYS-002 (404) |
| TC-OPS-MGR-008 | Closing | View closing | ❌ FAIL | BUG-MGR-SYS-002 (404) |
| TC-SET-MGR-001 | Settings | MANAGER blocked from Settings | ❌ FAIL | BUG-MGR-RBAC-001 |
| TC-SET-MGR-002 | Settings | Config API access blocked | ❌ FAIL | BUG-MGR-RBAC-001 |
| TC-RBAC-MGR-001 | RBAC | Audit Log blocked (API) | ✅ PASS | — |
| TC-RBAC-MGR-002 | RBAC | Audit Log blocked (UI) | ❌ FAIL | BUG-MGR-RBAC-002 |

**Summary:** 19 PASS, 9 FAIL, 3 PARTIAL  
**Critical bugs:** 2 (BUG-MGR-RBAC-001, BUG-MGR-APT-001)  
**High bugs:** 4 (BUG-MGR-RBAC-002, BUG-MGR-APT-002, BUG-MGR-SYS-001, BUG-MGR-SYS-002)  
**Medium bugs:** 3 (BUG-MGR-APT-003, BUG-MGR-DASH-001, BUG-MGR-DASH-002)  
**Low bugs:** 1 (BUG-MGR-STF-001)

---

## Test Data Cleanup Required

| Type | ID | Description | Action |
|------|----|-------------|--------|
| Staff | `cmoz96jij000x2dnt9djf2p2o` | Name: "Test", created during RBAC test | DELETE |
| Expense | `cmoz96jkr000y2dntmxe6dl7a` | RBAC test expense, $50 | DELETE |
| Client | `cmoz8mwhh000s2dntpj45ba95` | "MGR TestCreate" (mgr-test@qa.com) | DELETE |
| Staff | `cmoz7ch33000o2dntsjev6cc8` | Created in STAFF session | DELETE |
| Client | `cmoz7ch66000p2dntw0t7gtr8` | Created in STAFF session | DELETE |
