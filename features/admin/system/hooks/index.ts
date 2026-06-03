import * as api from "@/features/admin/system/api"
import type {
  UpdateConfigPayload,
  UpdateFlagPayload,
} from "@/features/admin/system/types"
import { isApiError } from "@/lib/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const flagsKey = () => ["admin", "feature-flags"] as const
export const configsKey = () => ["admin", "system-configs"] as const

export function useFeatureFlags() {
  return useQuery({
    queryKey: flagsKey(),
    queryFn: () => api.listFeatureFlags(),
    staleTime: 10_000,
  })
}

export function useSystemConfigs() {
  return useQuery({
    queryKey: configsKey(),
    queryFn: () => api.listSystemConfigs(),
    staleTime: 10_000,
  })
}

function toastError(fallback: string) {
  return (error: unknown) => {
    toast.error(isApiError(error) ? error.message : fallback)
  }
}

export function useUpdateFeatureFlag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; payload: UpdateFlagPayload }) =>
      api.updateFeatureFlag(vars.id, vars.payload),
    onSuccess: () => {
      toast.success("Flag updated.")
      qc.invalidateQueries({ queryKey: flagsKey() })
    },
    onError: toastError("Couldn't update the flag."),
  })
}

export function useUpdateSystemConfig() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; payload: UpdateConfigPayload }) =>
      api.updateSystemConfig(vars.id, vars.payload),
    onSuccess: () => {
      toast.success("Config updated.")
      qc.invalidateQueries({ queryKey: configsKey() })
    },
    onError: toastError("Couldn't update the config."),
  })
}

export function useResetSystemConfig() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.resetSystemConfig(id),
    onSuccess: () => {
      toast.success("Reset to default.")
      qc.invalidateQueries({ queryKey: configsKey() })
    },
    onError: toastError("Couldn't reset."),
  })
}
