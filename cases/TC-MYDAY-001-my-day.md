# TC-MYDAY — My Day

**Module:** My Day  
**URL:** `https://project.vinapage.com/angel/admin/my-day`  
**Standard:** IEEE 829 / ISTQB  
**Version:** 1.0 | **Updated:** 2026-05-09  
**Roles:** STAFF (own schedule) | MANAGER/ADMIN (see more)  

---

## Test Cases

---

### TC-MYDAY-001 — STAFF thấy lịch của bản thân

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-MYDAY-001 |
| **Title** | My Day hiển thị đúng lịch của user đang đăng nhập |
| **Priority** | P0 — Critical |
| **Type** | Functional |
| **Preconditions** | Staff "Nguyen Thi Mai" có 3 bookings hôm nay |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Đăng nhập role STAFF (mai@angelnail.co.nz) | Session STAFF |
| 2 | Truy cập `/angel/admin/my-day` | Hiển thị lịch hôm nay của Mai |
| 3 | Kiểm tra tiêu đề | Ngày hôm nay, tên thợ |
| 4 | Kiểm tra danh sách | 3 bookings của Mai theo thứ tự giờ tăng dần |
| 5 | Kiểm tra KHÔNG thấy booking của thợ khác | Booking của "Tran Thi B" KHÔNG hiển thị |
| 6 | Mỗi booking hiển thị | Giờ, khách, dịch vụ, trạng thái, ghi chú |

---

### TC-MYDAY-002 — MANAGER/ADMIN thấy lịch của nhiều thợ

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-MYDAY-002 |
| **Title** | MANAGER xem My Day có filter theo staff |
| **Priority** | P1 — High |
| **Type** | Functional / Authorization |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Đăng nhập MANAGER | Session MANAGER |
| 2 | Truy cập `/angel/admin/my-day` | Có filter chọn staff hoặc hiển thị tất cả |
| 3 | Chọn Staff: "Nguyen Thi Mai" | Lịch của Mai |
| 4 | Chọn Staff: "Tran Thi B" | Lịch của Tran Thi B |
| 5 | Chọn "All Staff" | Tổng hợp lịch tất cả thợ hôm nay |

---

### TC-MYDAY-003 — Cập nhật trạng thái booking từ My Day

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-MYDAY-003 |
| **Title** | Thợ cập nhật status booking trực tiếp từ My Day |
| **Priority** | P1 — High |
| **Type** | Functional |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | STAFF click vào booking trong My Day | Detail panel mở |
| 2 | Click "Mark as Started" / đổi status | Status đổi sang IN_PROGRESS hoặc CONFIRMED |
| 3 | Click "Complete" | Status = COMPLETED |
| 4 | Kiểm tra Appointments module | Status đã cập nhật |
| 5 | Kiểm tra Audit Log | Action UPDATE ghi nhận bởi staff user |
