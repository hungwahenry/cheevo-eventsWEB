import * as api from "@/features/admin/payouts/api"
import { useQuery } from "@tanstack/react-query"

export const payoutsListKey = (filters: api.ListPayoutsFilters) =>
  ["admin", "payouts", filters] as const

export const payoutKey = (id: string) => ["admin", "payout", id] as const

export function usePayouts(filters: api.ListPayoutsFilters = {}) {
  return useQuery({
    queryKey: payoutsListKey(filters),
    queryFn: () => api.listPayouts(filters),
    staleTime: 10_000,
  })
}

export function usePayout(id: string) {
  return useQuery({
    queryKey: payoutKey(id),
    queryFn: () => api.getPayout(id),
    enabled: Boolean(id),
  })
}
