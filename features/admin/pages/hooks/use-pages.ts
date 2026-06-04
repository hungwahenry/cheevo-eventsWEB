import * as api from "@/features/admin/pages/api"
import { useQuery } from "@tanstack/react-query"

export const pagesListKey = (filters: api.ListPagesFilters) =>
  ["admin", "pages", filters] as const

export const pageKey = (id: string) => ["admin", "page", id] as const

export function usePages(filters: api.ListPagesFilters = {}) {
  return useQuery({
    queryKey: pagesListKey(filters),
    queryFn: () => api.listPages(filters),
    staleTime: 10_000,
  })
}

export function usePage(id: string) {
  return useQuery({
    queryKey: pageKey(id),
    queryFn: () => api.getPage(id),
    enabled: Boolean(id),
  })
}
