import type {
  AdminBroadcast,
  AdminBroadcastStatus,
  AdminBroadcastsPage,
} from "@/features/admin/broadcasts/types"
import { api } from "@/lib/api"

export type ListBroadcastsFilters = {
  status?: AdminBroadcastStatus
  organisation_id?: string
  event_id?: string
  per_page?: number
  page?: number
}

export function listBroadcasts(
  filters: ListBroadcastsFilters = {}
): Promise<AdminBroadcastsPage> {
  return api.get<AdminBroadcastsPage>("/admin/broadcasts", { params: filters })
}

export function getBroadcast(id: string): Promise<AdminBroadcast> {
  return api.get<AdminBroadcast>(`/admin/broadcasts/${id}`)
}

export function cancelBroadcast(id: string): Promise<AdminBroadcast> {
  return api.post<AdminBroadcast>(`/admin/broadcasts/${id}/cancel`)
}
