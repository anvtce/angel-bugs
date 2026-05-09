// Usage: node create-issues.js <github_token>
const https = require('https');
const fs = require('fs');
const path = require('path');

const TOKEN = process.argv[2] || require('fs').readFileSync(require('path').join(__dirname, '.token'), 'utf8').trim();
const REPO = 'anvtce/angel-bugs';
const BRANCH = 'qa/recordings-gifs';
const RAW_BASE = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/recordings`;

function api(method, endpoint, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: 'api.github.com',
      path: endpoint,
      method,
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'User-Agent': 'bug-recorder-script',
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
      }
    };
    const req = https.request(opts, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(d) }); }
        catch(e) { resolve({ status: res.statusCode, body: d }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function uploadGif(filename) {
  const filePath = path.join(__dirname, filename);
  const content = fs.readFileSync(filePath).toString('base64');
  const repoPath = `/repos/${REPO}/contents/recordings/${filename}`;
  // Check if file exists
  const check = await api('GET', repoPath + `?ref=${BRANCH}`);
  const body = {
    message: `Add ${filename} bug recording`,
    content,
    branch: BRANCH,
    ...(check.status === 200 ? { sha: check.body.sha } : {})
  };
  const res = await api('PUT', repoPath, body);
  if (res.status === 201 || res.status === 200) {
    console.log(`  ✅ uploaded ${filename}`);
    return `${RAW_BASE}/${filename}`;
  } else {
    console.log(`  ⚠️  ${filename}: ${res.status} ${JSON.stringify(res.body).slice(0,80)}`);
    return `${RAW_BASE}/${filename}`;
  }
}

async function createLabel(name, color, description) {
  const res = await api('POST', `/repos/${REPO}/labels`, { name, color, description });
  if (res.status === 201) console.log(`  label created: ${name}`);
  else if (res.status === 422) console.log(`  label exists: ${name}`);
}

async function createIssue(title, body, labels) {
  const res = await api('POST', `/repos/${REPO}/issues`, { title, body, labels });
  if (res.status === 201) {
    console.log(`  ✅ #${res.body.number} ${title}`);
    return res.body.html_url;
  } else {
    console.log(`  ❌ FAILED ${title}: ${res.status}`);
    return null;
  }
}

async function ensureBranch() {
  // Get master SHA
  const ref = await api('GET', `/repos/${REPO}/git/ref/heads/master`);
  if (ref.status !== 200) { console.error('Cannot get master SHA'); process.exit(1); }
  const sha = ref.body.object.sha;
  // Create branch
  const br = await api('POST', `/repos/${REPO}/git/refs`, {
    ref: `refs/heads/${BRANCH}`, sha
  });
  if (br.status === 201) console.log(`  branch created: ${BRANCH}`);
  else if (br.status === 422) console.log(`  branch exists: ${BRANCH}`);
  else console.log(`  branch: ${br.status}`);
}

