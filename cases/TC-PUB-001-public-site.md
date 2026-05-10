# TC-PUB — Public Site (9 trang khách hàng)

**Module:** Public Website  
**Base URL:** `https://project.vinapage.com/angel`  
**Standard:** IEEE 829 / ISTQB  
**Version:** 1.0 | **Updated:** 2026-05-09  
**Roles:** Guest (không cần đăng nhập)  

---

## Test Plan

### Scope
Kiểm thử 9 trang public: trang chủ, dịch vụ, gallery, giới thiệu, liên hệ, đội ngũ, reviews, gift cards, manage-booking. Tất cả dùng chung Navbar + Footer + MobileNav.

---

## Test Cases

---

### TC-PUB-001 — Trang chủ (Homepage)

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-PUB-001 |
| **Title** | Homepage hiển thị đầy đủ các section |
| **Priority** | P1 — High |
| **Type** | Functional / UI |
| **URL** | `/angel/` |

> **Ghi chú UI:** Navbar thực tế hiển thị: **Logo "Angel Nail"**, links: **Services, Gallery, About, Contact**, nút **"Book Now"** (không có Staff và Reviews trong navbar). Trang homepage có các sections: Hero, Our Blenheim Story (About), Signature Services, The Atelier Gallery, Testimonials, Contact + Google Maps.

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Truy cập `/angel` | Trang chủ load |
| 2 | Kiểm tra Navbar | Logo "Angel Nail", links: **Services, Gallery, About, Contact**, nút "Book Now" (màu primary) |
| 3 | Section Hero | Headline "The Art of Modern Care", subtext, nút CTA |
| 4 | Click nút "Book Now" trong navbar | Navigate đến `/angel/booking` |
| 5 | Section "Our Blenheim Story" | Giới thiệu tiệm, hình ảnh |
| 6 | Section "Signature Services" | Preview 4 dịch vụ nổi bật |
| 7 | Section "The Atelier Gallery" | Preview 6 ảnh gallery |
| 8 | Section Testimonials | Reviews từ database (ít nhất 1 review) |
| 9 | Section Contact | Địa chỉ, Google Maps (Get Directions link) |
| 10 | Footer | Links, copyright "© 2026 Angel Nails & Spa. All Rights Reserved." |
| 11 | Load time | < 3 giây (LCP) |

---

### TC-PUB-002 — Trang Dịch vụ

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-PUB-002 |
| **Title** | Services page hiển thị đúng danh mục và giá |
| **Priority** | P1 — High |
| **URL** | `/angel/services` |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Truy cập `/angel/services` | Trang dịch vụ |
| 2 | Kiểm tra nhóm | Manicure, Pedicure, Nail Art... |
| 3 | Mỗi service card | Tên, giá ($), thời gian, mô tả |
| 4 | Giá hiển thị đúng | $XX.XX, không phải cents |
| 5 | Dịch vụ inactive | KHÔNG hiển thị |
| 6 | Click "Book Now" trên service | Navigate đến booking với service pre-selected |
| 7 | Sync với admin | Thêm service mới trong admin → xuất hiện ngay |

---

### TC-PUB-003 — Trang Gallery

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-PUB-003 |
| **Title** | Gallery page — filter theo category, load đúng |
| **Priority** | P2 — Medium |
| **URL** | `/angel/gallery` |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Truy cập `/angel/gallery` | Grid ảnh hiển thị |
| 2 | Filter "All" | Tất cả ảnh |
| 3 | Filter "Manicure" | Chỉ ảnh category Manicure |
| 4 | Filter "Pedicure" | Chỉ ảnh category Pedicure |
| 5 | Filter "Nail Art" | Chỉ ảnh Nail Art |
| 6 | Click vào ảnh | Lightbox/modal phóng to ảnh |
| 7 | Ảnh lazy load | Ảnh dưới fold load khi scroll đến |

---

### TC-PUB-004 — Trang Liên hệ

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-PUB-004 |
| **Title** | Contact page — thông tin chính xác, Google Maps |
| **Priority** | P1 — High |
| **URL** | `/angel/contact` |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Truy cập `/angel/contact` | Trang liên hệ |
| 2 | Kiểm tra địa chỉ | "1/20 High Street, Blenheim 7201, NZ" |
| 3 | Kiểm tra SĐT | "03 579 1166" (clickable tel: link trên mobile) |
| 4 | Kiểm tra email | Hiển thị đúng email tiệm |
| 5 | Kiểm tra giờ mở cửa | Đồng bộ với Settings > Business Hours |
| 6 | Google Maps | Embed hoặc link đến đúng địa chỉ Blenheim |
| 7 | Thay đổi giờ trong Settings | Trang Contact cập nhật |

---

### TC-PUB-005 — Navbar và Mobile Navigation

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-PUB-005 |
| **Title** | Navbar và MobileNav hoạt động đúng |
| **Priority** | P1 — High |
| **Type** | UI / Responsive |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Desktop (>768px) | Navbar ngang: Logo + Services, Gallery, About, Contact + nút "Book Now" |
| 2 | Mobile (≤768px) | Navbar thu gọn, logo + nút "Book Now", hamburger menu hoặc bottom nav |
| 3 | Click hamburger (mobile) | Menu slide out với đầy đủ links: Services, Gallery, About, Contact |
| 4 | Mobile bottom nav (nếu có) | Home, Services, Book, Gallery, Contact |
| 5 | Active state | Link của trang đang xem được highlight |
| 6 | Scroll xuống | Navbar sticky, không mất |

---

### TC-PUB-006 — Trang Giới thiệu và Đội ngũ

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-PUB-006 |
| **Title** | About và Staff pages hiển thị đúng |
| **Priority** | P2 — Medium |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | `/angel/about` | Thông tin tiệm, triết lý |
| 2 | `/angel/staff` | Danh sách thợ Active với avatar, tên, specialties |
| 3 | Thợ available=false | Không hiển thị trên public staff page |
| 4 | Avatar | Hiển thị ảnh đã upload, fallback placeholder nếu chưa có |

---

### TC-PUB-007 — Trang Reviews công khai

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-PUB-007 |
| **Title** | Public reviews hiển thị chỉ approved reviews |
| **Priority** | P1 — High |
| **URL** | `/angel/reviews` |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Truy cập `/angel/reviews` | Danh sách reviews |
| 2 | Kiểm tra | Chỉ PUBLISHED reviews xuất hiện |
| 3 | PENDING/HIDDEN reviews | Không hiển thị |
| 4 | Mỗi review | Tên khách, số sao, ngày, nội dung, reply của admin |
| 5 | Avg rating | Hiển thị đúng |
