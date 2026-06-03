export type AdminReportStatus = "open" | "under_review" | "actioned" | "dismissed"

export type AdminReportTarget =
  | {
      id: string
      event_id: string
      body: string | null
      created_at: string | null
      author_id: string | null
    }
  | { id: string }
  | null

export type AdminReport = {
  id: string
  target_type: string | null
  target_id: string | null
  status: AdminReportStatus
  details: string | null
  resolution_note: string | null
  created_at: string | null
  reviewed_at: string | null
  reason?: { id: string; slug: string; label: string }
  reporter?: { id: string; email: string; username: string | null } | null
  reviewer?: { id: string; email: string } | null
  target?: AdminReportTarget
}

export type AdminReportsPage = {
  items: AdminReport[]
  page: number
  last_page: number
  per_page: number
  total: number
}
