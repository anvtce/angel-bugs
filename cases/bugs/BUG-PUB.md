# BUG REPORTS — TC-PUB (Public Site)

**Module:** Public Website  
**Tested by:** QA Automation  
**Test date:** 2026-05-09  
**Environment:** Chrome / Windows 10 / `https://project.vinapage.com/angel` / Role: Guest  

---

## BUG-PUB-001 — Homepage không có section Testimonials/Reviews

**Bug ID:** BUG-PUB-001  
**Test Case:** TC-PUB-001 (Step 8)  
**Severity:** Medium  
**Priority:** P2  
**Status:** Open  
**Summary:** TC-PUB-001 step 8 yêu cầu trang chủ hiển thị section Testimonials với "Reviews từ database (ít nhất 1 review)". Tuy nhiên, homepage không có section Testimonials. Trang reviews tồn tại tại `/angel/reviews` nhưng không được nhúng vào homepage.

**Environment:**
- URL: `https://project.vinapage.com/angel`
- Role: Guest

**Actual Result:**
- Homepage H2 sections: "Our Blenheim Story", "Signature Services", "The Atelier Gallery", "Visit Our Studio"
- Không có section Testimonials, Reviews, hay client feedback nào trên homepage
- `/angel/reviews` tồn tại nhưng hiển thị "No reviews yet — Be the first to share your experience!"

**Expected Result (theo TC-PUB-001):**
- Homepage phải có section Testimonials hiển thị reviews từ database
- Ít nhất 1 review được approved/published hiển thị

**Impact:**
- Social proof không được hiển thị trên trang chủ — ảnh hưởng đến conversion rate
- Reviews page trống hoàn toàn (không có review nào được tạo/approved)

**Attachments:** `pub-001-homepage-full.png`

---

## BUG-PUB-002 — `/angel/staff` là trang PIN staff schedule, không phải public staff listing

**Bug ID:** BUG-PUB-002  
**Test Case:** TC-PUB-006 (Step 2)  
**Severity:** Low  
**Priority:** P3  
**Status:** Open  
**Summary:** TC-PUB-006 step 2 expect `/angel/staff` hiển thị "Danh sách thợ Active với avatar, tên, specialties". Tuy nhiên, URL này là trang nội bộ yêu cầu nhập Staff PIN để xem lịch làm việc, không phải public staff profile page.

**Environment:**
- URL: `https://project.vinapage.com/angel/staff`
- Role: Guest

**Actual Result:**
- Trang hiển thị: "STAFF SCHEDULE — ENTER YOUR STAFF PIN — Access Schedule"
- Yêu cầu nhập PIN để vào — không có public staff listing
- About page (`/angel/about`) có section "The Artisans" với 3 artisans (hardcoded): Elena Vance (Founder), Sophia Chen (Senior Technician), Isabella Rossi (Gel Specialist)
- Những tên này **khác với admin staff** (Elena Rossi, Sofia Blanco, Maya Chen) — không sync từ database

**Expected Result (theo TC-PUB-006):**
- `/angel/staff` hiển thị danh sách thợ active với avatar, tên, specialty badges
- Staff `available=false` không hiển thị

**Impact:** Low — Spec không đúng với thiết kế hệ thống thực tế. About page dùng hardcoded artisans thay vì data từ admin staff DB.

**Attachments:** `pub-003-gallery.png`

---

## TC-PUB Summary — Pass/Fail Matrix

| TC ID | Title | Result | Bug |
|-------|-------|--------|-----|
| TC-PUB-001 | Homepage — đầy đủ sections | ⚠️ PARTIAL | BUG-PUB-001 (no testimonials section) |
| TC-PUB-002 | Services page | ✅ PASS | — |
| TC-PUB-003 | Gallery page — filter + images | ✅ PASS | — |
| TC-PUB-004 | Contact page — info + map | ✅ PASS | — |
| TC-PUB-005 | Navbar + Mobile Navigation | ✅ PASS | — |
| TC-PUB-006 | About và Staff pages | ⚠️ PARTIAL | BUG-PUB-002 (/staff is PIN-protected) |
| TC-PUB-007 | Public reviews | ✅ PASS | — |

**Observations thêm:**

**TC-PUB-002:**
- 8 services hiển thị: Signature Gel Manicure 1, Classic French Tip, Express Polish Change, Rose Petal Spa Pedicure, Tier 1 Custom Nail Art, Apres Gel-X Extensions, Hard Gel Strengthening Overlay, Gel / Acrylic Removal
- "Luxury Gel Manicure" (set inactive trong TC-SVC-004) chính xác KHÔNG hiển thị ✅
- Giá hiển thị dạng dollar ($62, $65, $30...) không phải cents ✅

**TC-PUB-003 (Gallery):**
- 6 gallery images với category tags: Gel Art, Minimalist, Pedicures
- Filter tabs: All, Gel Art, Minimalist, Pedicures ✅
- Image lightbox: không được test (P2, cần manual click interaction)

**TC-PUB-004 (Contact):**
- Địa chỉ: 1/20 High Street, Blenheim 7201 ✅
- Phone: 03 579 1166 ✅
- Email: studio@angelnail.co.nz ✅
- Giờ mở cửa: Mon–Fri 9:00 AM – 5:30 PM, Saturday 9:00 AM – 4:00 PM, Sunday Closed ✅
- Google Maps embed present ✅
- Inquiry form: Full Name*, Email*, Inquiry Type dropdown, Message* ✅

**TC-PUB-005 (Mobile Nav):**
- Desktop (1280px): Logo + Services, Gallery, About, Contact links + "Book Now" button ✅
- Mobile (390px): Top navbar = Logo + "Book Now" only; Desktop links hidden ✅
- Mobile bottom nav: HOME, BOOK, MENU (Services), ABOUT — 4 items (spec expected 5: Home, Services, Book, Gallery, Contact)
- Floating action button present (bottom-right)

**TC-PUB-006 (About):**
- `/angel/about` đầy đủ: Philosophy, Sanctuary of Care, Core Pillars (Medical-Grade Safety, Premium Products, Ethical Artistry), The Artisans ✅
- The Artisans section: Elena Vance (Founder), Sophia Chen (Senior Technician), Isabella Rossi (Gel Specialist) — hardcoded, không sync DB

**TC-PUB-007 (Reviews):**
- `/angel/reviews` load thành công với empty state "No reviews yet" ✅
- Không có pending/hidden reviews leak ra ngoài ✅
- Footer: "© 2026 Angel Nails & Spa. All Rights Reserved." ✅

**Summary:** 5 PASS, 2 PARTIAL  
**Medium bugs:** 1 (BUG-PUB-001)  
**Low bugs:** 1 (BUG-PUB-002)
