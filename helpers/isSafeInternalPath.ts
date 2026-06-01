/**
 * Returns true only for a root-relative, same-origin path that is safe to use
 * as a post-auth redirect target.
 *
 * Guards against open-redirect payloads that browsers normalize into an
 * authority/host: protocol-relative URLs (`//evil.com`), their backslash
 * variants (`/\evil.com`, which WHATWG/browsers fold into `//evil.com`),
 * absolute URLs (`https://evil.com`), and any embedded whitespace/control
 * characters. The `new URL()` origin check is a belt-and-suspenders backstop
 * in case a novel normalization slips past the explicit string checks.
 */
export const isSafeInternalPath = (value: unknown): value is string => {
  if (typeof value !== 'string') return false
  if (!value.startsWith('/')) return false
  if (value.startsWith('//')) return false
  // Reject backslashes and whitespace anywhere — browsers treat `\` like `/`
  // and strip tabs/newlines, both of which can smuggle in a host segment.
  if (/[\\\s]/.test(value)) return false
  try {
    const base = 'https://internal.invalid'
    return new URL(value, base).origin === base
  } catch {
    return false
  }
}
