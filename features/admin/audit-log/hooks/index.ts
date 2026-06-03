import * as api from "@/features/admin/audit-log/api"
import { useQuery } from "@tanstack/react-query"

export const auditLogKey = (filters: api.ListAuditLogFilters) =>
  ["admin", "audit-log", filters] as const

export function useAuditLog(filters: api.ListAuditLogFilters = {}) {
  return useQuery({
    queryKey: auditLogKey(filters),
    queryFn: () => api.listAuditLog(filters),
    staleTime: 10_000,
  })
}
