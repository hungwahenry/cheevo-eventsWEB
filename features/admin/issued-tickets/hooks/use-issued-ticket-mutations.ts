import * as api from "@/features/admin/issued-tickets/api"
import type { AdminIssuedTicket } from "@/features/admin/issued-tickets/types"
import { isApiError } from "@/lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

function invalidate(qc: ReturnType<typeof useQueryClient>): void {
  qc.invalidateQueries({ queryKey: ["admin", "issued-tickets"] })
}

function toastError(fallback: string) {
  return (error: unknown) => {
    toast.error(isApiError(error) ? error.message : fallback)
  }
}

export function useRevokeIssuedTicket() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; reason: string }) =>
      api.revokeIssuedTicket(vars.id, vars.reason),
    onSuccess: (_data: AdminIssuedTicket) => {
      toast.success("Ticket revoked.")
      invalidate(qc)
    },
    onError: toastError("Couldn't revoke the ticket."),
  })
}

export function useReissueIssuedTicket() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.reissueIssuedTicket(id),
    onSuccess: (data: AdminIssuedTicket) => {
      toast.success(`Ticket reissued. New code: ${data.code}`)
      invalidate(qc)
    },
    onError: toastError("Couldn't reissue the ticket."),
  })
}

export function useTransferIssuedTicket() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: { id: string; toUserId: string; reason?: string }) =>
      api.transferIssuedTicket(vars.id, vars.toUserId, vars.reason),
    onSuccess: (_data: AdminIssuedTicket) => {
      toast.success("Ticket transferred.")
      invalidate(qc)
    },
    onError: toastError("Couldn't transfer the ticket."),
  })
}
