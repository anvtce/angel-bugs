# TC-GAL — Gallery (Thư viện ảnh)

**Module:** Gallery Management  
**URL:** `https://project.vinapage.com/angel/admin/gallery`  
**Public URL:** `https://project.vinapage.com/angel/gallery`  
**Standard:** IEEE 829 / ISTQB  
**Version:** 1.0 | **Updated:** 2026-05-09  
**Roles:** ADMIN, MANAGER  

---

## Test Cases

---

### TC-GAL-001 — Upload nhiều ảnh cùng lúc (Drag & Drop)

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-GAL-001 |
| **Title** | Drag & drop upload nhiều ảnh |
| **Priority** | P1 — High |
| **Type** | Functional |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Truy cập `/angel/admin/gallery` | Trang gallery với drop zone |
| 2 | Kéo 3 ảnh JPG (500KB mỗi ảnh) vào drop zone | Drop zone highlight |
| 3 | Thả chuột | Upload progress hiển thị cho từng ảnh |
| 4 | Chờ upload xong | 3 ảnh mới xuất hiện trong gallery |
| 5 | Kiểm tra public `/angel/gallery` | 3 ảnh mới hiển thị |
| 6 | Upload ảnh sai format (PDF, TXT) | Error: "Only images allowed" |
| 7 | Upload ảnh >10MB | Error: "File too large" |

---

### TC-GAL-002 — Đổi nhóm và thứ tự ảnh

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-GAL-002 |
| **Title** | Gán category và drag reorder ảnh |
| **Priority** | P2 — Medium |
| **Type** | Functional |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Chọn ảnh → gán category "Manicure" | Category updated |
| 2 | Kéo thả để đổi thứ tự ảnh | Order cập nhật |
| 3 | Mở public gallery tab "Manicure" | Ảnh xuất hiện đúng nhóm, đúng thứ tự |

---

### TC-GAL-003 — Xóa ảnh với confirmation

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-GAL-003 |
| **Title** | Xóa ảnh — có confirmation dialog |
| **Priority** | P1 — High |
| **Type** | Functional |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Hover vào ảnh → click Delete | Confirmation: "Delete this photo?" |
| 2 | Click Cancel | Ảnh vẫn tồn tại |
| 3 | Click Delete → Confirm | Ảnh bị xóa khỏi admin gallery |
| 4 | Kiểm tra public gallery | Ảnh không còn xuất hiện |

---

### TC-GAL-004 — Sync với Public Gallery

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-GAL-004 |
| **Title** | Thay đổi admin gallery phản ánh ngay public site |
| **Priority** | P0 — Critical |
| **Type** | Integration |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Upload ảnh mới vào admin gallery | Ảnh lưu thành công |
| 2 | Mở public `/angel/gallery` (new tab) | Ảnh mới xuất hiện |
| 3 | Xóa ảnh trong admin | Ảnh biến mất trên public |
| 4 | Reload public gallery | Không còn thấy ảnh đã xóa |
