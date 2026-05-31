import { flagComment, unflagComment } from "@/features/organizer/events/moderation/api"
import type { ModerationComment } from "@/features/organizer/events/moderation/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

type Args = { comment: ModerationComment; next: boolean; reason?: string }

export function useToggleFlag(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ comment, next, reason }: Args) =>
      next
        ? flagComment(eventId, comment.id, reason)
        : unflagComment(eventId, comment.id),
    onSuccess: (_data, { next }) => {
      toast.success(next ? "Flagged for review." : "Flag removed.")
      queryClient.invalidateQueries({
        queryKey: ["organizer-event-comments", eventId],
      })
      queryClient.invalidateQueries({
        queryKey: ["organizer-event-comment-replies", eventId],
      })
    },
  })
}
