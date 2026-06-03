import * as api from "@/features/admin/comments/api"
import { useQuery } from "@tanstack/react-query"

export const commentsListKey = (filters: api.ListCommentsFilters) =>
  ["admin", "comments", filters] as const

export function useComments(filters: api.ListCommentsFilters = {}) {
  return useQuery({
    queryKey: commentsListKey(filters),
    queryFn: () => api.listComments(filters),
    staleTime: 10_000,
  })
}
