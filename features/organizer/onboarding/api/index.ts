import type { Organisation, OrganisationCategory } from "@/features/auth"
import type {
  OrganizerOnboardingDraft,
  SocialPlatform,
} from "@/features/organizer/onboarding/types"
import { api } from "@/lib/api"

export function getCategories(): Promise<OrganisationCategory[]> {
  return api.get<OrganisationCategory[]>("/organizer/organisation-categories")
}

export function getSocialPlatforms(): Promise<SocialPlatform[]> {
  return api.get<SocialPlatform[]>("/organizer/social-platforms")
}

export function checkSlug(
  slug: string
): Promise<{ slug: string; available: boolean }> {
  return api.get("/organizer/slug-available", { params: { slug } })
}

export function createOrganisation(
  draft: OrganizerOnboardingDraft
): Promise<Organisation> {
  const form = new FormData()
  form.append("name", draft.name.trim())
  form.append("slug", draft.slug.trim().toLowerCase())
  if (draft.categoryId !== null)
    form.append("category_id", String(draft.categoryId))

  const optional: Record<string, string> = {
    about: draft.about,
    contact_email: draft.contactEmail,
    contact_phone: draft.contactPhone,
    website: draft.website,
    city: draft.city,
  }
  for (const [key, value] of Object.entries(optional)) {
    if (value.trim()) form.append(key, value.trim())
  }

  if (draft.logo) form.append("logo", draft.logo)
  if (draft.cover) form.append("cover", draft.cover)

  let index = 0
  for (const [platformId, handle] of Object.entries(draft.socials)) {
    if (!handle.trim()) continue
    form.append(`socials[${index}][platform_id]`, platformId)
    form.append(`socials[${index}][handle]`, handle.trim())
    index += 1
  }

  return api.post<Organisation>("/organizer/organisations", form)
}
