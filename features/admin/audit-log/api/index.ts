import type { AdminAuditLogPage } from "@/features/admin/audit-log/types"
import { api } from "@/lib/api"

export type ListAuditLogFilters = {
  q?: string
  action?: string
  admin_user_id?: string
  target_type?: string
  target_id?: string
  from?: string
  to?: string
  per_page?: number
  page?: number
}

export function listAuditLog(
  filters: ListAuditLogFilters = {}
): Promise<AdminAuditLogPage> {
  return api.get<AdminAuditLogPage>("/admin/audit-log", { params: filters })
}
