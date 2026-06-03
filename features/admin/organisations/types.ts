export type AdminOrganisation = {
  id: string
  name: string
  slug: string
  logo_url: string | null
  cover_url: string | null
  about: string | null
  contact_email: string | null
  contact_phone: string | null
  website: string | null
  city: string | null
  events_count: number
  subscribers_count: number
  suspended_at: string | null
  suspended_reason: string | null
  created_at: string | null
  category?: { id: string; slug: string; name: string } | null
  payout_account?: {
    id: string
    bank_name: string
    account_number: string
    account_name: string
  } | null
  members?: Array<{
    id: string
    email: string
    username: string | null
    role: string
    is_owner: boolean
  }>
}

export type AdminOrganisationsPage = {
  items: AdminOrganisation[]
  page: number
  last_page: number
  per_page: number
  total: number
}
