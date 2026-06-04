import type {
  AdminPage,
  AdminPagesPage,
  UpsertPagePayload,
} from "@/features/admin/pages/types"
import { api } from "@/lib/api"

export type ListPagesFilters = {
  q?: string
  published?: boolean
  per_page?: number
  page?: number
}

export function listPages(
  filters: ListPagesFilters = {}
): Promise<AdminPagesPage> {
  return api.get<AdminPagesPage>("/admin/pages", { params: filters })
}

export function getPage(id: string): Promise<AdminPage> {
  return api.get<AdminPage>(`/admin/pages/${id}`)
}

export function createPage(payload: UpsertPagePayload): Promise<AdminPage> {
  return api.post<AdminPage>("/admin/pages", payload)
}

export function updatePage(
  id: string,
  payload: UpsertPagePayload
): Promise<AdminPage> {
  return api.patch<AdminPage>(`/admin/pages/${id}`, payload)
}

export function publishPage(id: string): Promise<AdminPage> {
  return api.post<AdminPage>(`/admin/pages/${id}/publish`)
}

export function unpublishPage(id: string): Promise<AdminPage> {
  return api.post<AdminPage>(`/admin/pages/${id}/unpublish`)
}

export function deletePage(id: string): Promise<void> {
  return api.delete<void>(`/admin/pages/${id}`)
}
