import * as api from "@/features/admin/broadcast-suppressions/api"
import { isApiError } from "@/lib/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const suppressionsListKey = (filters: api.ListSuppressionsFilters) =>
  ["admin", "broadcast-suppressions", filters] as const

export function useSuppressions(filters: api.ListSuppressionsFilters = {}) {
  return useQuery({
    queryKey: suppressionsListKey(filters),
    queryFn: () => api.listSuppressions(filters),
    staleTime: 10_000,
  })
}

export function useDeleteSuppression() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteSuppression(id),
    onSuccess: () => {
      toast.success("Suppression removed.")
      qc.invalidateQueries({ queryKey: ["admin", "broadcast-suppressions"] })
    },
    onError: (error: unknown) => {
      toast.error(
        isApiError(error) ? error.message : "Couldn't remove the suppression."
      )
    },
  })
}
