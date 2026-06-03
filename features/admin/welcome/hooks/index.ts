import * as api from "@/features/admin/welcome/api"
import type { UpdateWelcomePayload } from "@/features/admin/welcome/types"
import { isApiError } from "@/lib/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const welcomeKey = () => ["admin", "welcome"] as const

export function useWelcomeContent() {
  return useQuery({
    queryKey: welcomeKey(),
    queryFn: () => api.getWelcomeContent(),
    staleTime: 10_000,
  })
}

export function useUpdateWelcomeContent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateWelcomePayload) =>
      api.updateWelcomeContent(payload),
    onSuccess: () => {
      toast.success("Welcome content updated.")
      qc.invalidateQueries({ queryKey: welcomeKey() })
    },
    onError: (error: unknown) => {
      toast.error(
        isApiError(error) ? error.message : "Couldn't update the welcome content."
      )
    },
  })
}
