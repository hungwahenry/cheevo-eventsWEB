import * as api from "@/features/admin/search/api"
import { isApiError } from "@/lib/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const searchHealthKey = () => ["admin", "search-health"] as const

export function useSearchHealth() {
  return useQuery({
    queryKey: searchHealthKey(),
    queryFn: () => api.getSearchHealth(),
    staleTime: 5_000,
    refetchInterval: 5_000,
  })
}

export function useReindexSearch() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => api.reindexSearch(),
    onSuccess: () => {
      toast.success("Reindex queued.")
      qc.invalidateQueries({ queryKey: searchHealthKey() })
    },
    onError: (error: unknown) => {
      toast.error(
        isApiError(error) ? error.message : "Couldn't queue the reindex."
      )
    },
  })
}
