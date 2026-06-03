export type AdminPayoutStatus =
  | "requested"
  | "approved"
  | "processing"
  | "paid"
  | "rejected"
  | "failed"

export type AdminPayout = {
  id: string
  status: AdminPayoutStatus
  amount_minor: number
  fees_minor: number
  net_minor: number
  currency: string
  provider: string | null
  provider_reference: string | null
  bank_code: string | null
  bank_name: string | null
  account_number: string | null
  account_name: string | null
  failed_reason: string | null
  review_notes: string | null
  requested_at: string | null
  approved_at: string | null
  paid_at: string | null
  failed_at: string | null
  rejected_at: string | null
  created_at: string | null
  organisation?: { id: string; name: string; slug: string } | null
  requested_by?: { id: string; email: string } | null
  reviewed_by?: { id: string; email: string } | null
}

export type AdminPayoutsPage = {
  items: AdminPayout[]
  page: number
  last_page: number
  per_page: number
  total: number
}
