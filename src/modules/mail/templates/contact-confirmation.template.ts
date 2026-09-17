import { Contact } from '../../contact/entities/contact.entity';

export function renderContactConfirmationTemplate(contact: Contact): string {
  const currentYear = new Date().getFullYear();

  const formattedDate = contact.createdAt
    ? new Date(contact.createdAt).toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

  const logoBlack =
    'https://ik.imagekit.io/po0s6zxoj/vdcd/logo/VDCD_gialai_black.png?updatedAt=1785394233236';
  const logoWhite =
    'https://ik.imagekit.io/po0s6zxoj/vdcd/logo/VDCD_gialai_white.png?updatedAt=1785394233214';

  const fontFamily =
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>VDCD Group — Xác nhận yêu cầu liên hệ</title>
  <style>
    :root { color-scheme: light dark; supported-color-schemes: light dark; }
    @media (prefers-color-scheme: dark) {
      .email-body { background-color: #1a1a1a !important; }
      .text-primary { color: #f0f0f0 !important; }
      .text-secondary { color: #a0a0a0 !important; }
      .text-muted { color: #787878 !important; }
      .border-subtle { border-color: #333333 !important; }
      .bg-banner { background-color: #0a4a2e !important; }
      .bg-card { background-color: #242424 !important; border-color: #333333 !important; }
      .logo-light { display: block !important; }
      .logo-dark { display: none !important; }
    }
    [data-ogsc] .logo-light { display: block !important; }
    [data-ogsc] .logo-dark { display: none !important; }
    [data-ogsb] .logo-light { display: block !important; }
    [data-ogsb] .logo-dark { display: none !important; }
  </style>
</head>
<body class="email-body" style="margin:0; padding:0; background-color:#ffffff; font-family:${fontFamily}; color:#1b1b1d; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;">

  <table border="0" cellpadding="0" cellspacing="0" width="100%" class="email-body" style="background-color:#ffffff;">
    <tr>
      <td align="left" style="padding:40px 24px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:700px; margin:0 auto;">
          
          <!-- Header Row -->
          <tr>
            <td style="padding-bottom:32px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <!-- Dark logo (for light theme) with subtle contrast glow for dark mode fallbacks -->
                    <div class="logo-dark" style="display: block;">
                      <img src="${logoBlack}" alt="VDCD Group" width="360" style="display:block; width:360px; max-width:100%; height:auto; border:0; filter: drop-shadow(0 0 1px #ffffff) drop-shadow(0 0 2px #ffffff);" />
                    </div>
                    <!-- Light logo (for dark theme) -->
                    <!--[if !mso]><!-->
                    <div class="logo-light" style="display: none; mso-hide: all;">
                      <img src="${logoWhite}" alt="VDCD Group" width="360" style="display:block; width:360px; max-width:100%; height:auto; border:0;" />
                    </div>
                    <!--<![endif]-->
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <span class="text-muted" style="font-family:${fontFamily}; font-size:12px; font-weight:600; color:#505f76; letter-spacing:0.5px;">
                      Gia Lai Innovation Center
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Success Banner -->
          <tr>
            <td class="bg-banner" style="background-color:#0d5c3a; padding:28px 32px; border-radius:8px 8px 0 0; color:#ffffff;">
              <h1 style="margin:0 0 8px 0; font-size:22px; font-weight:700; font-family:${fontFamily};">
                Xác Nhận Đã Nhận Yêu Cầu Liên Hệ
              </h1>
              <p style="margin:0; font-size:14px; opacity:0.9; line-height:1.5;">
                Cảm ơn bạn đã liên hệ với VDCD Group
              </p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td class="bg-card" style="background-color:#f9fafb; padding:32px; border:1px solid #e5e7eb; border-top:none; border-radius:0 0 8px 8px;">
              <p class="text-primary" style="margin:0 0 16px 0; font-size:15px; line-height:1.6; font-weight:500;">
                Xin chào <strong>${escapeHtml(contact.fullName)}</strong>,
              </p>
              <p class="text-secondary" style="margin:0 0 20px 0; font-size:14px; line-height:1.6; color:#374151;">
                VDCD Group đã nhận được thông tin liên hệ của bạn vào lúc <strong>${formattedDate}</strong>.
              </p>
              <p class="text-secondary" style="margin:0 0 24px 0; font-size:14px; line-height:1.6; color:#374151;">
                Đội ngũ tư vấn của chúng tôi sẽ phản hồi lại bạn qua Email hoặc Số điện thoại trong thời gian sớm nhất.
              </p>

              <!-- Summary Box -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#ffffff; border:1px solid #e5e7eb; border-radius:6px; margin-bottom:24px; font-size:14px;">
                <tr>
                  <td class="text-primary" style="padding:16px 20px; border-bottom:1px solid #f3f4f6; font-weight:600; color:#111827;">
                    Nội dung yêu cầu
                  </td>
                </tr>
                <tr>
                  <td class="text-secondary" style="padding:16px 20px; color:#4b5563; line-height:1.8;">
                    <strong>• Họ và tên:</strong> ${escapeHtml(contact.fullName)}<br>
                    <strong>• Email:</strong> ${escapeHtml(contact.email)}<br>
                    ${contact.phone ? `<strong>• Số điện thoại:</strong> ${escapeHtml(contact.phone)}<br>` : ''}
                    ${contact.subject ? `<strong>• Chủ đề:</strong> ${escapeHtml(contact.subject)}<br>` : ''}
                    ${contact.message ? `<strong>• Lời nhắn:</strong> ${escapeHtml(contact.message)}<br>` : ''}
                    ${contact.attachment ? `<strong>• Tệp đính kèm:</strong> <a href="${escapeHtml(contact.attachment)}" style="color:#0d5c3a; text-decoration:underline;" target="_blank">Xem tệp đính kèm</a><br>` : ''}
                  </td>
                </tr>
              </table>

              <p class="text-secondary" style="margin:0 0 8px 0; font-size:14px; line-height:1.6; color:#374151;">
                Trân trọng,
              </p>
              <p style="margin:0; font-size:14px; font-weight:700; color:#0d5c3a;">
                Đội ngũ Hỗ trợ — VDCD Group
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="border-subtle" style="border-top:1px solid #e5e7eb; padding-top:28px; padding-bottom:16px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding-bottom:12px;">
                    <div class="text-primary" style="font-family:${fontFamily}; font-size:14px; font-weight:700; color:#111827; margin-bottom:4px;">
                      Trung tâm Đổi mới Sáng tạo Gia Lai
                    </div>
                    <div class="text-secondary" style="font-family:${fontFamily}; font-size:13px; color:#4b5563; margin-bottom:8px;">
                      Kiến tạo tương lai số bền vững cho doanh nghiệp và cộng đồng.
                    </div>
                    <div class="text-secondary" style="font-family:${fontFamily}; font-size:12px; color:#6b7280; margin-bottom:4px; line-height:1.5;">
                      📍 Số 226 Đống Đa, Phường Quy Nhơn, Tỉnh Gia Lai
                    </div>
                    <div class="text-secondary" style="font-family:${fontFamily}; font-size:12px; color:#6b7280; line-height:1.5;">
                      ✉️ <a href="mailto:dmstgialai@vdcd.vn" style="color:inherit; text-decoration:none;">dmstgialai@vdcd.vn</a> &nbsp;|&nbsp; 📞 <a href="tel:0373600099" style="color:inherit; text-decoration:none;">0373600099</a> &nbsp;|&nbsp; 🌐 <a href="https://doimoisangtaogialai.vn" style="color:#0d5c3a; text-decoration:none;" target="_blank">doimoisangtaogialai.vn</a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="border-subtle" style="border-top:1px solid #f3f4f6; padding-top:12px;">
                    <p class="text-muted" style="margin:0; font-size:11px; color:#9ca3af; font-family:${fontFamily};">
                      © ${currentYear} Trung tâm Đổi mới Sáng tạo Gia Lai — VDCD Group. Tất cả quyền được bảo lưu.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
