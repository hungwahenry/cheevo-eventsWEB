import * as api from "@/features/admin/broadcasts/api"
import { useQuery } from "@tanstack/react-query"

export const broadcastsListKey = (filters: api.ListBroadcastsFilters) =>
  ["admin", "broadcasts", filters] as const

export const broadcastKey = (id: string) =>
  ["admin", "broadcast", id] as const

export function useBroadcasts(filters: api.ListBroadcastsFilters = {}) {
  return useQuery({
    queryKey: broadcastsListKey(filters),
    queryFn: () => api.listBroadcasts(filters),
    staleTime: 10_000,
  })
}

export function useBroadcast(id: string) {
  return useQuery({
    queryKey: broadcastKey(id),
    queryFn: () => api.getBroadcast(id),
    enabled: Boolean(id),
  })
}
