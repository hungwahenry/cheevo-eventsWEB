import * as api from "@/features/admin/report-reasons/api"
import type { UpsertReportReasonPayload } from "@/features/admin/report-reasons/types"
import { isApiError } from "@/lib/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const reportReasonsListKey = () => ["admin", "report-reasons"] as const

export function useReportReasons() {
  return useQuery({
    queryKey: reportReasonsListKey(),
    queryFn: () => api.listReportReasons(),
    staleTime: 10_000,
  })
}

function invalidate(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: reportReasonsListKey() })
}

function toastError(fallback: string) {
  return (error: unknown) => {
    toast.error(isApiError(error) ? error.message : fallback)
  }
}

export function useCreateReportReason() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpsertReportReasonPayload) =>
      api.createReportReason(payload),
    onSuccess: () => {
      toast.success("Reason created.")
      invalidate(qc)
    },
    onError: toastError("Couldn't create the reason."),
  })
}

export function useUpdateReportReason() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; payload: UpsertReportReasonPayload }) =>
      api.updateReportReason(vars.id, vars.payload),
    onSuccess: () => {
      toast.success("Reason updated.")
      invalidate(qc)
    },
    onError: toastError("Couldn't update the reason."),
  })
}

export function useDeleteReportReason() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteReportReason(id),
    onSuccess: () => {
      toast.success("Reason deleted.")
      invalidate(qc)
    },
    onError: toastError("Couldn't delete the reason."),
  })
}
