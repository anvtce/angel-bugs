# TC-SVC — Services (Dịch vụ)

**Module:** Services Management  
**URL:** `https://project.vinapage.com/angel/admin/services`  
**Standard:** IEEE 829 / ISTQB  
**Version:** 1.0 | **Updated:** 2026-05-09  
**Roles:** ADMIN, MANAGER (CRUD) | STAFF (read-only)  

---

## Test Plan

### Scope
Kiểm thử module quản lý danh mục dịch vụ: thêm/sửa/xóa dịch vụ, quản lý nhóm (categories), bật/tắt hiển thị. Thay đổi ở đây ảnh hưởng trực tiếp đến trang public `/angel/services` và luồng booking.

> **Ghi chú UI:** Trang Services admin hiển thị danh sách grouped theo category. Header có nút "Thêm danh mục" (Add category). Nút **Add Service** nằm trong **từng category section** (không phải nút toàn cục). Services hiển thị badge "NỔI BẬT" (featured) nếu được đánh dấu nổi bật.

### Objectives
- CRUD dịch vụ hoạt động đúng (Create, Read, Update, Delete)
- Quản lý categories (nhóm dịch vụ) đúng
- Active/Inactive flag ảnh hưởng đúng đến public site
- Giá hiển thị đúng (lưu cents → hiển thị $)
- Validation form đầy đủ

### Business Rules
- Giá lưu trong DB dưới dạng integer cents (VD: 5500 = $55.00)
- Dịch vụ inactive KHÔNG hiển thị trên public site và KHÔNG có trong booking flow
- Category phải tồn tại trước khi tạo dịch vụ thuộc category đó

---

## Test Cases

---

### TC-SVC-001 — Thêm dịch vụ mới

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-SVC-001 |
| **Title** | Tạo dịch vụ mới thành công |
| **Priority** | P0 — Critical |
| **Type** | Functional / Positive |
| **Preconditions** | Đăng nhập ADMIN/MANAGER, có ít nhất 1 category |

**Test Data:**
| Field | Value |
|-------|-------|
| Name | Luxury Gel Manicure |
| Category | Manicure |
| Description | Premium gel nail service with luxury finish |
| Duration | 90 minutes |
| Price | $85.00 |
| Active | Yes |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Truy cập `/angel/admin/services` | Danh sách dịch vụ grouped theo category hiển thị |
| 2 | Tìm section category "Manicure", click nút thêm dịch vụ trong section đó | Modal/form tạo dịch vụ mở với category pre-selected là "Manicure" |
| 3 | Nhập Name: "Luxury Gel Manicure" | Field nhận input |
| 4 | Chọn Category: "Manicure" | Dropdown category hiển thị đúng danh sách |
| 5 | Nhập Description | Textarea nhận text |
| 6 | Nhập Duration: 90 | Số phút |
| 7 | Nhập Price: 85.00 | Nhập dạng decimal, hệ thống lưu 8500 cents |
| 8 | Bật Active toggle | Service sẽ hiển thị public |
| 9 | Click "Save" | `POST /api/admin/services` |
| 10 | Kiểm tra response | HTTP 201, service ID được tạo |
| 11 | Kiểm tra danh sách | Service mới xuất hiện trong list |
| 12 | Mở public `/angel/services` | Service mới hiển thị trong đúng category |

**Expected Result:** Service được tạo, hiển thị đúng trên cả admin và public site.

---

### TC-SVC-002 — Validation form tạo dịch vụ

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-SVC-002 |
| **Title** | Validation fields bắt buộc khi tạo/sửa dịch vụ |
| **Priority** | P1 — High |
| **Type** | Functional / Negative |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Mở form tạo dịch vụ, bỏ trống tất cả, click Save | Validation errors hiển thị |
| 2 | Kiểm tra error: Name | "Service name is required" |
| 3 | Kiểm tra error: Category | "Category is required" |
| 4 | Kiểm tra error: Duration | "Duration is required" hoặc "Must be a positive number" |
| 5 | Kiểm tra error: Price | "Price is required" |
| 6 | Nhập Price = -10 | Error "Price must be positive" |
| 7 | Nhập Price = 0 | Error "Price must be greater than 0" |
| 8 | Nhập Duration = 0 | Error "Duration must be positive" |
| 9 | Nhập Name = "AB" (quá ngắn nếu có min-length) | Error min-length |
| 10 | Nhập Name = 500 ký tự | Error max-length hoặc truncated |

---

