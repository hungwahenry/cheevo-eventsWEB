export const ORGANISATION_LIMITS = {
  name: 80,
  slug: { min: 3, max: 50 },
  about: 600,
  contactEmail: 255,
  contactPhone: 30,
  website: 255,
  city: 60,
  socialHandle: 100,
} as const
