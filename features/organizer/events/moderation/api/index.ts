import type {
  FlagResponse,
  ModerationCommentsPage,
} from "@/features/organizer/events/moderation/types"
import { api } from "@/lib/api"

export function listModerationComments(
  eventId: string,
  page: number,
  perPage = 20,
  options: { q?: string; flaggedOnly?: boolean } = {}
): Promise<ModerationCommentsPage> {
  return api.get<ModerationCommentsPage>(
    `/organizer/events/${eventId}/comments`,
    {
      params: {
        page,
        per_page: perPage,
        ...(options.q ? { q: options.q } : {}),
        ...(options.flaggedOnly ? { flagged_only: 1 } : {}),
      },
    }
  )
}

export function listModerationReplies(
  eventId: string,
  commentId: string,
  page: number,
  perPage = 20
): Promise<ModerationCommentsPage> {
  return api.get<ModerationCommentsPage>(
    `/organizer/events/${eventId}/comments/${commentId}/replies`,
    { params: { page, per_page: perPage } }
  )
}

export function flagComment(
  eventId: string,
  commentId: string,
  reason?: string
): Promise<FlagResponse> {
  return api.post<FlagResponse>(
    `/organizer/events/${eventId}/comments/${commentId}/flag`,
    { reason }
  )
}

export function unflagComment(
  eventId: string,
  commentId: string
): Promise<FlagResponse> {
  return api.delete<FlagResponse>(
    `/organizer/events/${eventId}/comments/${commentId}/flag`
  )
}