### TC-SVC-003 — Sửa dịch vụ

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-SVC-003 |
| **Title** | Cập nhật thông tin dịch vụ |
| **Priority** | P0 — Critical |
| **Type** | Functional |
| **Preconditions** | Có ít nhất 1 dịch vụ Active |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click vào service trong danh sách hoặc click nút Edit | Form sửa mở với data pre-filled |
| 2 | Đổi tên dịch vụ | Field cập nhật |
| 3 | Đổi giá từ $55.00 thành $60.00 | Field nhận $60.00 |
| 4 | Click Save | `PUT /api/admin/services/{id}` |
| 5 | Kiểm tra danh sách | Tên và giá đã được cập nhật |
| 6 | Kiểm tra public site | Service hiển thị giá mới $60.00 |
| 7 | Kiểm tra booking flow | Giá booking mới sử dụng $60.00 |

**Expected Result:** Update thành công, phản ánh trên cả admin và public.

---

### TC-SVC-004 — Bật/Tắt dịch vụ (Active Flag)

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-SVC-004 |
| **Title** | Toggle Active/Inactive ảnh hưởng đến public site |
| **Priority** | P0 — Critical |
| **Type** | Functional / Integration |
| **Preconditions** | Có dịch vụ "Basic Manicure" đang Active |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Xác nhận "Basic Manicure" Active = true | Visible trên public `/angel/services` |
| 2 | Admin: Toggle Active OFF | `PUT /api/admin/services/{id}` với active=false |
| 3 | Mở public `/angel/services` | "Basic Manicure" biến mất hoặc ẩn |
| 4 | Mở booking flow | "Basic Manicure" không còn trong danh sách chọn |
| 5 | Admin: Toggle Active ON lại | Service active=true |
| 6 | Mở public site | Service hiển thị lại |

**Expected Result:** Active flag kiểm soát visibility trên toàn hệ thống.

---

### TC-SVC-005 — Giá hiển thị đúng (cents → dollar)

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-SVC-005 |
| **Title** | Conversion giá cents → $ hiển thị đúng |
| **Priority** | P0 — Critical |
| **Type** | Data Accuracy |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Tạo dịch vụ với giá $55.00 | DB lưu 5500 cents |
| 2 | Kiểm tra admin list | Hiển thị "$55.00" (không phải "5500") |
| 3 | Kiểm tra public site | Hiển thị "$55.00" |
| 4 | Kiểm tra booking summary | Hiển thị "$55.00" |
| 5 | Tạo dịch vụ giá $0.50 | DB lưu 50 cents |
| 6 | Kiểm tra hiển thị | "$0.50" (không phải "$.5" hoặc "0.5") |
| 7 | Kiểm tra total trong report | Tổng tiền tính đúng (không bị x100 hay /100 sai) |

---

### TC-SVC-006 — Quản lý Categories (Nhóm dịch vụ)

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-SVC-006 |
| **Title** | CRUD Categories |
| **Priority** | P1 — High |
| **Type** | Functional |

> **Ghi chú UI:** Nút "Thêm danh mục" (với icon create_new_folder) nằm ở header của trang Services, phía trên danh sách. Không có tab riêng cho categories.

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Tại `/angel/admin/services`, click nút "Thêm danh mục" | Form tạo category mới hiển thị |
| 2 | Tạo category mới: "Extensions" | Category được tạo và hiển thị trong danh sách |
| 3 | Tạo service thuộc "Extensions" | Service gán đúng category |
| 4 | Kiểm tra public site | Section "Extensions" xuất hiện |
| 5 | Đổi tên category "Extensions" → "Nail Extensions" | Category name update |
| 6 | Kiểm tra public site | Section tên mới "Nail Extensions" |
| 7 | Xóa category rỗng (không có service) | Category bị xóa |
| 8 | Xóa category CÓ service con | Hệ thống hỏi: reassign hoặc không cho xóa |

---

### TC-SVC-007 — Xóa dịch vụ

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-SVC-007 |
| **Title** | Xóa dịch vụ — có confirmation dialog |
| **Priority** | P1 — High |
| **Type** | Functional / Negative |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Delete" trên service | Confirmation dialog: "Are you sure? This cannot be undone." |
| 2 | Click "Cancel" | Dialog đóng, service vẫn tồn tại |
| 3 | Click "Delete" lại → "Confirm Delete" | `DELETE /api/admin/services/{id}` |
| 4 | Kiểm tra danh sách | Service biến mất |
| 5 | Xóa service có booking liên quan | Hệ thống cảnh báo / từ chối / detach bookings |
| 6 | Kiểm tra public site | Service không còn hiển thị |
