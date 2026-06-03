export type AdminSuppressionReason = "unsubscribed" | "bounced" | "complained"

export type AdminBroadcastSuppression = {
  id: string
  email: string
  reason: AdminSuppressionReason
  organisation_id: string | null
  user_id: string | null
  created_at: string | null
  organisation?: { id: string; name: string; slug: string } | null
}

export type AdminBroadcastSuppressionsPage = {
  items: AdminBroadcastSuppression[]
  page: number
  last_page: number
  per_page: number
  total: number
}
