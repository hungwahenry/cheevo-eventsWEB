import type { Organisation } from "@/features/auth"
import { api } from "@/lib/api"

export type OrganisationUpdate = {
  name?: string
  slug?: string
  category_id?: number
  about?: string
  contact_email?: string
  contact_phone?: string
  website?: string
  city?: string
  logo?: File | null
  cover?: File | null
  socials?: Array<{ platform_id: number; handle: string }>
}

export function updateOrganisation(
  orgId: string,
  update: OrganisationUpdate
): Promise<Organisation> {
  const form = new FormData()
  form.append("_method", "PATCH")

  const fields: Array<keyof OrganisationUpdate> = [
    "name",
    "slug",
    "category_id",
    "about",
    "contact_email",
    "contact_phone",
    "website",
    "city",
  ]
  for (const key of fields) {
    const value = update[key]
    if (value === undefined) continue
    form.append(key, value === null ? "" : String(value))
  }

  if (update.logo) form.append("logo", update.logo)
  if (update.cover) form.append("cover", update.cover)

  if (update.socials !== undefined) {
    if (update.socials.length === 0) {
      form.append("socials", "")
    } else {
      update.socials.forEach((social, idx) => {
        form.append(`socials[${idx}][platform_id]`, String(social.platform_id))
        form.append(`socials[${idx}][handle]`, social.handle)
      })
    }
  }

  return api.post<Organisation>(`/organizer/organisations/${orgId}`, form)
}
