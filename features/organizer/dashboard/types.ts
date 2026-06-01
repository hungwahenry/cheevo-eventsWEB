export type DashboardRange = "7d" | "30d" | "90d" | "12mo"

export type KpiMetric = "revenue_minor" | "tickets" | "orders" | "rsvps"

export type Kpi = {
  current: number
  previous: number
  delta_pct: number | null
}

export type DashboardKpis = Record<KpiMetric, Kpi>

export type TimeseriesPoint = {
  date: string
  revenue_minor: number
  tickets: number
  orders: number
  rsvps: number
}

export type TopEvent = {
  id: string
  title: string
  revenue_minor: number
  tickets_sold: number
  flyer_url: string | null
  share_pct: number
}

export type NextEvent = {
  id: string
  title: string
  starts_at: string | null
  ends_at: string | null
  venue_name: string | null
  city: string | null
  flyer_url: string | null
  flyer_type: "image" | "video" | null
  tickets_sold: number
  revenue_minor: number
}

export type ActivityType =
  | "order_paid"
  | "rsvp"
  | "comment_flagged"
  | "payout_requested"
  | "payout_paid"
  | "ticket_scanned"

export type ActivityItem = {
  type: ActivityType
  at: string
  data: Record<string, unknown>
}

export type DashboardSummary = {
  range: DashboardRange
  currency: string
  kpis: DashboardKpis
  timeseries: TimeseriesPoint[]
  top_events: TopEvent[]
  next_event: NextEvent | null
  recent_activity: ActivityItem[]
}
