export type Bank = {
  code: string
  name: string
  slug: string
}

export type ResolvedAccount = {
  account_number: string
  account_name: string
  bank_code: string
}

export type PayoutAccount = {
  id: string
  bank_code: string
  bank_name: string
  account_number: string
  account_name: string
  currency: string
  verified_at: string | null
}

export type EventStatus = "draft" | "published"

export type EventBalanceRow = {
  event_id: string
  title: string
  starts_at: string | null
  ends_at: string | null
  status: EventStatus
  revenue_minor: number
}

export type Balance = {
  currency: string
  available_minor: number
  pending_minor: number
  paid_out_minor: number
  hold_window_days: number
  per_event: EventBalanceRow[]
}

export type PayoutStatus =
  | "requested"
  | "approved"
  | "processing"
  | "paid"
  | "rejected"
  | "failed"

export type Payout = {
  id: string
  amount_minor: number
  fees_minor: number
  net_minor: number
  currency: string
  status: PayoutStatus
  bank_name: string
  account_number: string
  account_name: string
  failed_reason: string | null
  review_notes: string | null
  requested_at: string
  approved_at: string | null
  paid_at: string | null
  failed_at: string | null
  rejected_at: string | null
}

export type PayoutsPage = {
  items: Payout[]
  page: number
  last_page: number
  per_page: number
  total: number
}
