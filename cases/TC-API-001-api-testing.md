# TC-API — API Endpoint Testing

**Module:** Backend API  
**Base URL:** `https://project.vinapage.com/angel`  
**Standard:** IEEE 829 / ISTQB  
**Tool:** Postman / Insomnia  
**Version:** 1.0 | **Updated:** 2026-05-09  

---

## Test Plan

### Scope
Kiểm thử API backend — tất cả endpoints với prefix `/angel`. Bao gồm: Public Booking API, Gift Card API, Auth API, Admin API.

### Test Data Setup
```json
// Auth header (sau khi login):
// Cookie: next-auth.session-token=<token>
// Hoặc Authorization: Bearer <jwt>

// Admin credentials:
// POST /api/auth/signin
// { "email": "elena@angelnail.co.nz", "password": "admin123" }
```

---

## Test Cases — Public Booking API

---

### TC-API-001 — POST /api/bookings — Tạo booking thành công

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-API-001 |
| **Title** | POST /api/bookings — 201 Created |
| **Priority** | P0 — Critical |
| **Type** | API / Functional |

**Request:**
```json
POST /api/bookings
Content-Type: application/json

{
  "serviceId": 1,
  "staffId": 2,
  "date": "2026-05-15",
  "time": "10:00",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@test.com",
  "phone": "+64210001234",
  "notes": "Test booking"
}
```

**Expected Response:**
```json
HTTP 201 Created
{
  "success": true,
  "booking": {
    "id": <number>,
    "reference": "AN-260515XXXX",
    "status": "PENDING",
    "serviceId": 1,
    "staffId": 2,
    "date": "2026-05-15",
    "time": "10:00",
    "clientName": "John Doe",
    "email": "john.doe@test.com"
  }
}
```

**Verify:**
- HTTP Status = 201
- `reference` matches format `AN-\d{10}`
- `status` = "PENDING"
- Booking xuất hiện trong Admin Appointments

---

### TC-API-002 — POST /api/bookings — Trùng giờ → 409 Conflict

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-API-002 |
| **Title** | POST /api/bookings — 409 khi trùng giờ cùng staff |
| **Priority** | P0 — Critical |
| **Type** | API / Negative |
| **Preconditions** | staffId=2 đã có booking ngày 2026-05-15, 10:00 |

**Request:** Tương tự TC-API-001 nhưng cùng staffId + date + time

**Expected:**
```json
HTTP 409 Conflict
{
  "error": "TIME_SLOT_CONFLICT",
  "message": "This time slot is already booked"
}
```

---

### TC-API-003 — POST /api/bookings/availability — Lấy slots trống

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-API-003 |
| **Title** | POST /api/bookings/availability trả đúng danh sách slot |
| **Priority** | P0 — Critical |
| **Type** | API / Functional |

**Request:**
```json
POST /api/bookings/availability
{
  "serviceId": 1,
  "staffId": 2,
  "date": "2026-05-15"
}
```

**Expected:**
```json
HTTP 200
{
  "date": "2026-05-15",
  "slots": [
    { "time": "09:00", "available": true },
    { "time": "09:30", "available": true },
    { "time": "10:00", "available": false },  // đã book
    { "time": "10:30", "available": false },  // overlap
    { "time": "11:00", "available": true }
  ]
}
```

**Verify:**
- Slots trong giờ mở cửa
- Slots đã book = false
- Slots overlap với booking duration = false

---

### TC-API-004 — POST /api/bookings/lookup — Tra cứu

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-API-004 |
| **Title** | POST /api/bookings/lookup tìm booking theo email/phone |
| **Priority** | P1 — High |
| **Type** | API / Functional |

**Request:**
```json
POST /api/bookings/lookup
{
  "email": "john.doe@test.com",
  "phone": "+64210001234"
}
```

**Expected:** HTTP 200, array bookings của John Doe

**Negative case — không tìm thấy:**
```json
HTTP 200
{ "bookings": [] }
```
Không được trả 404 (resource not found) cho lookup.

---

