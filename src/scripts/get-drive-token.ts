/**
 * One-time script to obtain a Google OAuth2 refresh token.
 *
 * Prerequisites:
 *   1. Go to Google Cloud Console → APIs & Services → Credentials
 *   2. Create OAuth 2.0 Client ID (type: Desktop app or Web application)
 *   3. If Web application: add http://localhost:3333/callback to Authorized redirect URIs
 *   4. Copy Client ID and Client Secret
 *
 * Usage:
 *   npx ts-node src/scripts/get-drive-token.ts <CLIENT_ID> <CLIENT_SECRET>
 *
 * This will:
 *   - Print an auth URL for you to open in the browser
 *   - Wait for the callback with the authorization code
 *   - Print the refresh token to console
 *   - You then paste it into .env as GOOGLE_DRIVE_REFRESH_TOKEN
 */

import { google } from 'googleapis';
import * as http from 'http';
import * as url from 'url';

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const REDIRECT_PORT = 3333;
const REDIRECT_URI = `http://localhost:${REDIRECT_PORT}/callback`;
const TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

async function main() {
  const clientId = process.argv[2];
  const clientSecret = process.argv[3];

  if (!clientId || !clientSecret) {
    console.error('\n❌ Usage: npx ts-node src/scripts/get-drive-token.ts <CLIENT_ID> <CLIENT_SECRET>\n');
    console.error('Get these from: Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client IDs');
    process.exit(1);
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, REDIRECT_URI);

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  🔐 Google Drive Authorization');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('\n📋 IMPORTANT: Make sure you have added this redirect URI');
  console.log('   in Google Cloud Console → OAuth 2.0 Client → Authorized redirect URIs:');
  console.log(`\n   ${REDIRECT_URI}\n`);
  console.log('───────────────────────────────────────────────────────────────');
  console.log('\n👉 Open this URL in your browser:\n');
  console.log(authUrl);
  console.log('\n───────────────────────────────────────────────────────────────\n');

  // Try to open browser automatically
  try {
    const { exec } = await import('child_process');
    const platform = process.platform;
    if (platform === 'win32') {
      // Use cmd /c start to handle long URLs better on Windows
      exec(`cmd /c start "" "${authUrl}"`);
    } else if (platform === 'darwin') {
      exec(`open "${authUrl}"`);
    } else {
      exec(`xdg-open "${authUrl}"`);
    }
  } catch {
    console.log('⚠️  Could not open browser automatically. Please open the URL above manually.\n');
  }

  // Wait for callback
  const code = await waitForCallback();

  console.log('\n✅ Authorization code received. Exchanging for tokens...\n');

  const { tokens } = await oauth2Client.getToken(code);

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  📋 Copy these values to your .env file:');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`\nGOOGLE_DRIVE_CLIENT_ID=${clientId}`);
  console.log(`GOOGLE_DRIVE_CLIENT_SECRET=${clientSecret}`);
  console.log(`GOOGLE_DRIVE_REFRESH_TOKEN=${tokens.refresh_token}\n`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  process.exit(0);
}

function waitForCallback(): Promise<string> {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const parsedUrl = url.parse(req.url || '', true);
      if (parsedUrl.pathname === '/callback') {
        const code = parsedUrl.query.code as string;
        const error = parsedUrl.query.error as string;

        if (error) {
          res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(`<h2>❌ Authorization denied</h2><p>Error: ${error}</p>`);
          server.close();
          reject(new Error(`Authorization denied: ${error}`));
          return;
        }

        if (code) {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end('<h2>✅ Authorization successful!</h2><p>You can close this tab and return to the terminal.</p>');
          server.close();
          resolve(code);
        } else {
          res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end('<h2>❌ No authorization code received</h2>');
          server.close();
          reject(new Error('No authorization code received'));
        }
      }
    });

    server.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        reject(new Error(`Port ${REDIRECT_PORT} is already in use. Run: npx kill-port ${REDIRECT_PORT}`));
      } else {
        reject(err);
      }
    });

    server.listen(REDIRECT_PORT, () => {
      console.log(`⏳ Waiting for authorization callback on port ${REDIRECT_PORT}... (timeout: ${TIMEOUT_MS / 60000} min)\n`);
    });

    setTimeout(() => {
      server.close();
      reject(new Error(`Authorization timed out (${TIMEOUT_MS / 60000} minutes)`));
    }, TIMEOUT_MS);
  });
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
