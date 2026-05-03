/**
 * Повторы с экспоненциальной задержкой и джиттером (сетевые сбои, 5xx, 429).
 * @template T
 * @param {() => Promise<T>} fn
 * @param {{ maxAttempts?: number, shouldRetry?: (err: unknown, attempt: number) => boolean }} [options]
 * @returns {Promise<T>}
 */
export async function withExponentialBackoff(fn, options = {}) {
  const maxAttempts = options.maxAttempts ?? 3;
  const shouldRetry = options.shouldRetry ?? (() => true);
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      if (attempt >= maxAttempts || !shouldRetry(e, attempt)) {
        throw e;
      }
      const base = 320 * 2 ** (attempt - 1);
      const jitter = Math.random() * 120;
      await new Promise((r) => setTimeout(r, Math.min(base + jitter, 8000)));
    }
  }
  throw lastError;
}
