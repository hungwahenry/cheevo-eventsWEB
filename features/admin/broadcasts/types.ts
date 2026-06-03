export type AdminBroadcastStatus =
  | "queued"
  | "sending"
  | "sent"
  | "failed"
  | "cancelled"

export type AdminBroadcastAudience = string

export type AdminBroadcast = {
  id: string
  subject: string
  audience: AdminBroadcastAudience
  status: AdminBroadcastStatus
  body_html?: string | null
  body_text?: string | null
  recipients_count: number
  sent_count: number
  failed_count: number
  failure_reason: string | null
  sent_at: string | null
  created_at: string | null
  organisation?: { id: string; name: string; slug: string } | null
  event?: { id: string; title: string; slug: string } | null
  created_by?: { id: string; email: string } | null
}

export type AdminBroadcastsPage = {
  items: AdminBroadcast[]
  page: number
  last_page: number
  per_page: number
  total: number
}
