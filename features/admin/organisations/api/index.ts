import type {
  AdminOrganisation,
  AdminOrganisationsPage,
} from "@/features/admin/organisations/types"
import { api } from "@/lib/api"

export type ListOrganisationsFilters = {
  q?: string
  category_id?: string
  suspended?: boolean
  has_payout_account?: boolean
  per_page?: number
  page?: number
}

export function listOrganisations(
  filters: ListOrganisationsFilters = {}
): Promise<AdminOrganisationsPage> {
  return api.get<AdminOrganisationsPage>("/admin/organisations", {
    params: filters,
  })
}

export function getOrganisation(id: string): Promise<AdminOrganisation> {
  return api.get<AdminOrganisation>(`/admin/organisations/${id}`)
}

export function suspendOrganisation(
  id: string,
  reason: string
): Promise<AdminOrganisation> {
  return api.post<AdminOrganisation>(
    `/admin/organisations/${id}/suspend`,
    { reason }
  )
}

export function unsuspendOrganisation(
  id: string
): Promise<AdminOrganisation> {
  return api.post<AdminOrganisation>(`/admin/organisations/${id}/unsuspend`)
}

export function changeOrganisationOwner(
  id: string,
  userId: string,
  reason?: string
): Promise<AdminOrganisation> {
  return api.post<AdminOrganisation>(
    `/admin/organisations/${id}/change-owner`,
    { user_id: userId, reason }
  )
}

export function deleteOrganisation(id: string, reason: string): Promise<void> {
  return api.delete<void>(`/admin/organisations/${id}`, { data: { reason } })
}
