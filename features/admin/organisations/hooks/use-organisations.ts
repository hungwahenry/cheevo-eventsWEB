import * as api from "@/features/admin/organisations/api"
import { useQuery } from "@tanstack/react-query"

export const organisationsListKey = (filters: api.ListOrganisationsFilters) =>
  ["admin", "organisations", filters] as const

export const organisationKey = (id: string) =>
  ["admin", "organisation", id] as const

export function useOrganisations(filters: api.ListOrganisationsFilters = {}) {
  return useQuery({
    queryKey: organisationsListKey(filters),
    queryFn: () => api.listOrganisations(filters),
    staleTime: 10_000,
  })
}

export function useOrganisation(id: string) {
  return useQuery({
    queryKey: organisationKey(id),
    queryFn: () => api.getOrganisation(id),
    enabled: Boolean(id),
  })
}
