import type {
  AdminUser,
  AdminUserRole,
  AdminUsersPage,
} from "@/features/admin/users/types"
import { api } from "@/lib/api"

export type ListUsersFilters = {
  q?: string
  role?: AdminUserRole
  suspended?: boolean
  from?: string
  to?: string
  per_page?: number
  page?: number
}

export function listUsers(
  filters: ListUsersFilters = {}
): Promise<AdminUsersPage> {
  return api.get<AdminUsersPage>("/admin/users", { params: filters })
}

export function getUser(id: string): Promise<AdminUser> {
  return api.get<AdminUser>(`/admin/users/${id}`)
}

export function suspendUser(id: string, reason: string): Promise<AdminUser> {
  return api.post<AdminUser>(`/admin/users/${id}/suspend`, { reason })
}

export function unsuspendUser(id: string): Promise<AdminUser> {
  return api.post<AdminUser>(`/admin/users/${id}/unsuspend`)
}

export function revokeUserSessions(id: string): Promise<{ revoked: number }> {
  return api.post<{ revoked: number }>(`/admin/users/${id}/revoke-sessions`)
}
