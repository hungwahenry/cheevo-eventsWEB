import * as api from "@/features/admin/social-platforms/api"
import type { UpsertSocialPlatformPayload } from "@/features/admin/social-platforms/types"
import { isApiError } from "@/lib/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const socialPlatformsListKey = () =>
  ["admin", "social-platforms"] as const

export function useSocialPlatforms() {
  return useQuery({
    queryKey: socialPlatformsListKey(),
    queryFn: () => api.listSocialPlatforms(),
    staleTime: 10_000,
  })
}

function invalidate(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: socialPlatformsListKey() })
}

function toastError(fallback: string) {
  return (error: unknown) => {
    toast.error(isApiError(error) ? error.message : fallback)
  }
}

export function useCreateSocialPlatform() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpsertSocialPlatformPayload) =>
      api.createSocialPlatform(payload),
    onSuccess: () => {
      toast.success("Platform created.")
      invalidate(qc)
    },
    onError: toastError("Couldn't create the platform."),
  })
}

export function useUpdateSocialPlatform() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: {
      id: number
      payload: UpsertSocialPlatformPayload
    }) => api.updateSocialPlatform(vars.id, vars.payload),
    onSuccess: () => {
      toast.success("Platform updated.")
      invalidate(qc)
    },
    onError: toastError("Couldn't update the platform."),
  })
}

export function useDeleteSocialPlatform() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.deleteSocialPlatform(id),
    onSuccess: () => {
      toast.success("Platform deleted.")
      invalidate(qc)
    },
    onError: toastError("Couldn't delete the platform."),
  })
}
