import * as api from "@/features/admin/events/api"
import { eventKey } from "@/features/admin/events/hooks/use-events"
import type { AdminEvent } from "@/features/admin/events/types"
import { isApiError } from "@/lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

function invalidateEvents(
  qc: ReturnType<typeof useQueryClient>,
  id?: string
): void {
  qc.invalidateQueries({ queryKey: ["admin", "events"] })
  if (id) qc.invalidateQueries({ queryKey: eventKey(id) })
}

function toastError(fallback: string) {
  return (error: unknown) => {
    toast.error(isApiError(error) ? error.message : fallback)
  }
}

export function useUnpublishEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.unpublishEvent(id),
    onSuccess: (data: AdminEvent) => {
      toast.success("Event unpublished.")
      invalidateEvents(qc, data.id)
    },
    onError: toastError("Couldn't unpublish."),
  })
}

export function useMarkEventPast() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.markEventPast(id),
    onSuccess: (data: AdminEvent) => {
      toast.success("Event marked past.")
      invalidateEvents(qc, data.id)
    },
    onError: toastError("Couldn't mark past."),
  })
}

export function useLockEventComments() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; reason?: string }) =>
      api.lockEventComments(vars.id, vars.reason),
    onSuccess: (data: AdminEvent) => {
      toast.success("Comments locked.")
      invalidateEvents(qc, data.id)
    },
    onError: toastError("Couldn't lock comments."),
  })
}

export function useUnlockEventComments() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.unlockEventComments(id),
    onSuccess: (data: AdminEvent) => {
      toast.success("Comments unlocked.")
      invalidateEvents(qc, data.id)
    },
    onError: toastError("Couldn't unlock comments."),
  })
}

export function useDeleteEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; reason: string }) =>
      api.deleteEvent(vars.id, vars.reason),
    onSuccess: (_, vars) => {
      toast.success("Event deleted.")
      invalidateEvents(qc, vars.id)
    },
    onError: toastError("Couldn't delete the event."),
  })
}
