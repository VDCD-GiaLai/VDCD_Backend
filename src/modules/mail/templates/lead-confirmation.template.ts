import { Lead } from '../../lead/entities/lead.entity';

export function renderLeadConfirmationTemplate(lead: Lead): string {
  const currentYear = new Date().getFullYear();

  const formattedDate = lead.createdAt
    ? new Date(lead.createdAt).toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

  const formattedDob = lead.dob
    ? new Date(lead.dob).toLocaleDateString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : null;

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
  <title>VDCD Group — Xác nhận nhận hồ sơ ứng tuyển</title>
  <style>
    :root { color-scheme: light dark; }
    @media (prefers-color-scheme: dark) {
      .email-body { background-color: #1a1a1a !important; }
      .text-primary { color: #f0f0f0 !important; }
      .text-secondary { color: #a0a0a0 !important; }
      .text-muted { color: #787878 !important; }
      .border-subtle { border-color: #333333 !important; }
      .bg-banner { background-color: #0a4a2e !important; }
      .bg-card { background-color: #242424 !important; border-color: #333333 !important; }
      .logo-light { display: block !important; max-height: none !important; overflow: visible !important; }
      .logo-dark { display: none !important; max-height: 0 !important; overflow: hidden !important; }
    }
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
                    <img class="logo-dark" src="${logoBlack}" alt="VDCD Group" width="180" height="45" style="display:block; width:180px; height:auto; border:0;" />
                    <img class="logo-light" src="${logoWhite}" alt="VDCD Group" width="180" height="45" style="display:none; width:180px; height:auto; border:0; max-height:0; overflow:hidden;" />
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
                Xác Nhận Đã Nhận Hồ Sơ Ứng Tuyển
              </h1>
              <p style="margin:0; font-size:14px; opacity:0.9; line-height:1.5;">
                Cảm ơn bạn đã quan tâm và ứng tuyển tại VDCD Group
              </p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td class="bg-card" style="background-color:#f9fafb; padding:32px; border:1px solid #e5e7eb; border-top:none; border-radius:0 0 8px 8px;">
              <p class="text-primary" style="margin:0 0 16px 0; font-size:15px; line-height:1.6; font-weight:500;">
                Xin chào <strong>${escapeHtml(lead.fullName)}</strong>,
              </p>
              <p class="text-secondary" style="margin:0 0 20px 0; font-size:14px; line-height:1.6; color:#374151;">
                VDCD Group đã nhận được hồ sơ ứng tuyển vị trí <strong>${escapeHtml(lead.subject || 'Ứng tuyển')}</strong> của bạn gửi vào lúc <strong>${formattedDate}</strong>.
              </p>
              <p class="text-secondary" style="margin:0 0 24px 0; font-size:14px; line-height:1.6; color:#374151;">
                Bộ phận Tuyển dụng sẽ tiến hành đánh giá hồ sơ và chủ động liên hệ lại với bạn qua Email hoặc Số điện thoại trong thời gian sớm nhất nếu hồ sơ phù hợp.
              </p>

              <!-- Application Summary Box -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#ffffff; border:1px solid #e5e7eb; border-radius:6px; margin-bottom:24px; font-size:14px;">
                <tr>
                  <td class="text-primary" style="padding:16px 20px; border-bottom:1px solid #f3f4f6; font-weight:600; color:#111827;">
                    Thông tin hồ sơ đã ghi nhận
                  </td>
                </tr>
                <tr>
                  <td class="text-secondary" style="padding:16px 20px; color:#4b5563; line-height:1.8;">
                    <strong>• Họ và tên:</strong> ${escapeHtml(lead.fullName)}<br>
                    <strong>• Email:</strong> ${escapeHtml(lead.email)}<br>
                    ${lead.phone ? `<strong>• Số điện thoại:</strong> ${escapeHtml(lead.phone)}<br>` : ''}
                    <strong>• Vị trí / Tiêu đề:</strong> ${escapeHtml(lead.subject || 'N/A')}<br>
                    ${formattedDob ? `<strong>• Ngày sinh:</strong> ${formattedDob}<br>` : ''}
                    ${lead.address ? `<strong>• Địa chỉ:</strong> ${escapeHtml(lead.address)}<br>` : ''}
                    ${lead.experienceYears ? `<strong>• Kinh nghiệm:</strong> ${escapeHtml(lead.experienceYears)}<br>` : ''}
                    ${lead.expectedSalary ? `<strong>• Mức lương mong muốn:</strong> ${escapeHtml(lead.expectedSalary)}<br>` : ''}
                    ${lead.portfolioUrl ? `<strong>• Portfolio:</strong> <a href="${escapeHtml(lead.portfolioUrl)}" style="color:#0d5c3a; text-decoration:underline;" target="_blank">${escapeHtml(lead.portfolioUrl)}</a><br>` : ''}
                    ${lead.attachment ? `<strong>• Tệp CV đính kèm:</strong> <a href="${escapeHtml(lead.attachment)}" style="color:#0d5c3a; text-decoration:underline;" target="_blank">Xem tập tin CV</a><br>` : ''}
                  </td>
                </tr>
              </table>

              <p class="text-secondary" style="margin:0 0 8px 0; font-size:14px; line-height:1.6; color:#374151;">
                Trân trọng,
              </p>
              <p style="margin:0; font-size:14px; font-weight:700; color:#0d5c3a;">
                Đội ngũ Tuyển dụng — VDCD Group
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:32px; text-align:center; font-size:12px; color:#9ca3af; line-height:1.5;">
              <p class="text-muted" style="margin:0 0 4px 0;">© ${currentYear} VDCD Group. Tất cả quyền được bảo lưu.</p>
              <p class="text-muted" style="margin:0;">Trung tâm Đổi mới Sáng tạo & Chuyển đổi số Gia Lai</p>
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
