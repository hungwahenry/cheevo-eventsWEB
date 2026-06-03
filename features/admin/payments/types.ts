export type AdminPaymentStatus =
  | "pending"
  | "successful"
  | "failed"
  | "abandoned"
  | "refunded"

export type AdminPayment = {
  id: string
  provider: string
  reference: string
  provider_reference: string | null
  status: AdminPaymentStatus
  amount_minor: number
  currency: string
  purposable_type: string | null
  purposable_id: string | null
  authorized_at: string | null
  failed_at: string | null
  refunded_at: string | null
  created_at: string | null
  metadata: Record<string, unknown> | null
  provider_response?: Record<string, unknown> | null
  user?: { id: string; email: string } | null
}

export type AdminPaymentsPage = {
  items: AdminPayment[]
  page: number
  last_page: number
  per_page: number
  total: number
}
