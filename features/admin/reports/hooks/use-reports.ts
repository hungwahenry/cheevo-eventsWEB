import * as api from "@/features/admin/reports/api"
import { useQuery } from "@tanstack/react-query"

export const reportsListKey = (filters: api.ListReportsFilters) =>
  ["admin", "reports", filters] as const

export const reportKey = (id: string) => ["admin", "report", id] as const

export function useReports(filters: api.ListReportsFilters = {}) {
  return useQuery({
    queryKey: reportsListKey(filters),
    queryFn: () => api.listReports(filters),
    staleTime: 10_000,
  })
}

export function useReport(id: string) {
  return useQuery({
    queryKey: reportKey(id),
    queryFn: () => api.getReport(id),
    enabled: Boolean(id),
  })
}
