import * as api from "@/features/admin/comments/api"
import { isApiError } from "@/lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

function invalidateComments(qc: ReturnType<typeof useQueryClient>): void {
  qc.invalidateQueries({ queryKey: ["admin", "comments"] })
}

function toastError(fallback: string) {
  return (error: unknown) => {
    toast.error(isApiError(error) ? error.message : fallback)
  }
}

export function useDeleteComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; reason: string }) =>
      api.deleteComment(vars.id, vars.reason),
    onSuccess: () => {
      toast.success("Comment deleted.")
      invalidateComments(qc)
    },
    onError: toastError("Couldn't delete the comment."),
  })
}

export function useDismissCommentFlags() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.dismissFlags(id),
    onSuccess: (data) => {
      toast.success(
        data.cleared === 0
          ? "No flags to clear."
          : `Cleared ${data.cleared} flag${data.cleared === 1 ? "" : "s"}.`
      )
      invalidateComments(qc)
    },
    onError: toastError("Couldn't clear flags."),
  })
}
