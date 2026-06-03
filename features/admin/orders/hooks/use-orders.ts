import * as api from "@/features/admin/orders/api"
import { useQuery } from "@tanstack/react-query"

export const ordersListKey = (filters: api.ListOrdersFilters) =>
  ["admin", "orders", filters] as const

export const orderKey = (id: string) => ["admin", "order", id] as const

export function useOrders(filters: api.ListOrdersFilters = {}) {
  return useQuery({
    queryKey: ordersListKey(filters),
    queryFn: () => api.listOrders(filters),
    staleTime: 10_000,
  })
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKey(id),
    queryFn: () => api.getOrder(id),
    enabled: Boolean(id),
  })
}
