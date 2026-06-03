import * as api from "@/features/admin/issued-tickets/api"
import { useQuery } from "@tanstack/react-query"

export const issuedTicketsListKey = (filters: api.ListIssuedTicketsFilters) =>
  ["admin", "issued-tickets", filters] as const

export function useIssuedTickets(filters: api.ListIssuedTicketsFilters = {}) {
  return useQuery({
    queryKey: issuedTicketsListKey(filters),
    queryFn: () => api.listIssuedTickets(filters),
    staleTime: 10_000,
  })
}
