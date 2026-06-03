import type {
  AdminWelcomeContent,
  UpdateWelcomePayload,
} from "@/features/admin/welcome/types"
import { api } from "@/lib/api"

export function getWelcomeContent(): Promise<AdminWelcomeContent> {
  return api.get<AdminWelcomeContent>("/admin/welcome")
}

export function updateWelcomeContent(
  payload: UpdateWelcomePayload
): Promise<AdminWelcomeContent> {
  const form = new FormData()
  if (payload.headline !== undefined) form.append("headline", payload.headline)
  if (payload.subheadline !== undefined)
    form.append("subheadline", payload.subheadline)
  if (payload.background) form.append("background", payload.background)
  if (payload.clear_background) form.append("clear_background", "1")

  return api.post<AdminWelcomeContent>("/admin/welcome", form, {
    headers: { "Content-Type": "multipart/form-data" },
  })
}
