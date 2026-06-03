import * as api from "@/features/admin/reports/api"
import { reportKey } from "@/features/admin/reports/hooks/use-reports"
import type { AdminReport } from "@/features/admin/reports/types"
import { isApiError } from "@/lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

function invalidateReports(
  qc: ReturnType<typeof useQueryClient>,
  id?: string
): void {
  qc.invalidateQueries({ queryKey: ["admin", "reports"] })
  if (id) qc.invalidateQueries({ queryKey: reportKey(id) })
}

function toastError(fallback: string) {
  return (error: unknown) => {
    toast.error(isApiError(error) ? error.message : fallback)
  }
}

export function useStartReview() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.startReview(id),
    onSuccess: (data: AdminReport) => {
      toast.success("Moved to under review.")
      invalidateReports(qc, data.id)
    },
    onError: toastError("Couldn't start review."),
  })
}

export function useActionReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; input: api.ActionReportInput }) =>
      api.actionReport(vars.id, vars.input),
    onSuccess: (data: AdminReport) => {
      toast.success("Report actioned.")
      invalidateReports(qc, data.id)
    },
    onError: toastError("Couldn't action the report."),
  })
}

export function useDismissReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; resolution_note: string }) =>
      api.dismissReport(vars.id, vars.resolution_note),
    onSuccess: (data: AdminReport) => {
      toast.success("Report dismissed.")
      invalidateReports(qc, data.id)
    },
    onError: toastError("Couldn't dismiss."),
  })
}

export function useBulkDismissReports() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { ids: string[]; resolution_note: string }) =>
      api.bulkDismissReports(vars.ids, vars.resolution_note),
    onSuccess: (data) => {
      toast.success(
        `Dismissed ${data.dismissed} report${data.dismissed === 1 ? "" : "s"}.`
      )
      invalidateReports(qc)
    },
    onError: toastError("Couldn't bulk-dismiss."),
  })
}
