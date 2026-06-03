import type {
  AdminSocialPlatform,
  UpsertSocialPlatformPayload,
} from "@/features/admin/social-platforms/types"
import { api } from "@/lib/api"

export function listSocialPlatforms(): Promise<AdminSocialPlatform[]> {
  return api.get<AdminSocialPlatform[]>("/admin/social-platforms")
}

export function createSocialPlatform(
  payload: UpsertSocialPlatformPayload
): Promise<AdminSocialPlatform> {
  return api.post<AdminSocialPlatform>("/admin/social-platforms", payload)
}

export function updateSocialPlatform(
  id: number,
  payload: UpsertSocialPlatformPayload
): Promise<AdminSocialPlatform> {
  return api.patch<AdminSocialPlatform>(
    `/admin/social-platforms/${id}`,
    payload
  )
}

export function deleteSocialPlatform(id: number): Promise<void> {
  return api.delete<void>(`/admin/social-platforms/${id}`)
}
