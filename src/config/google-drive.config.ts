import { registerAs } from '@nestjs/config';

export default registerAs('google-drive', () => ({
  folderId: process.env.GOOGLE_DRIVE_FOLDER_ID,
  // OAuth2 approach (for personal Google accounts)
  clientId: process.env.GOOGLE_DRIVE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_DRIVE_CLIENT_SECRET,
  refreshToken: process.env.GOOGLE_DRIVE_REFRESH_TOKEN,
  // Service Account approach (for Google Workspace with Shared Drive)
  serviceAccountKeyBase64: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64,
}));
