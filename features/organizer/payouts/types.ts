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
