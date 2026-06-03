import * as api from "@/features/admin/users/api"
import { userKey } from "@/features/admin/users/hooks/use-users"
import type { AdminUser } from "@/features/admin/users/types"
import { isApiError } from "@/lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

function invalidateUsers(
  qc: ReturnType<typeof useQueryClient>,
  id?: string
): void {
  qc.invalidateQueries({ queryKey: ["admin", "users"] })
  if (id) qc.invalidateQueries({ queryKey: userKey(id) })
}

function toastError(fallback: string) {
  return (error: unknown) => {
    toast.error(isApiError(error) ? error.message : fallback)
  }
}

export function useSuspendUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; reason: string }) =>
      api.suspendUser(vars.id, vars.reason),
    onSuccess: (data: AdminUser) => {
      toast.success("User suspended.")
      invalidateUsers(qc, data.id)
    },
    onError: toastError("Couldn't suspend the user."),
  })
}

export function useUnsuspendUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.unsuspendUser(id),
    onSuccess: (data: AdminUser) => {
      toast.success("User unsuspended.")
      invalidateUsers(qc, data.id)
    },
    onError: toastError("Couldn't unsuspend the user."),
  })
}

export function useRevokeUserSessions() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.revokeUserSessions(id),
    onSuccess: (data, id) => {
      toast.success(
        data.revoked === 0
          ? "No active sessions to revoke."
          : `Revoked ${data.revoked} session${data.revoked === 1 ? "" : "s"}.`
      )
      invalidateUsers(qc, id)
    },
    onError: toastError("Couldn't revoke sessions."),
  })
}
