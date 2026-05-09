# TC-ALOG — Audit Log (Nhật ký thao tác)

**Module:** Audit Log  
**URL:** `https://project.vinapage.com/angel/admin/audit-log`  
**Standard:** IEEE 829 / ISTQB  
**Version:** 1.0 | **Updated:** 2026-05-09  
**Roles:** ADMIN only  

---

## Test Plan

### Scope
Kiểm thử nhật ký thao tác hệ thống: ai làm gì, lúc nào, với entity nào. Đảm bảo tính toàn vẹn dữ liệu audit (read-only, không thể sửa/xóa).

### Business Rules
- Ghi lại tất cả: CREATE, UPDATE, DELETE trên mọi entity
- Không cho sửa/xóa audit log
- Chỉ ADMIN mới đọc được audit log

---

## Test Cases

---

### TC-ALOG-001 — Audit Log ghi lại thao tác

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-ALOG-001 |
| **Title** | Verify audit log ghi đúng sau các thao tác CRUD |
| **Priority** | P0 — Critical |
| **Type** | Functional / Integration |
| **Preconditions** | Đăng nhập ADMIN |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Tạo service mới "Test Service" | Action ghi nhận |
| 2 | Mở Audit Log | Entry mới nhất: action=CREATE, entity=Service, user=elena@angelnail.co.nz, timestamp=now |
| 3 | Sửa service "Test Service" → "Test Service v2" | Update action ghi nhận |
| 4 | Kiểm tra audit log | Entry: action=UPDATE, entity=Service, field=name, old="Test Service", new="Test Service v2" |
| 5 | Xóa service | Entry: action=DELETE, entity=Service |
| 6 | Đổi trạng thái booking | Entry: action=UPDATE, entity=Booking, field=status |
| 7 | Đăng nhập/Đăng xuất | Entry: action=LOGIN / LOGOUT (nếu log auth events) |

---

### TC-ALOG-002 — Filter Audit Log

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-ALOG-002 |
| **Title** | Filter audit log theo user và loại thao tác |
| **Priority** | P1 — High |
| **Type** | Functional |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Filter theo User: "elena@angelnail.co.nz" | Chỉ hiển thị actions của admin |
| 2 | Filter theo Action: "CREATE" | Chỉ hiển thị create events |
| 3 | Filter theo Action: "DELETE" | Chỉ hiển thị delete events |
| 4 | Filter theo date range | Log trong khoảng thời gian |
| 5 | Filter kết hợp: User=manager + Action=UPDATE | Intersection filter |

---

### TC-ALOG-003 — Audit Log là Read-Only

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-ALOG-003 |
| **Title** | Không thể sửa hoặc xóa audit log |
| **Priority** | P0 — Critical |
| **Type** | Security / Integrity |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Kiểm tra UI | Không có nút Edit hoặc Delete trên từng log entry |
| 2 | Thử `DELETE /api/admin/audit-log/1` | HTTP 405 Method Not Allowed hoặc 403 |
| 3 | Thử `PUT /api/admin/audit-log/1` với body thay đổi | HTTP 405 hoặc 403 |
| 4 | Kiểm tra qua UI | Không có form inline edit |

---

### TC-ALOG-004 — Chỉ ADMIN đọc được Audit Log

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-ALOG-004 |
| **Title** | RBAC — MANAGER và STAFF không đọc được audit log |
| **Priority** | P0 — Critical |
| **Type** | Security |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Đăng nhập MANAGER → truy cập `/angel/admin/audit-log` | 403 Forbidden |
| 2 | MANAGER gọi `GET /api/admin/audit-log` | HTTP 403 |
| 3 | Đăng nhập STAFF → truy cập `/angel/admin/audit-log` | 403 Forbidden |
