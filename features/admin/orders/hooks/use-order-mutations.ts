import * as api from "@/features/admin/orders/api"
import { orderKey } from "@/features/admin/orders/hooks/use-orders"
import type { AdminOrder } from "@/features/admin/orders/types"
import { isApiError } from "@/lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

function invalidateOrders(
  qc: ReturnType<typeof useQueryClient>,
  id?: string
): void {
  qc.invalidateQueries({ queryKey: ["admin", "orders"] })
  if (id) qc.invalidateQueries({ queryKey: orderKey(id) })
}

function toastError(fallback: string) {
  return (error: unknown) => {
    toast.error(isApiError(error) ? error.message : fallback)
  }
}

export function useRefundOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; input: api.RefundOrderInput }) =>
      api.refundOrder(vars.id, vars.input),
    onSuccess: (data: AdminOrder) => {
      toast.success("Order refunded.")
      invalidateOrders(qc, data.id)
    },
    onError: toastError("Couldn't refund the order."),
  })
}

export function useCancelOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; reason: string }) =>
      api.cancelOrder(vars.id, vars.reason),
    onSuccess: (data: AdminOrder) => {
      toast.success("Order cancelled.")
      invalidateOrders(qc, data.id)
    },
    onError: toastError("Couldn't cancel the order."),
  })
}

export function useMarkOrderPaid() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; reason: string }) =>
      api.markOrderPaid(vars.id, vars.reason),
    onSuccess: (data: AdminOrder) => {
      toast.success("Order marked paid.")
      invalidateOrders(qc, data.id)
    },
    onError: toastError("Couldn't mark the order paid."),
  })
}
