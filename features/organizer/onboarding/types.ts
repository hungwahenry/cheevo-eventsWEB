export type SocialPlatform = {
  id: number
  slug: string
  name: string
  base_url: string | null
}

export type OrganizerOnboardingDraft = {
  name: string
  slug: string
  categoryId: number | null
  about: string
  contactEmail: string
  contactPhone: string
  website: string
  city: string
  logo: File | null
  cover: File | null
  /** platformId -> handle */
  socials: Record<number, string>
}
