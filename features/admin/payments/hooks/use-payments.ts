import * as api from "@/features/admin/payments/api"
import { useQuery } from "@tanstack/react-query"

export const paymentsListKey = (filters: api.ListPaymentsFilters) =>
  ["admin", "payments", filters] as const

export const paymentKey = (id: string) => ["admin", "payment", id] as const

export function usePayments(filters: api.ListPaymentsFilters = {}) {
  return useQuery({
    queryKey: paymentsListKey(filters),
    queryFn: () => api.listPayments(filters),
    staleTime: 10_000,
  })
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: paymentKey(id),
    queryFn: () => api.getPayment(id),
    enabled: Boolean(id),
  })
}
