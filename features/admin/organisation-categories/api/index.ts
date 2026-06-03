import type {
  AdminOrganisationCategory,
  UpsertOrganisationCategoryPayload,
} from "@/features/admin/organisation-categories/types"
import { api } from "@/lib/api"

export function listOrganisationCategories(): Promise<
  AdminOrganisationCategory[]
> {
  return api.get<AdminOrganisationCategory[]>("/admin/organisation-categories")
}

export function createOrganisationCategory(
  payload: UpsertOrganisationCategoryPayload
): Promise<AdminOrganisationCategory> {
  return api.post<AdminOrganisationCategory>(
    "/admin/organisation-categories",
    payload
  )
}

export function updateOrganisationCategory(
  id: number,
  payload: UpsertOrganisationCategoryPayload
): Promise<AdminOrganisationCategory> {
  return api.patch<AdminOrganisationCategory>(
    `/admin/organisation-categories/${id}`,
    payload
  )
}

export function deleteOrganisationCategory(id: number): Promise<void> {
  return api.delete<void>(`/admin/organisation-categories/${id}`)
}