### TC-API-005 — PATCH /api/bookings/[reference] — Hủy

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-API-005 |
| **Title** | PATCH /api/bookings/[ref] — đổi status CANCELLED |
| **Priority** | P0 — Critical |
| **Type** | API / Functional |

**Request:**
```json
PATCH /api/bookings/AN-260515XXXX
{
  "status": "CANCELLED"
}
```

**Expected:** HTTP 200, booking status = CANCELLED

**Verify booking vẫn tồn tại:** `GET /api/bookings/AN-260515XXXX` → HTTP 200 (không phải 404)

---

## Test Cases — Auth API

---

### TC-API-006 — POST /api/auth/signin

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-API-006 |
| **Title** | Auth signin — thành công và thất bại |
| **Priority** | P0 — Critical |
| **Type** | API / Security |

**Happy Path:**
```json
POST /api/auth/signin
{ "email": "elena@angelnail.co.nz", "password": "admin123" }
→ HTTP 200, session cookie set
```

**Wrong password:**
```json
POST /api/auth/signin
{ "email": "elena@angelnail.co.nz", "password": "wrong" }
→ HTTP 401 Unauthorized
```

**Missing fields:**
```json
POST /api/auth/signin
{}
→ HTTP 400 Bad Request
```

---

## Test Cases — Admin API

---

### TC-API-007 — GET /api/admin/stats — Unauthorized

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-API-007 |
| **Title** | Admin API trả 401 khi không có session |
| **Priority** | P0 — Critical |
| **Type** | API / Security |

**Request (no auth):**
```
GET /api/admin/stats
(no cookie)
```

**Expected:** HTTP 401 Unauthorized
```json
{ "error": "Unauthorized" }
```

---

### TC-API-008 — Role-based API — STAFF → 403

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-API-008 |
| **Title** | Admin API trả 403 khi sai role |
| **Priority** | P0 — Critical |
| **Type** | API / Security |
| **Preconditions** | Có session cookie của STAFF |

**Test Cases:**

| Endpoint | STAFF Expected | MANAGER Expected | ADMIN Expected |
|----------|---------------|------------------|----------------|
| GET /api/admin/stats | 403 | 200 | 200 |
| GET /api/admin/audit-log | 403 | 403 | 200 |
| DELETE /api/admin/services/1 | 403 | 200 | 200 |
| GET /api/admin/payroll | 403 | 200 | 200 |
| GET /api/admin/reports/revenue | 403 | 200 | 200 |

---

### TC-API-009 — Gift Card API

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-API-009 |
| **Title** | Gift Card CRUD API |
| **Priority** | P1 — High |
| **Type** | API / Functional |

**Test Steps:**

| Endpoint | Request | Expected |
|----------|---------|----------|
| POST /api/gift-cards | { amount: 5000, recipientEmail: "mary@test.com" } | 201, code AN-XXXX-XXXX |
| GET /api/gift-cards/AN-XXXX | - | 200, { code, balance, expiry } |
| POST /api/gift-cards/redeem | { code: "AN-XXXX", amount: 5000 } | 200, new balance |
| POST /api/gift-cards/redeem | { code: "AN-XXXX", amount: 99999 } | 400, insufficient balance |
| GET /api/gift-cards/INVALID | - | 404, { error: "Gift card not found" } |

---

### TC-API-010 — Input Validation và XSS Prevention

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-API-010 |
| **Title** | API sanitize input — chặn XSS và SQL Injection |
| **Priority** | P0 — Critical |
| **Type** | Security |

**Test Cases:**

| Input | Endpoint | Expected |
|-------|----------|----------|
| `<script>alert(1)</script>` trong firstName | POST /api/bookings | 400 hoặc sanitized: stored as plain text |
| `'; DROP TABLE bookings; --` trong notes | POST /api/bookings | 400 hoặc sanitized |
| Email: `admin@test.com<script>` | POST /api/bookings | 400 Invalid email |
| 10,000 ký tự trong notes | POST /api/bookings | 400 Too long hoặc truncated |
| Negative serviceId: -1 | POST /api/bookings | 400 Invalid |
| Non-existent serviceId: 99999 | POST /api/bookings | 404 Service not found |
