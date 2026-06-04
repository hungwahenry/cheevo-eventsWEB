import * as api from "@/features/admin/pages/api"
import { pageKey } from "@/features/admin/pages/hooks/use-pages"
import type {
  AdminPage,
  UpsertPagePayload,
} from "@/features/admin/pages/types"
import { isApiError } from "@/lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

/**
 * Update the cached page directly (no refetch) so the editor's local state
 * isn't clobbered while the user is mid-edit. The list cache is invalidated
 * so the list re-fetches in the background but the open editor stays calm.
 */
function patchPageInCache(
  qc: ReturnType<typeof useQueryClient>,
  page: AdminPage
): void {
  qc.setQueryData(pageKey(page.id), page)
  qc.invalidateQueries({ queryKey: ["admin", "pages"] })
}

function toastError(fallback: string) {
  return (error: unknown) => {
    toast.error(isApiError(error) ? error.message : fallback)
  }
}

export function useCreatePage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpsertPagePayload) => api.createPage(payload),
    onSuccess: (data: AdminPage) => {
      toast.success("Page created.")
      patchPageInCache(qc, data)
    },
    onError: toastError("Couldn't create the page."),
  })
}

export function useUpdatePage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; payload: UpsertPagePayload }) =>
      api.updatePage(vars.id, vars.payload),
    onSuccess: (data: AdminPage) => {
      patchPageInCache(qc, data)
    },
    onError: toastError("Couldn't save the page."),
  })
}

export function usePublishPage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.publishPage(id),
    onSuccess: (data: AdminPage) => {
      toast.success("Page published.")
      patchPageInCache(qc, data)
    },
    onError: toastError("Couldn't publish."),
  })
}

export function useUnpublishPage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.unpublishPage(id),
    onSuccess: (data: AdminPage) => {
      toast.success("Page unpublished.")
      patchPageInCache(qc, data)
    },
    onError: toastError("Couldn't unpublish."),
  })
}

export function useDeletePage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deletePage(id),
    onSuccess: (_, id) => {
      toast.success("Page deleted.")
      qc.removeQueries({ queryKey: pageKey(id) })
      qc.invalidateQueries({ queryKey: ["admin", "pages"] })
    },
    onError: toastError("Couldn't delete the page."),
  })
}
