# TC-REV — Reviews (Đánh giá khách hàng)

**Module:** Reviews Management  
**URL:** `https://project.vinapage.com/angel/admin/reviews`  
**Public URL:** `https://project.vinapage.com/angel/reviews`  
**Standard:** IEEE 829 / ISTQB  
**Version:** 1.0 | **Updated:** 2026-05-09  
**Roles:** ADMIN, MANAGER  

---

## Test Cases

---

### TC-REV-001 — Duyệt và Ẩn review

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-REV-001 |
| **Title** | Approve / Hide review → phản ánh trên public site |
| **Priority** | P0 — Critical |
| **Type** | Functional / Integration |
| **Preconditions** | Có 3 reviews: 2 PENDING, 1 PUBLISHED |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Truy cập `/angel/admin/reviews` | Danh sách reviews với status |
| 2 | Click "Approve" trên review PENDING | Status → PUBLISHED |
| 3 | Mở public `/angel/reviews` | Review xuất hiện |
| 4 | Click "Hide" trên review PUBLISHED | Status → HIDDEN |
| 5 | Mở public `/angel/reviews` | Review biến mất |
| 6 | Approve lại | Review hiển thị lại |

---

### TC-REV-002 — Trả lời review

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-REV-002 |
| **Title** | Admin reply xuất hiện dưới review public |
| **Priority** | P1 — High |
| **Type** | Functional |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Reply" trên review đã PUBLISHED | Textarea mở |
| 2 | Nhập: "Thank you for your feedback!" | Text nhập vào |
| 3 | Submit | Reply lưu |
| 4 | Mở public reviews | Reply hiển thị dưới review của khách |
| 5 | Sửa reply | Reply cập nhật |
| 6 | Xóa reply | Reply biến mất khỏi public |

---

### TC-REV-003 — Filter theo số sao

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-REV-003 |
| **Title** | Filter reviews theo star rating |
| **Priority** | P1 — High |
| **Type** | Functional |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Filter "5 stars" | Chỉ hiển thị 5-star reviews |
| 2 | Filter "1 star" | Chỉ hiển thị 1-star reviews (critical) |
| 3 | Filter "All" | Tất cả reviews |
| 4 | Kiểm tra avg rating | Average = sum(stars)/count đúng |
