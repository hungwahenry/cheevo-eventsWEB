const MAX_SLUG_LENGTH = 80

/**
 * Match the backend's slug regex (^[a-z0-9-]+$, max 80) on the client so
 * what the user types is always submittable. Strips Unicode combining marks
 * (e.g. accents) so `Café` → `cafe`.
 */
export function slugify(input: string, maxLength = MAX_SLUG_LENGTH): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, maxLength)
}
