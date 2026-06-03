export type AdminEventStatus = "draft" | "published" | "past"

export type AdminEvent = {
  id: string
  title: string
  slug: string
  status: AdminEventStatus
  starts_at: string | null
  ends_at: string | null
  published_at: string | null
  venue_name: string | null
  city: string | null
  flyer_url: string | null
  currency: string | null
  tickets_count: number
  tickets_sold: number
  tickets_min_price: number | null
  tickets_max_price: number | null
  revenue_minor: number
  rsvps_count: number
  comments_count: number
  comments_locked_at: string | null
  suspended_at: string | null
  suspended_reason: string | null
  created_at: string | null
  organisation?: { id: string; name: string; slug: string } | null
}

export type AdminEventsPage = {
  items: AdminEvent[]
  page: number
  last_page: number
  per_page: number
  total: number
}
