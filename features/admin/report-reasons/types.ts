export type ReportReasonScope = "event" | "comment" | "user" | "organisation"

export type AdminReportReason = {
  id: string
  slug: string
  label: string
  description: string | null
  scope_types: ReportReasonScope[]
  display_order: number
  requires_details: boolean
  is_active: boolean
  usage?: {
    reports: number
  }
}

export type UpsertReportReasonPayload = {
  slug?: string
  label?: string
  description?: string | null
  scope_types?: ReportReasonScope[]
  display_order?: number
  requires_details?: boolean
  is_active?: boolean
}
