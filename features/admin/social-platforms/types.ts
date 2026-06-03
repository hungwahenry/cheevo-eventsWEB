export type AdminSocialPlatform = {
  id: number
  slug: string
  name: string
  base_url: string | null
  sort_order: number
  is_active: boolean
}

export type UpsertSocialPlatformPayload = {
  slug?: string
  name?: string
  base_url?: string | null
  sort_order?: number
  is_active?: boolean
}
