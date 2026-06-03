import * as api from "@/features/admin/payouts/api"
import { payoutKey } from "@/features/admin/payouts/hooks/use-payouts"
import type { AdminPayout } from "@/features/admin/payouts/types"
import { isApiError } from "@/lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

function invalidatePayouts(
  qc: ReturnType<typeof useQueryClient>,
  id?: string
): void {
  qc.invalidateQueries({ queryKey: ["admin", "payouts"] })
  if (id) qc.invalidateQueries({ queryKey: payoutKey(id) })
}

function toastError(fallback: string) {
  return (error: unknown) => {
    toast.error(isApiError(error) ? error.message : fallback)
  }
}

export function useApprovePayout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; note?: string }) =>
      api.approvePayout(vars.id, vars.note),
    onSuccess: (data: AdminPayout) => {
      toast.success("Transfer initiated.")
      invalidatePayouts(qc, data.id)
    },
    onError: toastError("Couldn't approve the payout."),
  })
}

export function useRejectPayout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; note: string }) =>
      api.rejectPayout(vars.id, vars.note),
    onSuccess: (data: AdminPayout) => {
      toast.success("Payout rejected.")
      invalidatePayouts(qc, data.id)
    },
    onError: toastError("Couldn't reject the payout."),
  })
}

export function useMarkPayoutPaid() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; note: string }) =>
      api.markPayoutPaid(vars.id, vars.note),
    onSuccess: (data: AdminPayout) => {
      toast.success("Payout marked paid.")
      invalidatePayouts(qc, data.id)
    },
    onError: toastError("Couldn't mark the payout paid."),
  })
}

export function useRetryPayout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.retryPayout(id),
    onSuccess: (data: AdminPayout) => {
      toast.success("Transfer re-initiated.")
      invalidatePayouts(qc, data.id)
    },
    onError: toastError("Couldn't retry the payout."),
  })
}