const ISSUES = [
  {
    title: '[BUG-AUTH-003] [P0-CRITICAL] Sign out returns 405 — session không bị hủy',
    labels: ['bug', 'P0-Critical', 'module:auth'],
    gif: 'bug-auth003.gif',
    body: (gif) => `## 🔴 BUG-AUTH-003 — Sign out 405 Not Allowed (CRITICAL)

**Module:** Authentication | **Severity:** Critical | **Priority:** P0
**Status:** Open | **TC:** TC-AUTH-008

### Steps to Reproduce
1. Đăng nhập với ADMIN account (\`elena@angelnail.co.nz\`)
2. Click Account menu (icon avatar góc trên phải)
3. Click **"Sign out"**
4. Trang xác nhận NextAuth hiển thị tại \`/angel/api/auth/signout?callbackUrl=...\`
5. Click nút **"Sign out"** xác nhận

### Actual Result
- URL redirect đến \`/api/auth/signout\` (thiếu \`/angel\` basePath prefix)
- Response: **405 Not Allowed**
- Session **KHÔNG** bị hủy — vẫn truy cập được \`/angel/admin\`

### Expected Result
- Session bị hủy → redirect về \`/angel/admin/login\`

### Root Cause
NextAuth thiếu cấu hình \`basePath: '/angel'\`. Form action submit đến \`/api/auth/signout\` thay vì \`/angel/api/auth/signout\`.

### Security Risk
⚠️ **Session hijacking risk** — user không thể logout qua UI, session tồn tại vô thời hạn.

### Recording
![BUG-AUTH-003 demo](${gif})
`
  },
  {
    title: '[BUG-APT-001] [P0-CRITICAL] Service dropdown hiển thị "— ( min)" — không thể tạo/sửa booking',
    labels: ['bug', 'P0-Critical', 'module:appointments'],
    gif: 'bug-apt001.gif',
    body: (gif) => `## 🔴 BUG-APT-001 — Broken Service Dropdown (CRITICAL)

**Module:** Appointments | **Severity:** Critical | **Priority:** P0
**Status:** Open | **TC:** TC-APT-002, TC-APT-008

### Steps to Reproduce
1. Vào \`/angel/admin/appointments\`
2. Click **"+ Tạo lịch hẹn"**
3. Quan sát dropdown **"Chọn dịch vụ *"**

### Actual Result
\`\`\`
Option 1: "— ( min)"
Option 2: "— ( min)"
Option 3: "— ( min)"
Option 4: "— ( min)"
Option 5: "— ( min)"
\`\`\`
Edit form: service hiện tại **không được pre-filled**.

### Expected Result
\`\`\`
Option 1: "Signature Gel Manicure 1 — 45 min"
Option 2: "Classic French Tip — 60 min"
...
\`\`\`

### Root Cause
API \`GET /api/admin/services\` trả về **categories** (5 records) với nested services.
Code dùng \`service.title\` và \`service.duration\` trên category objects → render thành \`undefined — undefined ( min)\`.

**Fix:** flatten \`categories[].services[]\` trước khi populate dropdown.

### Impact
Admin **không thể tạo hoặc chỉnh sửa bất kỳ booking nào** từ admin panel.

### Recording
![BUG-APT-001 demo](${gif})
`
  },
  {
    title: '[BUG-BK-001] [P0-CRITICAL] Booking time hiển thị UTC (3:00 am) thay vì giờ địa phương (10:00 AM)',
    labels: ['bug', 'P0-Critical', 'module:booking'],
    gif: 'bug-bk001.gif',
    body: (gif) => `## 🔴 BUG-BK-001 — Timezone Display Bug (CRITICAL)

**Module:** Booking Flow | **Severity:** Critical | **Priority:** P0
**Status:** Open | **TC:** TC-BK-005, TC-BK-008

### Steps to Reproduce
1. Thực hiện booking flow: chọn service, staff (No Preference)
2. Chọn ngày 14/05/2026, chọn slot **10:00 AM**
3. Điền thông tin → Confirm Booking
4. Quan sát success page

### Actual Result
- Success page hiển thị: **TIME: 3:00 am**
- API stored: \`"2026-05-14T00:00:00.000Z"\`

### Expected Result
- Hiển thị: **10:00 AM** (đúng với slot đã chọn)

### Root Cause
Server UTC+7 xử lý "10:00 AM" → lưu \`10:00 - 7h = 03:00 UTC\`.
Trang success render trực tiếp UTC timestamp, không convert về NZ timezone (UTC+12/+13).

### Impact
Khách hàng NZ nhận confirmation với giờ sai 7 tiếng → có thể đến sai giờ hẹn.

### Recording
![BUG-BK-001 demo](${gif})
`
  },
  {
    title: '[BUG-AUTH-001] [P1-HIGH] Wrong password: chỉ viền đỏ, không có text error message',
    labels: ['bug', 'P1-High', 'module:auth'],
    gif: 'bug-auth001.gif',
    body: (gif) => `## 🟠 BUG-AUTH-001 — Missing Error Message on Wrong Password

**Module:** Auth | **Severity:** High | **Priority:** P1
**Status:** Open | **TC:** TC-AUTH-004

### Steps to Reproduce
1. Vào \`/angel/admin/login\`
2. Nhập email: \`elena@angelnail.co.nz\`
3. Nhập password: \`wrongpassword\`
4. Click **"ĐĂNG NHẬP"**

### Actual Result
- Password field hiển thị viền đỏ (rose border)
- **Không có text error message** ("Invalid credentials", v.v.)
- Screen reader không thể đọc lý do thất bại (no ARIA alert)

### Expected Result
- Hiện message: _"Email hoặc mật khẩu không đúng"_ với \`role="alert"\`

### Recording
![BUG-AUTH-001 demo](${gif})
`
  },
  {
    title: '[BUG-AUTH-004] [P1-HIGH] Change password không yêu cầu xác minh mật khẩu hiện tại',
    labels: ['bug', 'P1-High', 'module:auth', 'security'],
    gif: 'bug-auth004.gif',
    body: (gif) => `## 🟠 BUG-AUTH-004 — Change Password Missing Current Password Verification

**Module:** Auth | **Severity:** High | **Priority:** P1 | **Security Issue**
**Status:** Open | **TC:** TC-AUTH-009

### Steps to Reproduce
1. Đăng nhập với bất kỳ account
2. Account menu → **"Change password"**
3. Quan sát form: chỉ có **New password** và **Confirm new password**
4. Nhập mật khẩu mới → Submit → **Thành công** (không cần mật khẩu cũ)

### Actual Result
- Form chỉ có 2 fields, **không có "Current password"**
- Mật khẩu thay đổi thành công mà không verify current password

### Expected Result
- Form phải có field **"Current password"** (bắt buộc)
- Backend xác minh trước khi cho phép thay đổi

### Security Impact
Nếu session bị chiếm (XSS, session hijacking), kẻ tấn công có thể **đổi mật khẩu và chiếm tài khoản** mà không biết mật khẩu gốc.

### Recording
![BUG-AUTH-004 demo](${gif})
`
  },
  {
    title: '[BUG-APT-002] [P1-HIGH] Edit appointment form không pre-fill service đã chọn',
    labels: ['bug', 'P1-High', 'module:appointments'],
    gif: 'bug-apt001.gif',
    body: (_gif) => `## 🟠 BUG-APT-002 — Edit Form Service Not Pre-filled

**Module:** Appointments | **Severity:** High | **Priority:** P1
**Status:** Open | **TC:** TC-APT-008
**Linked:** BUG-APT-001 (same root cause)

### Steps to Reproduce
1. Filter ngày **27/03/2026**
2. Click **"Edit"** trên booking Sophia Laurent (Signature Gel Manicure 1)
3. Modal mở

### Actual Result
- Fields pre-filled: Tên, Email, SĐT, Staff, Ngày, Giờ ✅
- **Dịch vụ:** hiển thị placeholder _"Chọn dịch vụ *"_ ❌

### Expected Result
- Field dịch vụ phải pre-fill: _"Signature Gel Manicure 1"_

### Note
Bug này được fix đồng thời khi fix BUG-APT-001 (flatten services array).
`
  },
  {
    title: '[BUG-STF-001] [P1-HIGH] Form nhân viên không có field gán dịch vụ chuyên môn',
    labels: ['bug', 'P1-High', 'module:staff'],
    gif: 'bug-stf002.gif',
    body: (_gif) => `## 🟠 BUG-STF-001 — No Service Specialties Field in Staff Form

**Module:** Staff Management | **Severity:** High | **Priority:** P1
**Status:** Open | **TC:** TC-STF-003

### Steps to Reproduce
1. Vào \`/angel/admin/staff\`
2. Click **"Thêm nhân viên"** hoặc **"Edit"** trên staff bất kỳ
3. Quan sát form

### Actual Result
Form không có field/section để **gán dịch vụ chuyên môn** cho nhân viên.

### Expected Result
- Checklist hoặc multi-select các dịch vụ mà nhân viên có thể thực hiện
- Booking flow phải filter staff theo services được gán

### Impact
Booking flow hiện hiển thị tất cả staff cho mọi service (không filter theo specialty).
`
  },
  {
    title: '[BUG-STF-002] [P1-HIGH] Xóa nhân viên có active booking không có cảnh báo',
    labels: ['bug', 'P1-High', 'module:staff'],
    gif: 'bug-stf002.gif',
    body: (gif) => `## 🟠 BUG-STF-002 — Delete Staff With Active Bookings No Warning

**Module:** Staff Management | **Severity:** High | **Priority:** P1
**Status:** Open | **TC:** TC-STF-005

### Steps to Reproduce
1. Vào \`/angel/admin/staff\`
2. Quan sát Elena Rossi (23 lịch hẹn), Maya Chen (8 lịch hẹn)
3. Click nút **delete** trực tiếp

### Actual Result
- Nút delete **không có icon cảnh báo** hay trạng thái disabled
- **Không có confirmation dialog** trước khi xóa
- Không kiểm tra xem nhân viên có active bookings không

### Expected Result
- Nếu staff có active bookings: hiện warning _"Nhân viên này có X lịch hẹn đang chờ. Bạn có chắc muốn xóa?"_
- Hoặc block deletion cho đến khi reassign bookings

### Impact
Data integrity risk — xóa staff để lại orphaned bookings không có KTV.

### Recording
![BUG-STF-002 demo](${gif})
`
  },
  {
    title: '[BUG-BK-002] [P1-HIGH] Enhancement add-on không được tính vào tổng giá booking',
    labels: ['bug', 'P1-High', 'module:booking'],
    gif: 'bug-bk001.gif',
    body: (_gif) => `## 🟠 BUG-BK-002 — Enhancement Add-on Not Included in Total Price

**Module:** Booking Flow | **Severity:** High | **Priority:** P1
**Status:** Open | **TC:** TC-BK-001, TC-BK-005

### Steps to Reproduce
1. Bước 1: Chọn _Signature Gel Manicure 1_ ($62)
2. Click **"Add to Booking"** Enhancement _Paraffin Wax_ ($15)
3. Footer hiển thị **$77.00** ✅
4. Hoàn thành booking → kiểm tra success page và admin

### Actual Result
- Success page: chỉ hiển thị $62 (Paraffin Wax không xuất hiện)
- Admin API: \`totalPrice: 6200\` ($62 only)
- Enhancement chỉ được lưu trong \`notes\` field dưới dạng text

### Expected Result
- \`totalPrice: 7700\` ($77)
- Enhancement là line item riêng, không chỉ là text note

### Business Impact
Mỗi booking có Paraffin Wax bị hụt doanh thu $15. Báo cáo doanh thu sai.
`
  },
  {
    title: '[BUG-AUTH-002] [P2-MEDIUM] Submit form đăng nhập trống không hiện validation errors',
    labels: ['bug', 'P2-Medium', 'module:auth'],
    body: (_gif) => `## 🟡 BUG-AUTH-002 — No Validation Errors on Empty Login Submit

**Module:** Auth | **Severity:** Medium | **Priority:** P2
**Status:** Open | **TC:** TC-AUTH-006

### Steps to Reproduce
1. Vào \`/angel/admin/login\`
2. Không nhập gì
3. Click **"ĐĂNG NHẬP"**

### Actual Result
- Không có error message nào xuất hiện
- Page không thay đổi visual (không viền đỏ, không text lỗi)
- Submit bị chặn ngầm mà không thông báo lý do

### Expected Result
Validation errors: _"Email là bắt buộc"_, _"Mật khẩu là bắt buộc"_

### Note
Pattern này lặp lại ở TC-SVC-001, TC-BK-004 — missing validation messages là cross-module issue.
`
  },
  {
    title: '[BUG-DASH-001] [P2-MEDIUM] URL param ?status=PENDING không được áp dụng vào filter Appointments',
    labels: ['bug', 'P2-Medium', 'module:dashboard'],
    body: (_gif) => `## 🟡 BUG-DASH-001 — URL Param status=PENDING Not Applied to Filter

**Module:** Dashboard | **Severity:** Medium | **Priority:** P2
**Status:** Open | **TC:** TC-DASH-003

### Steps to Reproduce
1. Dashboard → click link **"Pending bookings 1"**
2. Redirect đến \`/angel/admin/appointments?status=PENDING\`
3. Quan sát filter dropdown

### Actual Result
- Status filter dropdown vẫn hiển thị **"All statuses"** (không filter PENDING)
- Tất cả appointments hiển thị, không chỉ PENDING

### Expected Result
- Page mount → đọc URL param \`status=PENDING\` → apply filter tự động

### Fix Suggestion
Trên component mount, đọc \`useSearchParams()\` và set filter state tương ứng.
`
  },
  {
    title: '[BUG-SVC-001] [P2-MEDIUM] Form dịch vụ không hiển thị validation error messages',
    labels: ['bug', 'P2-Medium', 'module:services'],
    body: (_gif) => `## 🟡 BUG-SVC-001 — Service Form Missing Validation Error Messages

**Module:** Services | **Severity:** Medium | **Priority:** P2
**Status:** Open | **TC:** TC-SVC-002

### Steps to Reproduce
1. Vào \`/angel/admin/services\`
2. Click **"Thêm dịch vụ"**
3. Bỏ trống các required fields
4. Submit form

### Actual Result
- Form submission bị chặn ✅
- **Không có inline error messages** dưới các field bắt buộc

### Expected Result
- Hiện validation errors: _"Tên dịch vụ là bắt buộc"_, _"Giá là bắt buộc"_, v.v.

### Note
Cùng pattern với BUG-AUTH-002 và BUG-BK-004 — validation logic hoạt động nhưng không render error messages.
`
  },
  {
    title: '[BUG-SVC-002] [P2-MEDIUM] Không có chức năng đổi tên hoặc xóa Category',
    labels: ['bug', 'P2-Medium', 'module:services'],
    body: (_gif) => `## 🟡 BUG-SVC-002 — Cannot Rename or Delete Service Categories

**Module:** Services | **Severity:** Medium | **Priority:** P2
**Status:** Open | **TC:** TC-SVC-006

### Steps to Reproduce
1. Vào \`/angel/admin/services\`
2. Click **"Thêm danh mục"**
3. Nhập tên → Tạo thành công
4. Thử đổi tên hoặc xóa category vừa tạo

### Actual Result
- Tạo mới category hoạt động ✅
- **Không có option** để edit/delete/rename category header
- Hậu quả: category "Test Category QA" còn tồn tại trong booking flow (tab rỗng)

### Expected Result
- Mỗi category header có nút **edit** (đổi tên) và **delete** (xóa nếu không có services)
`
  },
  {
    title: '[BUG-PUB-001] [P2-MEDIUM] Homepage không có section Testimonials/Reviews',
    labels: ['bug', 'P2-Medium', 'module:public-site'],
    body: (_gif) => `## 🟡 BUG-PUB-001 — Homepage Missing Testimonials Section

**Module:** Public Site | **Severity:** Medium | **Priority:** P2
**Status:** Open | **TC:** TC-PUB-001

### Steps to Reproduce
1. Truy cập \`https://project.vinapage.com/angel\`
2. Scroll toàn bộ homepage

### Actual Result
- Section Testimonials/Reviews **không tồn tại** trên homepage
- Page có: Hero, Services preview, Gallery preview, CTA booking

### Expected Result
- Homepage có section hiển thị customer reviews/testimonials theo spec

### Note
Reviews page \`/angel/reviews\` tồn tại và có data — chỉ cần embed widget trên homepage.
`
  },
  {
    title: '[BUG-SET-001] [P3-LOW] Opening hours subtitle "24h format" nhưng UI dùng 12h AM/PM',
    labels: ['bug', 'P3-Low', 'module:settings'],
    body: (_gif) => `## 🟢 BUG-SET-001 — Misleading Opening Hours Format Label

**Module:** Settings | **Severity:** Low | **Priority:** P3
**Status:** Open | **TC:** TC-SET-002

### Steps to Reproduce
1. Vào \`/angel/admin/settings\`
2. Tab **Opening Hours**
3. Đọc subtitle của time input fields

### Actual Result
- Subtitle hiển thị: _"24h format"_
- Nhưng UI sử dụng **12h AM/PM** inputs

### Expected Result
- Label phải là _"12h format"_ hoặc inputs phải switch sang 24h
`
  },
  {
    title: '[BUG-PUB-002] [P3-LOW] /angel/staff là PIN-protected schedule, không phải public staff listing',
    labels: ['bug', 'P3-Low', 'module:public-site'],
    body: (_gif) => `## 🟢 BUG-PUB-002 — /angel/staff Is PIN-Protected, Not Public Staff Page

**Module:** Public Site | **Severity:** Low | **Priority:** P3
**Status:** Open | **TC:** TC-PUB-006

### Steps to Reproduce
1. Truy cập \`https://project.vinapage.com/angel/staff\` (public URL)

### Actual Result
- Trang yêu cầu **PIN** để truy cập lịch làm việc cá nhân
- Đây là staff self-service schedule, **không phải** public staff listing

### Expected Result
Theo spec: trang giới thiệu danh sách nhân viên công khai (tên, ảnh, chuyên môn).

### Options
1. Tạo public staff listing mới tại \`/angel/our-team\`
2. Cập nhật spec để bỏ yêu cầu public staff page
`
  }
];

