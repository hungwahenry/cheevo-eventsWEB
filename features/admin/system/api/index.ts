import type {
  AdminFeatureFlag,
  AdminSystemConfig,
  UpdateConfigPayload,
  UpdateFlagPayload,
} from "@/features/admin/system/types"
import { api } from "@/lib/api"

export function listFeatureFlags(): Promise<AdminFeatureFlag[]> {
  return api.get<AdminFeatureFlag[]>("/admin/feature-flags")
}

export function updateFeatureFlag(
  id: string,
  payload: UpdateFlagPayload
): Promise<AdminFeatureFlag> {
  return api.patch<AdminFeatureFlag>(`/admin/feature-flags/${id}`, payload)
}

export function listSystemConfigs(): Promise<AdminSystemConfig[]> {
  return api.get<AdminSystemConfig[]>("/admin/system-configs")
}

export function updateSystemConfig(
  id: string,
  payload: UpdateConfigPayload
): Promise<AdminSystemConfig> {
  return api.patch<AdminSystemConfig>(`/admin/system-configs/${id}`, payload)
}

export function resetSystemConfig(id: string): Promise<AdminSystemConfig> {
  return api.post<AdminSystemConfig>(`/admin/system-configs/${id}/reset`)
}
