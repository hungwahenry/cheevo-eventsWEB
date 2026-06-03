import type {
  AdminReport,
  AdminReportStatus,
  AdminReportsPage,
} from "@/features/admin/reports/types"
import { api } from "@/lib/api"

export type ListReportsFilters = {
  status?: AdminReportStatus
  target_type?: string
  reporter_user_id?: string
  report_reason_id?: string
  from?: string
  to?: string
  per_page?: number
  page?: number
}

export function listReports(
  filters: ListReportsFilters = {}
): Promise<AdminReportsPage> {
  return api.get<AdminReportsPage>("/admin/reports", { params: filters })
}

export function getReport(id: string): Promise<AdminReport> {
  return api.get<AdminReport>(`/admin/reports/${id}`)
}

export function startReview(id: string): Promise<AdminReport> {
  return api.post<AdminReport>(`/admin/reports/${id}/start-review`)
}

export type ActionReportInput = {
  action: "delete_target" | "warn" | "none"
  resolution_note: string
}

export function actionReport(
  id: string,
  input: ActionReportInput
): Promise<AdminReport> {
  return api.post<AdminReport>(`/admin/reports/${id}/action`, input)
}

export function dismissReport(
  id: string,
  resolution_note: string
): Promise<AdminReport> {
  return api.post<AdminReport>(`/admin/reports/${id}/dismiss`, {
    resolution_note,
  })
}

export function bulkDismissReports(
  ids: string[],
  resolution_note: string
): Promise<{ dismissed: number }> {
  return api.post<{ dismissed: number }>("/admin/reports/bulk-dismiss", {
    ids,
    resolution_note,
  })
}
