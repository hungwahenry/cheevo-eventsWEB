import * as api from "@/features/admin/users/api"
import { useQuery } from "@tanstack/react-query"

export const usersListKey = (filters: api.ListUsersFilters) =>
  ["admin", "users", filters] as const

export const userKey = (id: string) => ["admin", "user", id] as const

export function useUsers(filters: api.ListUsersFilters = {}) {
  return useQuery({
    queryKey: usersListKey(filters),
    queryFn: () => api.listUsers(filters),
    staleTime: 10_000,
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: userKey(id),
    queryFn: () => api.getUser(id),
    enabled: Boolean(id),
  })
}
