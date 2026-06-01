export type BroadcastAudience = "ticket_holders" | "rsvpers" | "both"

export type BroadcastStatus =
  | "queued"
  | "sending"
  | "sent"
  | "failed"
  | "cancelled"

export type Broadcast = {
  id: string
  audience: BroadcastAudience
  subject: string
  body_html: string
  body_text: string
  recipients_count: number
  sent_count: number
  failed_count: number
  status: BroadcastStatus
  failure_reason: string | null
  sent_at: string | null
  created_at: string
}

export type BroadcastsPage = {
  items: Broadcast[]
  page: number
  last_page: number
  per_page: number
  total: number
}

export type CreateBroadcastPayload = {
  audience: BroadcastAudience
  subject: string
  body_html: string
}
