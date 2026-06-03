import type { AdminCommentsPage } from "@/features/admin/comments/types"
import { api } from "@/lib/api"

export type ListCommentsFilters = {
  q?: string
  event_id?: string
  user_id?: string
  flagged?: boolean
  per_page?: number
  page?: number
}

export function listComments(
  filters: ListCommentsFilters = {}
): Promise<AdminCommentsPage> {
  return api.get<AdminCommentsPage>("/admin/comments", { params: filters })
}

export function deleteComment(
  id: string,
  reason: string
): Promise<{ deleted: true }> {
  return api.delete<{ deleted: true }>(`/admin/comments/${id}`, {
    data: { reason },
  })
}

export function dismissFlags(id: string): Promise<{ cleared: number }> {
  return api.post<{ cleared: number }>(`/admin/comments/${id}/dismiss-flags`)
}
