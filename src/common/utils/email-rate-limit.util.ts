import type Redis from 'ioredis';

const MAX_SENDS = 2;
const WINDOW_SECONDS = 86400; // 24 hours

/**
 * Check if email is allowed to send (rolling 24h window, max 2 sends).
 * Uses Redis sorted set for atomic counting.
 *
 * Key: `email_rate_limit:{normalizedEmail}`
 * Score: Unix timestamp (ms)
 * Member: `{timestamp}:{random}` (unique per send)
 */
export async function checkEmailRateLimit(
  redis: Redis,
  normalizedEmail: string,
): Promise<{ allowed: boolean; remaining: number }> {
  const key = `email_rate_limit:${normalizedEmail}`;
  const now = Date.now();
  const windowStart = now - WINDOW_SECONDS * 1000;

  // Atomic: prune old entries + count current
  const pipeline = redis.multi();
  pipeline.zremrangebyscore(key, '-inf', windowStart);
  pipeline.zcard(key);
  const results = await pipeline.exec();

  // results[1] = [err, count] from ZCARD
  const count = (results?.[1]?.[1] as number) ?? 0;

  if (count >= MAX_SENDS) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: MAX_SENDS - count };
}

/**
 * Record a successful email send in the rate-limit window.
 * Call ONLY after mail provider confirms send.
 */
export async function recordEmailSend(
  redis: Redis,
  normalizedEmail: string,
): Promise<void> {
  const key = `email_rate_limit:${normalizedEmail}`;
  const now = Date.now();
  const member = `${now}:${Math.random().toString(36).slice(2, 8)}`;

  const pipeline = redis.multi();
  pipeline.zadd(key, now, member);
  pipeline.expire(key, WINDOW_SECONDS);
  await pipeline.exec();
}
