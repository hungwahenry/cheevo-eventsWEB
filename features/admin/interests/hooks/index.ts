import * as api from "@/features/admin/interests/api"
import type { UpsertInterestPayload } from "@/features/admin/interests/types"
import { isApiError } from "@/lib/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const interestsListKey = () => ["admin", "interests"] as const

export function useInterests() {
  return useQuery({
    queryKey: interestsListKey(),
    queryFn: () => api.listInterests(),
    staleTime: 10_000,
  })
}

function invalidate(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: interestsListKey() })
}

function toastError(fallback: string) {
  return (error: unknown) => {
    toast.error(isApiError(error) ? error.message : fallback)
  }
}

export function useCreateInterest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpsertInterestPayload) => api.createInterest(payload),
    onSuccess: () => {
      toast.success("Interest created.")
      invalidate(qc)
    },
    onError: toastError("Couldn't create the interest."),
  })
}

export function useUpdateInterest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: number; payload: UpsertInterestPayload }) =>
      api.updateInterest(vars.id, vars.payload),
    onSuccess: () => {
      toast.success("Interest updated.")
      invalidate(qc)
    },
    onError: toastError("Couldn't update the interest."),
  })
}

export function useDeleteInterest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.deleteInterest(id),
    onSuccess: () => {
      toast.success("Interest deleted.")
      invalidate(qc)
    },
    onError: toastError("Couldn't delete the interest."),
  })
}
