import * as api from "@/features/admin/payments/api"
import { paymentKey } from "@/features/admin/payments/hooks/use-payments"
import type { AdminPayment } from "@/features/admin/payments/types"
import { isApiError } from "@/lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

function invalidatePayments(
  qc: ReturnType<typeof useQueryClient>,
  id?: string
): void {
  qc.invalidateQueries({ queryKey: ["admin", "payments"] })
  if (id) qc.invalidateQueries({ queryKey: paymentKey(id) })
}

function toastError(fallback: string) {
  return (error: unknown) => {
    toast.error(isApiError(error) ? error.message : fallback)
  }
}

export function useResyncPayment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.resyncPayment(id),
    onSuccess: (data: AdminPayment) => {
      toast.success(`Status is now ${data.status}.`)
      invalidatePayments(qc, data.id)
    },
    onError: toastError("Couldn't resync the payment."),
  })
}

export function useMarkPaymentSuccess() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; reason: string }) =>
      api.markPaymentSuccess(vars.id, vars.reason),
    onSuccess: (data: AdminPayment) => {
      toast.success("Payment marked successful.")
      invalidatePayments(qc, data.id)
    },
    onError: toastError("Couldn't mark the payment successful."),
  })
}
