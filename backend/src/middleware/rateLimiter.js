const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 100;
const buckets = new Map();

function rateLimiter(req, res, next) {
  const now = Date.now();
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const current = buckets.get(ip);

  if (!current || now > current.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }

  if (current.count >= MAX_REQUESTS) {
    return res.status(429).json({ error: "Too many requests. Please try again later." });
  }

  current.count += 1;
  return next();
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, bucket] of buckets.entries()) {
    if (now > bucket.resetAt) {
      buckets.delete(ip);
    }
  }
}, WINDOW_MS).unref();

module.exports = rateLimiter;
