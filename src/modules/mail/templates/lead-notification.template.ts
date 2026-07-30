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

  const logoUrl =
    'https://ik.imagekit.io/po0s6zxoj/vdcd/logo/GL_NOBGArtboard%204.png';

  const fontFamily =
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VDCD Group — Yêu cầu liên hệ hợp tác mới</title>
</head>
<body style="margin:0; padding:0; background-color:#ffffff; font-family:${fontFamily}; color:#1b1b1d; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;">

  <!-- Single Content Wrapper (Max-width 700px, Minimalist, Clean Product Email) -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#ffffff;">
    <tr>
      <td align="left" style="padding:40px 24px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:700px; margin:0 auto;">
          
          <!-- Header Row -->
          <tr>
            <td style="padding-bottom:32px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <!-- Official VDCD Logo Image -->
                    <img src="${logoUrl}" alt="VDCD Group" width="180" height="45" style="display:block; width:180px; height:auto; border:0;" />
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <span style="font-family:${fontFamily}; font-size:12px; font-weight:600; color:#505f76; letter-spacing:0.5px;">
                      Gia Lai Innovation Center
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Subtle Divider & Hero Heading -->
          <tr>
            <td style="border-bottom:1px solid #f1f5f9; padding-bottom:32px;">
              <!-- Eyebrow Text (Title Case for 100% clean Vietnamese diacritics rendering) -->
              <div style="font-family:${fontFamily}; font-size:12px; font-weight:700; color:#e80002; letter-spacing:1px; text-transform:uppercase; margin-bottom:10px;">
                Yêu cầu liên hệ hợp tác
              </div>
              <!-- Large Bold Heading -->
              <h1 style="font-family:${fontFamily}; font-size:28px; font-weight:700; color:#1b1b1d; margin:0 0 14px 0; line-height:1.3;">
                Kết nối cùng <span style="color:#e80002;">VDCD Group</span>
              </h1>
              <!-- Short Description -->
              <p style="font-family:${fontFamily}; font-size:15px; color:#505f76; line-height:1.65; margin:0; max-width:580px;">
                Hệ thống vừa nhận được một yêu cầu liên hệ mới từ khách hàng qua cổng thông tin trực tuyến chính thức của VDCD Gia Lai.
              </p>
            </td>
          </tr>

          <!-- Lead Info (Clean Two-Column Layout) -->
          <tr>
            <td style="padding-top:36px; padding-bottom:36px; border-bottom:1px solid #f1f5f9;">
              
              <div style="font-family:${fontFamily}; font-size:12px; font-weight:700; color:#94a3b8; letter-spacing:1px; text-transform:uppercase; margin-bottom:24px;">
                Thông tin người gửi
              </div>

              <!-- Two Column Layout -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="50%" style="padding-bottom:24px; vertical-align:top; padding-right:12px;">
                    <div style="font-family:${fontFamily}; font-size:12px; font-weight:600; color:#94a3b8; margin-bottom:6px;">Họ và tên</div>
                    <div style="font-family:${fontFamily}; font-size:16px; font-weight:700; color:#1b1b1d;">${escapeHtml(lead.fullName)}</div>
                  </td>
                  <td width="50%" style="padding-bottom:24px; vertical-align:top; padding-left:12px;">
                    <div style="font-family:${fontFamily}; font-size:12px; font-weight:600; color:#94a3b8; margin-bottom:6px;">Email</div>
                    <div style="font-family:${fontFamily}; font-size:16px; font-weight:700; color:#e80002;">
                      <a href="mailto:${escapeHtml(lead.email)}" style="color:#e80002; text-decoration:none;">${escapeHtml(lead.email)}</a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="vertical-align:top; padding-right:12px;">
                    <div style="font-family:${fontFamily}; font-size:12px; font-weight:600; color:#94a3b8; margin-bottom:6px;">Số điện thoại</div>
                    <div style="font-family:${fontFamily}; font-size:15px; font-weight:600; color:#1b1b1d;">${escapeHtml(lead.phone || 'Chưa cung cấp')}</div>
                  </td>
                  <td width="50%" style="vertical-align:top; padding-left:12px;">
                    <div style="font-family:${fontFamily}; font-size:12px; font-weight:600; color:#94a3b8; margin-bottom:6px;">Chủ đề</div>
                    <div style="font-family:${fontFamily}; font-size:15px; font-weight:600; color:#1b1b1d;">${escapeHtml(lead.subject || 'Tư vấn giải pháp')}</div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Message Section (Focal Point with Left Accent Line) -->
          <tr>
            <td style="padding-top:36px; padding-bottom:36px; border-bottom:1px solid #f1f5f9;">
              
              <div style="font-family:${fontFamily}; font-size:12px; font-weight:700; color:#94a3b8; letter-spacing:1px; text-transform:uppercase; margin-bottom:16px;">
                Nội dung tin nhắn
              </div>

              <!-- Message block with left accent line in VDCD primary red -->
              <div style="border-left:3px solid #e80002; padding-left:24px; margin-top:8px;">
                <p style="font-family:${fontFamily}; font-size:16px; color:#1b1b1d; line-height:1.8; margin:0; white-space:pre-wrap;">${escapeHtml(lead.message || 'Không có nội dung tin nhắn.')}</p>
              </div>

              ${
                lead.attachment
                  ? `
              <div style="margin-top:24px; padding-left:24px;">
                <a href="${escapeHtml(lead.attachment)}" target="_blank" style="font-family:${fontFamily}; font-size:13px; font-weight:700; color:#e80002; text-decoration:none;">
                  📎 Xem / Tải về tệp đính kèm →
                </a>
              </div>
              `
                  : ''
              }

            </td>
          </tr>

          <!-- Primary CTA Button -->
          <tr>
            <td style="padding-top:36px; padding-bottom:40px;">
              <a href="${adminUrl}/leads/${lead.id}" target="_blank" style="display:inline-block; padding:16px 36px; background-color:#1b1b1d; color:#ffffff; font-family:${fontFamily}; font-size:12px; font-weight:700; letter-spacing:1px; text-decoration:none; border-radius:4px;">
                Xem trong Admin Panel →
              </a>
              <div style="font-family:${fontFamily}; font-size:12px; color:#94a3b8; margin-top:20px;">
                Mã yêu cầu: <code style="font-family:monospace; color:#64748b;">${lead.id}</code> &nbsp;•&nbsp; ${formattedDate}
              </div>
            </td>
          </tr>

          <!-- Footer Section -->
          <tr>
            <td style="border-top:1px solid #f1f5f9; padding-top:32px; padding-bottom:24px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding-bottom:16px;">
                    <div style="font-family:${fontFamily}; font-size:14px; font-weight:700; color:#1b1b1d; margin-bottom:6px;">
                      VDCD Group
                    </div>
                    <div style="font-family:${fontFamily}; font-size:13px; color:#505f76; margin-bottom:12px;">
                      Kiến tạo tương lai số bền vững tại Gia Lai & Tây Nguyên.
                    </div>
                    <div style="font-family:${fontFamily}; font-size:12px; color:#505f76; margin-bottom:4px;">
                      📍 01 Trần Hưng Đạo, TP. Pleiku, Gia Lai
                    </div>
                    <div style="font-family:${fontFamily}; font-size:12px; color:#505f76;">
                      ✉️ contact@vdcdgroup.vn &nbsp;|&nbsp; 📞 0269 300 0000
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="border-top:1px solid #f8fafc; padding-top:16px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="font-family:${fontFamily}; font-size:11px; color:#94a3b8;">
                          © ${currentYear} VDCD Group. All rights reserved.
                        </td>
                        <td align="right" style="font-family:${fontFamily}; font-size:11px; font-weight:700; color:#e80002;">
                          ● Vanguard UI Architect
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
