export const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]+$/

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidSlug(slug: string): boolean {
  const value = slug.trim().toLowerCase()
  return value.length >= 3 && value.length <= 50 && SLUG_PATTERN.test(value)
}

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim())
}

export function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value.trim())
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}
