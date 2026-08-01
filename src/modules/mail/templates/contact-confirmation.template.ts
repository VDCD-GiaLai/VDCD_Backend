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

  const logoUrl =
    'https://ik.imagekit.io/po0s6zxoj/vdcd/logo/GL_NOBGArtboard%204.png';

  const fontFamily =
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VDCD Group — Xác nhận yêu cầu liên hệ</title>
</head>
<body style="margin:0; padding:0; background-color:#ffffff; font-family:${fontFamily}; color:#1b1b1d; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;">

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

          <!-- Success Banner -->
          <tr>
            <td style="background-color:#0d5c3a; padding:28px 32px; border-radius:8px 8px 0 0; color:#ffffff;">
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
            <td style="background-color:#f9fafb; padding:32px; border:1px solid #e5e7eb; border-top:none; border-radius:0 0 8px 8px;">
              <p style="margin:0 0 16px 0; font-size:15px; line-height:1.6; font-weight:500;">
                Xin chào <strong>${contact.fullName}</strong>,
              </p>
              <p style="margin:0 0 20px 0; font-size:14px; line-height:1.6; color:#374151;">
                VDCD Group đã nhận được thông tin liên hệ của bạn vào lúc <strong>${formattedDate}</strong>.
              </p>
              <p style="margin:0 0 24px 0; font-size:14px; line-height:1.6; color:#374151;">
                Đội ngũ tư vấn của chúng tôi sẽ phản hồi lại bạn qua Email hoặc Số điện thoại trong thời gian sớm nhất.
              </p>

              <!-- Summary Box -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#ffffff; border:1px solid #e5e7eb; border-radius:6px; margin-bottom:24px; font-size:14px;">
                <tr>
                  <td style="padding:16px 20px; border-bottom:1px solid #f3f4f6; font-weight:600; color:#111827;">
                    Nội dung yêu cầu
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px; color:#4b5563; line-height:1.8;">
                    <strong>• Họ và tên:</strong> ${contact.fullName}<br>
                    <strong>• Email:</strong> ${contact.email}<br>
                    ${contact.phone ? `<strong>• Số điện thoại:</strong> ${contact.phone}<br>` : ''}
                    ${contact.subject ? `<strong>• Chủ đề:</strong> ${contact.subject}<br>` : ''}
                    ${contact.message ? `<strong>• Lời nhắn:</strong> ${contact.message}<br>` : ''}
                    ${contact.attachment ? `<strong>• Tệp đính kèm:</strong> <a href="${contact.attachment}" style="color:#0d5c3a; text-decoration:underline;" target="_blank">Xem tệp đính kèm</a><br>` : ''}
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px 0; font-size:14px; line-height:1.6; color:#374151;">
                Trân trọng,
              </p>
              <p style="margin:0; font-size:14px; font-weight:700; color:#0d5c3a;">
                Đội ngũ Hỗ trợ — VDCD Group
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:32px; text-align:center; font-size:12px; color:#9ca3af; line-height:1.5;">
              <p style="margin:0 0 4px 0;">© ${currentYear} VDCD Group. Tất cả quyền được bảo lưu.</p>
              <p style="margin:0;">Trung tâm Đổi mới Sáng tạo & Chuyển đổi số Gia Lai</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}
