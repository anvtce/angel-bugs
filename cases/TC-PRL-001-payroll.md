# TC-PRL — Payroll (Bảng lương)

**Module:** Payroll  
**URL:** `https://project.vinapage.com/angel/admin/payroll`  
**Standard:** IEEE 829 / ISTQB  
**Version:** 1.0 | **Updated:** 2026-05-09  
**Roles:** ADMIN, MANAGER  

---

## Test Cases

---

### TC-PRL-001 — Tính lương theo doanh thu dịch vụ

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-PRL-001 |
| **Title** | Lương tính đúng dựa trên doanh thu thực hiện |
| **Priority** | P0 — Critical |
| **Type** | Functional / Data Accuracy |
| **Preconditions** | Staff "Nguyen Thi Mai" có 5 bookings COMPLETED trong tháng 5/2026 tổng $500 |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Truy cập `/angel/admin/payroll` | Bảng lương theo kỳ |
| 2 | Chọn kỳ: tháng 5/2026 | Dữ liệu tháng 5 |
| 3 | Tìm "Nguyen Thi Mai" | Row lương của Mai |
| 4 | Kiểm tra Revenue Generated | $500 (sum 5 bookings COMPLETED) |
| 5 | Kiểm tra Commission (nếu 30%) | $500 × 30% = $150 |
| 6 | Kiểm tra Base Salary (nếu có) | Đúng cấu hình |
| 7 | Kiểm tra Total Pay | Commission + Base = $150 + base |

---

### TC-PRL-002 — Hoa hồng và lương cứng

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-PRL-002 |
| **Title** | Cấu hình commission rate và fixed salary |
| **Priority** | P1 — High |
| **Type** | Functional |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Vào Settings Staff / Payroll config | Commission rate per staff |
| 2 | Set Mai: 35% commission, $0 base | Cấu hình lưu |
| 3 | Tính lương tháng 5: Revenue $500 | Pay = $500 × 35% = $175 |
| 4 | Set Tran Thi B: 0% commission, $2000 base/month | Cấu hình lưu |
| 5 | Tính lương tháng 5 cho B | Pay = $2000 (không phụ thuộc doanh thu) |

---

### TC-PRL-003 — Xuất bảng lương

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-PRL-003 |
| **Title** | Export bảng lương theo kỳ |
| **Priority** | P2 — Medium |
| **Type** | Functional |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Chọn kỳ tháng 5/2026 | Bảng lương hiển thị |
| 2 | Click "Export" | File CSV hoặc PDF download |
| 3 | Kiểm tra nội dung | Staff, Revenue, Commission Rate, Commission, Base, Total |
| 4 | Kiểm tra tổng cuối file | Sum Total = tổng lương tất cả staff |
