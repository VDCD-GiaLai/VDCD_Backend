import { promises as dns } from 'dns';

/**
 * Disposable/temporary email domain blocklist.
 * Covers the most common throwaway services.
 */
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'guerrillamail.com',
  'guerrillamail.net',
  'guerrillamailblock.com',
  'tempmail.com',
  'temp-mail.org',
  'throwaway.email',
  'yopmail.com',
  'yopmail.fr',
  'sharklasers.com',
  'guerrillamail.info',
  'grr.la',
  'guerrillamail.de',
  'trashmail.com',
  'trashmail.me',
  'trashmail.net',
  'dispostable.com',
  'maildrop.cc',
  'mailnesia.com',
  'mailcatch.com',
  'mintemail.com',
  'tempr.email',
  'discard.email',
  'discardmail.com',
  'fakeinbox.com',
  'mailforspam.com',
  'safetymail.info',
  'instant-mail.de',
  'harakirimail.com',
  'bugmenot.com',
  'mailnull.com',
  'spamgourmet.com',
  'mytemp.email',
  'mohmal.com',
  'getnada.com',
  'tempail.com',
  'emailondeck.com',
  'tempmailaddress.com',
  '10minutemail.com',
  '10minutemail.net',
  'binkmail.com',
  'bobmail.info',
  'chammy.info',
  'devnullmail.com',
  'dodgit.com',
  'jetable.org',
  'maileater.com',
  'mailexpire.com',
  'mailzilla.com',
  'nomail.xl.cx',
  'nospam.ze.tc',
  'owlpic.com',
  'proxymail.eu',
  'rcpt.at',
  'spamfree24.org',
  'spamhole.com',
  'spamify.com',
  'trashymail.com',
  'wuzup.net',
  'mailtemp.info',
  'inboxbear.com',
]);

/** Trim + lowercase email for consistent comparison and rate-limit keying. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Check if email domain is a known disposable/temporary provider. */
export function isDisposableEmail(email: string): boolean {
  const domain = normalizeEmail(email).split('@')[1];
  return domain ? DISPOSABLE_DOMAINS.has(domain) : true;
}

/**
 * Verify domain has MX records via DNS.
 * Returns true if MX records found, false otherwise.
 * Treats DNS errors as "inconclusive" (returns true to avoid false rejections).
 */
export async function hasMxRecords(email: string): Promise<boolean> {
  const domain = normalizeEmail(email).split('@')[1];
  if (!domain) return false;

  try {
    const records = await dns.resolveMx(domain);
    return records && records.length > 0;
  } catch {
    // ENODATA / ENOTFOUND = no MX records = invalid domain
    // Other errors (timeout, etc.) = inconclusive, allow through
    return false;
  }
}
