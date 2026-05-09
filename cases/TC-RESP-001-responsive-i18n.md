# TC-RESP — Responsive & Cross-browser Testing

**Module:** Non-functional — UI/UX  
**Standard:** IEEE 829 / ISTQB  
**Version:** 1.0 | **Updated:** 2026-05-09  

---

## Test Matrix — Browsers

| Browser | Version | OS | Priority |
|---------|---------|-----|----------|
| Chrome | Latest | Windows 11 | P0 |
| Chrome | Latest | macOS Sonoma | P0 |
| Safari | 17+ | macOS / iOS 17 | P1 |
| Firefox | Latest | Windows | P1 |
| Edge | Latest | Windows | P2 |
| Chrome Mobile | Latest | Android 14 | P0 |
| Safari Mobile | Latest | iOS 17 | P0 |

## Test Matrix — Viewports

| Device | Width | Priority |
|--------|-------|----------|
| iPhone 14 Pro | 393px | P0 |
| iPhone SE | 375px | P1 |
| iPad (Portrait) | 768px | P1 |
| iPad (Landscape) | 1024px | P2 |
| Laptop | 1280px | P0 |
| Desktop | 1440px | P0 |
| Wide Desktop | 1920px | P2 |

---

## Test Cases

---

### TC-RESP-001 — Admin Sidebar Navigation

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-RESP-001 |
| **Title** | Sidebar hoạt động đúng trên tất cả breakpoints |
| **Priority** | P1 — High |

| Viewport | Expected Sidebar Behavior |
|----------|--------------------------|
| < 768px | Hidden by default, hamburger toggle |
| 768px - 1024px | Collapsed icons / collapsible |
| ≥ 1024px | Expanded, fixed left |

**Test Steps:**
1. Mở Admin tại 375px → Sidebar ẩn
2. Click hamburger → Sidebar slide in với overlay
3. Click overlay → Sidebar ẩn
4. Resize lên 1280px → Sidebar luôn hiển thị
5. Navigate to different modules → Sidebar active state đúng

---

### TC-RESP-002 — Table/List Responsive

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-RESP-002 |
| **Title** | Bảng dữ liệu không tràn ngang trên mobile |
| **Priority** | P1 — High |

| Module | Mobile Behavior Expected |
|--------|-------------------------|
| Appointments list | Scroll ngang hoặc card layout |
| Clients list | Card layout hoặc responsive columns |
| Inventory | Hidden non-essential columns |
| Payments | Scroll ngang hoặc collapsed |
| Audit Log | Collapsed view |

---

### TC-RESP-003 — Forms trên Mobile

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-RESP-003 |
| **Title** | Forms input dễ dùng trên mobile |
| **Priority** | P1 — High |

**Test Steps:**
1. Mở booking form trên 375px
2. Keyboard pop-up không che mất input đang focus
3. Date picker mobile-friendly
4. Dropdown không bị cắt
5. Scrollable form khi content dài
6. Submit button luôn visible

---

### TC-RESP-004 — Cross-browser Compatibility

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-RESP-004 |
| **Title** | Kiểm tra tương thích trên tất cả browsers |
| **Priority** | P1 — High |

**Checklist per Browser:**

| Check | Chrome | Safari | Firefox | Edge |
|-------|--------|--------|---------|------|
| Login form works | ☐ | ☐ | ☐ | ☐ |
| Calendar renders | ☐ | ☐ | ☐ | ☐ |
| File upload works | ☐ | ☐ | ☐ | ☐ |
| Date picker works | ☐ | ☐ | ☐ | ☐ |
| Booking flow E2E | ☐ | ☐ | ☐ | ☐ |
| CSS renders correctly | ☐ | ☐ | ☐ | ☐ |
| No console errors | ☐ | ☐ | ☐ | ☐ |
| Fonts load | ☐ | ☐ | ☐ | ☐ |

---

### TC-RESP-005 — Dark Mode (nếu có)

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-RESP-005 |
| **Title** | Dark mode / system theme không vỡ UI |
| **Priority** | P3 — Low |

**Test Steps:**
1. Bật Dark Mode trên OS
2. Mở Admin panel
3. Kiểm tra text contrast đủ (WCAG AA: 4.5:1)
4. Không có white-on-white hoặc black-on-black
5. Charts vẫn readable

---

### TC-RESP-006 — Accessibility (a11y) Basics

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-RESP-006 |
| **Title** | WCAG 2.1 Level AA cơ bản |
| **Priority** | P2 — Medium |

**Checklist:**

| Check | Expected |
|-------|----------|
| All images có alt text | ☐ |
| Buttons có label rõ ràng | ☐ |
| Form fields có label | ☐ |
| Keyboard navigation (Tab) | ☐ Hoạt động đúng focus order |
| Skip navigation link | ☐ (nếu có) |
| Error messages linked to field | ☐ aria-describedby |
| Color không phải cách duy nhất truyền thông tin | ☐ |
| Contrast ratio text ≥ 4.5:1 | ☐ |
