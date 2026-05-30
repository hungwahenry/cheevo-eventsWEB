import { ORGANISATION_LIMITS } from "@/features/organizer/onboarding/limits"
import { z } from "zod"

export const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]+$/

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidSlug(slug: string): boolean {
  const value = slug.trim().toLowerCase()
  return (
    value.length >= ORGANISATION_LIMITS.slug.min &&
    value.length <= ORGANISATION_LIMITS.slug.max &&
    SLUG_PATTERN.test(value)
  )
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

export function normalizeSocialHandle(raw: string, baseUrl: string): string {
  const domain = baseUrl.replace(/^https?:\/\//i, "")
  let value = raw.replace(/^https?:\/\//i, "")
  if (value.toLowerCase().startsWith(domain.toLowerCase())) {
    value = value.slice(domain.length)
  }
  return value.replace(/^@+/, "").replace(/[\s/]+/g, "")
}

export const organisationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(
      ORGANISATION_LIMITS.name,
      `Keep it under ${ORGANISATION_LIMITS.name} characters.`
    ),
  slug: z
    .string()
    .min(ORGANISATION_LIMITS.slug.min)
    .max(ORGANISATION_LIMITS.slug.max)
    .regex(SLUG_PATTERN, "Lowercase letters, numbers and dashes."),
  categoryId: z.number().int().positive("Pick a category."),
  about: z.string().max(ORGANISATION_LIMITS.about),
  contactEmail: z
    .string()
    .max(ORGANISATION_LIMITS.contactEmail)
    .refine((v) => v === "" || EMAIL_PATTERN.test(v), "Enter a valid email."),
  contactPhone: z.string().max(ORGANISATION_LIMITS.contactPhone),
  website: z
    .string()
    .max(ORGANISATION_LIMITS.website)
    .refine((v) => v === "" || isValidUrl(v), "Enter a valid URL."),
  city: z.string().max(ORGANISATION_LIMITS.city),
})

export type OrganisationInput = z.infer<typeof organisationSchema>
