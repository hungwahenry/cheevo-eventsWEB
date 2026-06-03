import * as api from "@/features/admin/organisation-categories/api"
import type { UpsertOrganisationCategoryPayload } from "@/features/admin/organisation-categories/types"
import { isApiError } from "@/lib/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const organisationCategoriesListKey = () =>
  ["admin", "organisation-categories"] as const

export function useOrganisationCategories() {
  return useQuery({
    queryKey: organisationCategoriesListKey(),
    queryFn: () => api.listOrganisationCategories(),
    staleTime: 10_000,
  })
}

function invalidate(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: organisationCategoriesListKey() })
}

function toastError(fallback: string) {
  return (error: unknown) => {
    toast.error(isApiError(error) ? error.message : fallback)
  }
}

export function useCreateOrganisationCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpsertOrganisationCategoryPayload) =>
      api.createOrganisationCategory(payload),
    onSuccess: () => {
      toast.success("Category created.")
      invalidate(qc)
    },
    onError: toastError("Couldn't create the category."),
  })
}

export function useUpdateOrganisationCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: {
      id: number
      payload: UpsertOrganisationCategoryPayload
    }) => api.updateOrganisationCategory(vars.id, vars.payload),
    onSuccess: () => {
      toast.success("Category updated.")
      invalidate(qc)
    },
    onError: toastError("Couldn't update the category."),
  })
}

export function useDeleteOrganisationCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.deleteOrganisationCategory(id),
    onSuccess: () => {
      toast.success("Category deleted.")
      invalidate(qc)
    },
    onError: toastError("Couldn't delete the category."),
  })
}
