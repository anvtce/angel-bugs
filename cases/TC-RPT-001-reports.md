# TC-RPT — Reports (Báo cáo)

**Module:** Reports  
**URL:** `https://project.vinapage.com/angel/admin/reports`  
**Standard:** IEEE 829 / ISTQB  
**Version:** 1.0 | **Updated:** 2026-05-09  
**Roles:** ADMIN, MANAGER  

---

## Test Plan

### Scope
Kiểm thử module báo cáo: doanh thu theo khoảng ngày, top dịch vụ bán chạy, top staff doanh thu cao, xuất CSV.

---

## Test Cases

---

### TC-RPT-001 — Báo cáo doanh thu theo khoảng ngày

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-RPT-001 |
| **Title** | Revenue report theo date range chính xác |
| **Priority** | P0 — Critical |
| **Type** | Functional / Data Accuracy |
| **Preconditions** | Có bookings COMPLETED trong tháng 4 và tháng 5/2026 |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Truy cập `/angel/admin/reports` | Trang báo cáo với date range picker |
| 2 | Chọn range: 01/05/2026 - 09/05/2026 | API `GET /api/admin/reports/revenue?from=...&to=...` |
| 3 | Kiểm tra tổng doanh thu | Tổng đúng với sum bookings COMPLETED trong range |
| 4 | Kiểm tra breakdown | Cash / Card / Gift Card subtotals |
| 5 | Chọn range tháng 4 | Số liệu khác với tháng 5 |
| 6 | Chọn range rỗng (không có booking) | $0.00 với empty state message |
| 7 | Cross-check với Payments module | Số liệu nhất quán |

---

### TC-RPT-002 — Top dịch vụ bán chạy

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-RPT-002 |
| **Title** | Top services report — ranking đúng |
| **Priority** | P1 — High |
| **Type** | Functional / Data Accuracy |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Chọn tab "Services" trong Reports | Danh sách dịch vụ theo doanh thu hoặc số lượt |
| 2 | Chọn date range 1 tháng | Kết quả tính trong tháng đó |
| 3 | Kiểm tra ranking | Service có doanh thu cao nhất ở vị trí 1 |
| 4 | Kiểm tra số lượt | Count đúng số booking của service đó |
| 5 | Kiểm tra doanh thu | Đúng $XX.XX |

---

### TC-RPT-003 — Top Staff doanh thu

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-RPT-003 |
| **Title** | Top staff by revenue |
| **Priority** | P1 — High |
| **Type** | Functional |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Tab "Staff Performance" | Danh sách staff với doanh thu tạo ra |
| 2 | Chọn date range | Filter theo thời gian |
| 3 | Kiểm tra xếp hạng | Staff nhiều doanh thu nhất ở đầu |
| 4 | Kiểm tra số liệu | Doanh thu = sum bookings COMPLETED của staff đó trong range |

---

### TC-RPT-004 — Xuất CSV

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-RPT-004 |
| **Title** | Xuất báo cáo ra file CSV |
| **Priority** | P2 — Medium |
| **Type** | Functional |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Chọn date range | Báo cáo hiển thị |
| 2 | Click "Export CSV" (nếu có) | File download với tên report_YYYYMMDD.csv |
| 3 | Mở CSV | Columns đúng: Date, Booking ID, Client, Service, Staff, Amount, Method |
| 4 | Kiểm tra số dòng | Khớp với số giao dịch trong UI |
| 5 | Kiểm tra encoding | UTF-8, không bị lỗi font tiếng Việt |
