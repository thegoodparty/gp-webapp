/**
 * Environment variable utilities with validation
 *
 * Use these helpers to validate env vars where they're needed.
 * Throws clear errors if missing.
 */

/**
 * Gets a required environment variable
 * @throws {Error} if the environment variable is not set
 */
export function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

/**
 * Gets an optional environment variable
 */
export function getEnv(key: string): string | undefined {
  return process.env[key]
}

/**
 * Gets a required environment variable as a number
 * @throws {Error} if the environment variable is not set or not a valid number
 */
export function requireEnvNumber(key: string): number {
  const value = requireEnv(key)
  const num = parseInt(value, 10)
  if (isNaN(num)) {
    throw new Error(
      `Environment variable ${key} must be a number, got: ${value}`,
    )
  }
  return num
}

/**
 * Gets a required environment variable as a boolean
 */
export function requireEnvBoolean(key: string): boolean {
  const value = requireEnv(key)
  const lower = value.toLowerCase()
  if (lower === 'true' || lower === '1' || lower === 'yes') return true
  if (lower === 'false' || lower === '0' || lower === 'no') return false
  throw new Error(
    `Environment variable ${key} must be a boolean (true/false), got: ${value}`,
  )
}
