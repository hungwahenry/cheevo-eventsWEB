export type AdminOrganisationCategory = {
  id: number
  slug: string
  name: string
  sort_order: number
  is_active: boolean
  usage?: {
    organisations: number
  }
}

export type UpsertOrganisationCategoryPayload = {
  slug?: string
  name?: string
  sort_order?: number
  is_active?: boolean
}
