import { Lead } from '../../lead/entities/lead.entity';

export interface EmailTemplateOptions {
  adminUrl?: string;
  appEnv?: string;
}

export function renderLeadNotificationTemplate(
  lead: Lead,
  options: EmailTemplateOptions = {},
): string {
  const adminUrl = options.adminUrl || 'http://localhost:3002';
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

  // Build optional fields rows
  const optionalRows: string[] = [];

  if (formattedDob) {
    optionalRows.push(`
                <tr>
                  <td width="50%" style="padding-bottom:24px; vertical-align:top; padding-right:12px;">
                    <div class="text-muted" style="font-family:${fontFamily}; font-size:12px; font-weight:600; color:#94a3b8; margin-bottom:6px;">Ngày sinh</div>
                    <div class="text-primary" style="font-family:${fontFamily}; font-size:15px; font-weight:600; color:#1b1b1d;">${formattedDob}</div>
                  </td>
                  <td width="50%" style="padding-bottom:24px; vertical-align:top; padding-left:12px;">
                    <div class="text-muted" style="font-family:${fontFamily}; font-size:12px; font-weight:600; color:#94a3b8; margin-bottom:6px;">Địa chỉ</div>
                    <div class="text-primary" style="font-family:${fontFamily}; font-size:15px; font-weight:600; color:#1b1b1d;">${escapeHtml(lead.address || 'Chưa cung cấp')}</div>
                  </td>
                </tr>`);
  } else if (lead.address) {
    optionalRows.push(`
                <tr>
                  <td colspan="2" style="padding-bottom:24px; vertical-align:top;">
                    <div class="text-muted" style="font-family:${fontFamily}; font-size:12px; font-weight:600; color:#94a3b8; margin-bottom:6px;">Địa chỉ</div>
                    <div class="text-primary" style="font-family:${fontFamily}; font-size:15px; font-weight:600; color:#1b1b1d;">${escapeHtml(lead.address)}</div>
                  </td>
                </tr>`);
  }

  if (lead.experienceYears || lead.expectedSalary) {
    optionalRows.push(`
                <tr>
                  <td width="50%" style="padding-bottom:24px; vertical-align:top; padding-right:12px;">
                    <div class="text-muted" style="font-family:${fontFamily}; font-size:12px; font-weight:600; color:#94a3b8; margin-bottom:6px;">Kinh nghiệm</div>
                    <div class="text-primary" style="font-family:${fontFamily}; font-size:15px; font-weight:600; color:#1b1b1d;">${escapeHtml(lead.experienceYears || 'Chưa cung cấp')}</div>
                  </td>
                  <td width="50%" style="padding-bottom:24px; vertical-align:top; padding-left:12px;">
                    <div class="text-muted" style="font-family:${fontFamily}; font-size:12px; font-weight:600; color:#94a3b8; margin-bottom:6px;">Mức lương mong muốn</div>
                    <div class="text-primary" style="font-family:${fontFamily}; font-size:15px; font-weight:600; color:#1b1b1d;">${escapeHtml(lead.expectedSalary || 'Chưa cung cấp')}</div>
                  </td>
                </tr>`);
  }

  if (lead.portfolioUrl) {
    optionalRows.push(`
                <tr>
                  <td colspan="2" style="padding-bottom:24px; vertical-align:top;">
                    <div class="text-muted" style="font-family:${fontFamily}; font-size:12px; font-weight:600; color:#94a3b8; margin-bottom:6px;">Portfolio</div>
                    <div style="font-family:${fontFamily}; font-size:15px; font-weight:600;">
                      <a href="${escapeHtml(lead.portfolioUrl)}" target="_blank" style="color:#e80002; text-decoration:none;">${escapeHtml(lead.portfolioUrl)}</a>
                    </div>
                  </td>
                </tr>`);
  }

  if (lead.source) {
    optionalRows.push(`
                <tr>
                  <td colspan="2" style="padding-bottom:24px; vertical-align:top;">
                    <div class="text-muted" style="font-family:${fontFamily}; font-size:12px; font-weight:600; color:#94a3b8; margin-bottom:6px;">Nguồn</div>
                    <div class="text-primary" style="font-family:${fontFamily}; font-size:15px; font-weight:600; color:#1b1b1d;">${escapeHtml(lead.source)}</div>
                  </td>
                </tr>`);
  }

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>VDCD Group — Hồ sơ ứng tuyển mới</title>
  <style>
    :root { color-scheme: light dark; }
    @media (prefers-color-scheme: dark) {
      .email-body { background-color: #1a1a1a !important; }
      .email-card { background-color: #242424 !important; }
      .text-primary { color: #f0f0f0 !important; }
      .text-secondary { color: #a0a0a0 !important; }
      .text-muted { color: #787878 !important; }
      .border-subtle { border-color: #333333 !important; }
      .bg-section { background-color: #2a2a2a !important; }
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

          <!-- Hero Heading -->
          <tr>
            <td class="border-subtle" style="border-bottom:1px solid #f1f5f9; padding-bottom:32px;">
              <div style="font-family:${fontFamily}; font-size:12px; font-weight:700; color:#e80002; letter-spacing:1px; text-transform:uppercase; margin-bottom:10px;">
                Hồ sơ ứng tuyển mới
              </div>
              <h1 class="text-primary" style="font-family:${fontFamily}; font-size:28px; font-weight:700; color:#1b1b1d; margin:0 0 14px 0; line-height:1.3;">
                Ứng viên <span style="color:#e80002;">${escapeHtml(lead.fullName)}</span>
              </h1>
              <p class="text-secondary" style="font-family:${fontFamily}; font-size:15px; color:#505f76; line-height:1.65; margin:0; max-width:580px;">
                Hệ thống vừa nhận được một hồ sơ ứng tuyển mới qua cổng thông tin trực tuyến chính thức của VDCD Gia Lai.
              </p>
            </td>
          </tr>

          <!-- Lead Info -->
          <tr>
            <td class="border-subtle" style="padding-top:36px; padding-bottom:36px; border-bottom:1px solid #f1f5f9;">
              
              <div class="text-muted" style="font-family:${fontFamily}; font-size:12px; font-weight:700; color:#94a3b8; letter-spacing:1px; text-transform:uppercase; margin-bottom:24px;">
                Thông tin ứng viên
              </div>

              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="50%" style="padding-bottom:24px; vertical-align:top; padding-right:12px;">
                    <div class="text-muted" style="font-family:${fontFamily}; font-size:12px; font-weight:600; color:#94a3b8; margin-bottom:6px;">Họ và tên</div>
                    <div class="text-primary" style="font-family:${fontFamily}; font-size:16px; font-weight:700; color:#1b1b1d;">${escapeHtml(lead.fullName)}</div>
                  </td>
                  <td width="50%" style="padding-bottom:24px; vertical-align:top; padding-left:12px;">
                    <div class="text-muted" style="font-family:${fontFamily}; font-size:12px; font-weight:600; color:#94a3b8; margin-bottom:6px;">Email</div>
                    <div style="font-family:${fontFamily}; font-size:16px; font-weight:700; color:#e80002;">
                      <a href="mailto:${escapeHtml(lead.email)}" style="color:#e80002; text-decoration:none;">${escapeHtml(lead.email)}</a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="padding-bottom:24px; vertical-align:top; padding-right:12px;">
                    <div class="text-muted" style="font-family:${fontFamily}; font-size:12px; font-weight:600; color:#94a3b8; margin-bottom:6px;">Số điện thoại</div>
                    <div class="text-primary" style="font-family:${fontFamily}; font-size:15px; font-weight:600; color:#1b1b1d;">${escapeHtml(lead.phone || 'Chưa cung cấp')}</div>
                  </td>
                  <td width="50%" style="padding-bottom:24px; vertical-align:top; padding-left:12px;">
                    <div class="text-muted" style="font-family:${fontFamily}; font-size:12px; font-weight:600; color:#94a3b8; margin-bottom:6px;">Vị trí ứng tuyển</div>
                    <div class="text-primary" style="font-family:${fontFamily}; font-size:15px; font-weight:600; color:#1b1b1d;">${escapeHtml(lead.subject || 'Chưa chỉ định')}</div>
                  </td>
                </tr>
                ${optionalRows.join('')}
              </table>

            </td>
          </tr>

          <!-- Cover Letter / Message Section -->
          ${
            lead.coverLetter || lead.message
              ? `
          <tr>
            <td class="border-subtle" style="padding-top:36px; padding-bottom:36px; border-bottom:1px solid #f1f5f9;">
              
              <div class="text-muted" style="font-family:${fontFamily}; font-size:12px; font-weight:700; color:#94a3b8; letter-spacing:1px; text-transform:uppercase; margin-bottom:16px;">
                ${lead.coverLetter ? 'Thư giới thiệu' : 'Nội dung tin nhắn'}
              </div>

              <div style="border-left:3px solid #e80002; padding-left:24px; margin-top:8px;">
                <p class="text-primary" style="font-family:${fontFamily}; font-size:16px; color:#1b1b1d; line-height:1.8; margin:0; white-space:pre-wrap;">${escapeHtml(lead.coverLetter || lead.message || '')}</p>
              </div>

            </td>
          </tr>
          `
              : ''
          }

          <!-- Attachment -->
          ${
            lead.attachment
              ? `
          <tr>
            <td class="border-subtle" style="padding-top:24px; padding-bottom:24px; border-bottom:1px solid #f1f5f9;">
              <a href="${escapeHtml(lead.attachment)}" target="_blank" style="font-family:${fontFamily}; font-size:14px; font-weight:700; color:#e80002; text-decoration:none;">
                📎 Xem / Tải về CV đính kèm →
              </a>
            </td>
          </tr>
          `
              : ''
          }

          <!-- CTA Button -->
          <tr>
            <td style="padding-top:36px; padding-bottom:40px;">
              <a href="${adminUrl}/leads/${lead.id}" target="_blank" style="display:inline-block; padding:16px 36px; background-color:#1b1b1d; color:#ffffff; font-family:${fontFamily}; font-size:12px; font-weight:700; letter-spacing:1px; text-decoration:none; border-radius:4px;">
                Xem trong Admin Panel →
              </a>
              <div class="text-muted" style="font-family:${fontFamily}; font-size:12px; color:#94a3b8; margin-top:20px;">
                Mã hồ sơ: <code style="font-family:monospace; color:#64748b;">${lead.id}</code> &nbsp;•&nbsp; ${formattedDate}
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="border-subtle" style="border-top:1px solid #f1f5f9; padding-top:32px; padding-bottom:24px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding-bottom:16px;">
                    <div class="text-primary" style="font-family:${fontFamily}; font-size:14px; font-weight:700; color:#1b1b1d; margin-bottom:6px;">
                      VDCD Group
                    </div>
                    <div class="text-secondary" style="font-family:${fontFamily}; font-size:13px; color:#505f76; margin-bottom:12px;">
                      Kiến tạo tương lai số bền vững tại Gia Lai & Tây Nguyên.
                    </div>
                    <div class="text-secondary" style="font-family:${fontFamily}; font-size:12px; color:#505f76; margin-bottom:4px;">
                      📍 01 Trần Hưng Đạo, TP. Pleiku, Gia Lai
                    </div>
                    <div class="text-secondary" style="font-family:${fontFamily}; font-size:12px; color:#505f76;">
                      ✉️ contact@vdcdgroup.vn &nbsp;|&nbsp; 📞 0269 300 0000
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="border-subtle" style="border-top:1px solid #f8fafc; padding-top:16px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td class="text-muted" style="font-family:${fontFamily}; font-size:11px; color:#94a3b8;">
                          © ${currentYear} VDCD Group. All rights reserved.
                        </td>
                      </tr>
                    </table>
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
