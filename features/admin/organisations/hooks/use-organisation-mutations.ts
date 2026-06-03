import * as api from "@/features/admin/organisations/api"
import { organisationKey } from "@/features/admin/organisations/hooks/use-organisations"
import type { AdminOrganisation } from "@/features/admin/organisations/types"
import { isApiError } from "@/lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

function invalidateOrgs(
  qc: ReturnType<typeof useQueryClient>,
  id?: string
): void {
  qc.invalidateQueries({ queryKey: ["admin", "organisations"] })
  if (id) qc.invalidateQueries({ queryKey: organisationKey(id) })
}

function toastError(fallback: string) {
  return (error: unknown) => {
    toast.error(isApiError(error) ? error.message : fallback)
  }
}

export function useSuspendOrganisation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; reason: string }) =>
      api.suspendOrganisation(vars.id, vars.reason),
    onSuccess: (data: AdminOrganisation) => {
      toast.success("Organisation suspended.")
      invalidateOrgs(qc, data.id)
    },
    onError: toastError("Couldn't suspend the organisation."),
  })
}

export function useUnsuspendOrganisation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.unsuspendOrganisation(id),
    onSuccess: (data: AdminOrganisation) => {
      toast.success("Organisation reinstated.")
      invalidateOrgs(qc, data.id)
    },
    onError: toastError("Couldn't reinstate the organisation."),
  })
}

export function useChangeOrganisationOwner() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; userId: string; reason?: string }) =>
      api.changeOrganisationOwner(vars.id, vars.userId, vars.reason),
    onSuccess: (data: AdminOrganisation) => {
      toast.success("Owner changed.")
      invalidateOrgs(qc, data.id)
    },
    onError: toastError("Couldn't change the owner."),
  })
}

export function useDeleteOrganisation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; reason: string }) =>
      api.deleteOrganisation(vars.id, vars.reason),
    onSuccess: (_, vars) => {
      toast.success("Organisation deleted.")
      invalidateOrgs(qc, vars.id)
    },
    onError: toastError("Couldn't delete the organisation."),
  })
}
