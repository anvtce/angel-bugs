# TC-VOICE — Voice Agent (Tổng đài AI)

**Module:** Voice Agent  
**URL:** `https://project.vinapage.com/angel/admin/voice`  
**Standard:** IEEE 829 / ISTQB  
**Version:** 1.0 | **Updated:** 2026-05-09  
**Roles:** ADMIN, MANAGER  

---

## Test Cases

---

### TC-VOICE-001 — Cấu hình Voice Agent

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-VOICE-001 |
| **Title** | Cấu hình giọng nói và ngôn ngữ cho AI |
| **Priority** | P2 — Medium |
| **Type** | Functional |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Truy cập `/angel/admin/voice` | Trang cấu hình voice agent |
| 2 | Chọn giọng: Female NZ English | Option available |
| 3 | Chọn ngôn ngữ: English (New Zealand) | Language set |
| 4 | Save config | Cấu hình lưu |
| 5 | Kiểm tra call test (nếu có test mode) | Giọng và ngôn ngữ đúng |

---

### TC-VOICE-002 — Xem Transcript cuộc gọi

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-VOICE-002 |
| **Title** | Transcript cuộc gọi hiển thị đầy đủ |
| **Priority** | P1 — High |
| **Type** | Functional |
| **Preconditions** | Có ≥1 cuộc gọi được log |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Mở tab "Call History" / "Transcripts" | Danh sách cuộc gọi |
| 2 | Click vào 1 cuộc gọi | Transcript text hiển thị |
| 3 | Kiểm tra transcript | Conversation dạng Q&A: AI vs Caller |
| 4 | Kiểm tra metadata | Ngày giờ gọi, thời lượng, số gọi đến |
| 5 | Kiểm tra kết quả | Booking được tạo / không tạo |

---

### TC-VOICE-003 — Chuyển booking từ Voice sang hệ thống

| Field | Value |
|-------|-------|
| **Test Case ID** | TC-VOICE-003 |
| **Title** | Booking từ Voice Agent tự động vào Appointments |
| **Priority** | P0 — Critical |
| **Type** | Integration / E2E |

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Cuộc gọi: AI nhận booking thành công qua điện thoại | Transcript ghi nhận thông tin |
| 2 | Kiểm tra Appointments module | Booking mới xuất hiện với source=VOICE |
| 3 | Kiểm tra thông tin booking | Tên, SĐT, dịch vụ, ngày giờ đúng với transcript |
| 4 | Kiểm tra Audit Log | Action CREATE booking by VOICE_AGENT |
| 5 | Kiểm tra khách nhận email xác nhận | Email gửi đến số điện thoại / SMS |