async function main() {
  if (!TOKEN) { console.error('Usage: node create-issues.js <token>'); process.exit(1); }

  console.log('\n=== Step 1: Ensure branch exists ===');
  await ensureBranch();

  console.log('\n=== Step 2: Upload GIFs ===');
  const gifUrls = {};
  const gifs = ['bug-auth003.gif','bug-apt001.gif','bug-bk001.gif','bug-auth001.gif','bug-auth004.gif','bug-stf002.gif'];
  for (const g of gifs) {
    gifUrls[g] = await uploadGif(g);
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\n=== Step 3: Create labels ===');
  const labels = [
    ['bug','d73a4a','Confirmed bug'],
    ['P0-Critical','b60205','Must fix before go-live'],
    ['P1-High','e4e669','Must fix before UAT'],
    ['P2-Medium','fbca04','Fix after UAT'],
    ['P3-Low','0075ca','UX improvement'],
    ['module:auth','c5def5','Authentication module'],
    ['module:appointments','c5def5','Appointments module'],
    ['module:booking','c5def5','Public booking flow'],
    ['module:staff','c5def5','Staff management'],
    ['module:services','c5def5','Services module'],
    ['module:dashboard','c5def5','Dashboard'],
    ['module:settings','c5def5','Settings module'],
    ['module:public-site','c5def5','Public website'],
    ['security','ee0701','Security vulnerability'],
  ];
  for (const [name, color, description] of labels) {
    await createLabel(name, color, description);
    await new Promise(r => setTimeout(r, 200));
  }

  console.log('\n=== Step 4: Create 16 GitHub issues ===');
  const urls = [];
  for (const issue of ISSUES) {
    const gif = issue.gif ? gifUrls[issue.gif] : null;
    const body = issue.body(gif);
    const url = await createIssue(issue.title, body, issue.labels || ['bug']);
    if (url) urls.push(url);
    await new Promise(r => setTimeout(r, 800));
  }

  console.log('\n=== Done! ===');
  console.log(`Created ${urls.length}/${ISSUES.length} issues:`);
  urls.forEach(u => console.log(' ', u));
}

main().catch(e => { console.error(e); process.exit(1); });
