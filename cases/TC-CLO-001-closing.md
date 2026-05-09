# TC-CLO — Closing (Chốt ngày)

**Module:** Daily Closing  
**URL:** `https://project.vinapage.com/angel/admin/closing`  
**Standard:** IEEE 829 / ISTQB  
**Version:** 1.0 | **Updated:** 2026-05-09  
**Roles:** ADMIN, MANAGER  

---

## Test Cases

---

### TC-CLO-001 — Tổng doanh thu cuối ngày

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-CLO-001 |
| **Title** | Closing report hiển thị đúng tổng doanh thu theo phương thức |
| **Priority** | P0 — Critical |
| **Type** | Functional / Data Accuracy |
| **Preconditions** | Ngày 09/05/2026 có: 3 cash ($150), 2 card ($200), 1 gift card ($50) |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Truy cập `/angel/admin/closing` | Closing report ngày hôm nay |
| 2 | Kiểm tra Cash total | $150.00 |
| 3 | Kiểm tra Card total | $200.00 |
| 4 | Kiểm tra Gift Card total | $50.00 |
| 5 | Kiểm tra Grand Total | $400.00 |
| 6 | Cross-check với Payments tab | Số liệu nhất quán |

---

### TC-CLO-002 — Nhập số tiền mặt thực đếm và Đối chiếu

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-CLO-002 |
| **Title** | Nhập cash thực tế → tính chênh lệch |
| **Priority** | P0 — Critical |
| **Type** | Functional |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Section "Cash Count" | Input field: số tiền mặt thực đếm |
| 2 | Nhập đúng $150.00 | Chênh lệch: $0.00 ✓ |
| 3 | Nhập thiếu $145.00 | Chênh lệch: -$5.00 (thiếu) — highlight màu đỏ |
| 4 | Nhập thừa $155.00 | Chênh lệch: +$5.00 (thừa) — highlight màu vàng |
| 5 | Ghi chú chênh lệch | Optional field |

---

### TC-CLO-003 — Khoá sổ ngày

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-CLO-003 |
| **Title** | Lock day — ngăn chỉnh sửa sau khi chốt |
| **Priority** | P1 — High |
| **Type** | Functional |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Lock Day" / "Chốt sổ hôm nay" | Confirmation dialog |
| 2 | Confirm | Ngày 09/05/2026 được lock |
| 3 | Thử thêm payment cho ngày 09/05 | Error: "Day is locked, cannot modify" |
| 4 | Thử mở closing report ngày 09/05 | Read-only view |
| 5 | Kiểm tra Audit Log | Action LOCK_DAY ghi nhận |
