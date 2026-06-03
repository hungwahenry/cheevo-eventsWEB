export type AdminInterest = {
  id: number
  slug: string
  name: string
  sort_order: number
  is_active: boolean
  usage?: {
    users: number
    events: number
  }
}

export type UpsertInterestPayload = {
  slug?: string
  name?: string
  sort_order?: number
  is_active?: boolean
}
