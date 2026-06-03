import type {
  AdminReportReason,
  UpsertReportReasonPayload,
} from "@/features/admin/report-reasons/types"
import { api } from "@/lib/api"

export function listReportReasons(): Promise<AdminReportReason[]> {
  return api.get<AdminReportReason[]>("/admin/report-reasons")
}

export function createReportReason(
  payload: UpsertReportReasonPayload
): Promise<AdminReportReason> {
  return api.post<AdminReportReason>("/admin/report-reasons", payload)
}

export function updateReportReason(
  id: string,
  payload: UpsertReportReasonPayload
): Promise<AdminReportReason> {
  return api.patch<AdminReportReason>(`/admin/report-reasons/${id}`, payload)
}

export function deleteReportReason(id: string): Promise<void> {
  return api.delete<void>(`/admin/report-reasons/${id}`)
}
